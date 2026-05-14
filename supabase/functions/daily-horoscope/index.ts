// supabase/functions/daily-horoscope/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function toBase64Url(data: string | Uint8Array): string {
  let base64: string;
  if (typeof data === 'string') {
    base64 = btoa(unescape(encodeURIComponent(data)));
  } else {
    base64 = btoa(Array.from(data, b => String.fromCharCode(b)).join(''));
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getAccessToken(serviceAccount: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header  = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = toBase64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }));
  const signingInput = `${header}.${payload}`;
  const pemKey = serviceAccount.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "").trim();
  const keyData = Uint8Array.from(atob(pemKey), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
    false, ["sign"]
  );
  const signatureBytes = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${toBase64Url(new Uint8Array(signatureBytes))}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error(`Auth failed: ${JSON.stringify(tokenData)}`);
  return tokenData.access_token;
}

async function sendFCM(token: string, title: string, body: string, data: Record<string, string>, accessToken: string, projectId: string) {
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          android: {
            priority: "high",
            notification: {
              channel_id: "astra_default",
              sound: "default"
            }
          },
          data
        }
      })
    }
  );
  return res.json();
}

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("MY_SUPABASE_URL")!,
      Deno.env.get("MY_SERVICE_ROLE_KEY")!
    );

    const today = new Date().toISOString().split('T')[0];
    console.log(`[daily-horoscope] Processing ${today}`);

    const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!);
    const accessToken = await getAccessToken(serviceAccount);
    const projectId = serviceAccount.project_id;

    let sent = 0;
    let failed = 0;
    let fallbackSent = 0;
    let skippedOptOut = 0;
    const invalidTokens: string[] = [];

    // ÉTAPE 1 : Tokens
    const { data: tokens, error: errTokens } = await supabase
      .from("notification_tokens")
      .select("token, user_id");

    if (errTokens) throw errTokens;
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: "no tokens" }), { status: 200 });
    }

    // ÉTAPE 2 : Profiles (avec notifications_enabled)
    const userIds = [...new Set(tokens.map(t => t.user_id))];
    const { data: profiles, error: errProfiles } = await supabase
      .from("profiles")
      .select("id, nom, signe_solaire, notifications_enabled")
      .in("id", userIds);

    if (errProfiles) throw errProfiles;
    const profileMap = new Map();
    for (const p of (profiles || [])) profileMap.set(p.id, p);

    // ÉTAPE 3 : Messages du jour
    const { data: messages, error: errMessages } = await supabase
      .from("daily_messages")
      .select("user_id, message, planete_nom, planete_signe, maison, source")
      .eq("date", today);

    if (errMessages) throw errMessages;
    const messageMap = new Map();
    for (const m of (messages || [])) messageMap.set(m.user_id, m);

    // ÉTAPE 4 : Sépare et envoie (avec filtre opt-out)
    const withMessage: any[] = [];
    const withoutMessage: any[] = [];
    const optedOut: any[] = [];

    for (const t of tokens) {
      const profile = profileMap.get(t.user_id);
      
      // ─── CHECK OPT-OUT ───
      if (profile?.notifications_enabled === false) {
        optedOut.push(t);
        continue;
      }
      
      const msg = messageMap.get(t.user_id);
      if (msg) {
        withMessage.push({ ...t, profile, daily_message: msg });
      } else {
        withoutMessage.push({ ...t, profile });
      }
    }

    skippedOptOut = optedOut.length;
    console.log(`[daily-horoscope] ${skippedOptOut} users opted out`);

    // Envoie personnalisés
    for (const row of withMessage) {
      const prenom = row.profile?.nom?.split(' ')[0] || 'Voyageur';
      const dm = row.daily_message;
      const result = await sendFCM(
        row.token,
        `✦ Ton ciel du jour, ${prenom}`,
        dm.message,
        {
          screen: "home",
          type: "horoscope_quotidien",
          planete: dm.planete_nom || '',
          signe: dm.planete_signe || '',
          maison: String(dm.maison || ''),
          source: dm.source || '',
          personalized: "true"
        },
        accessToken,
        projectId
      );
      if (result.name) sent++;
      else {
        failed++;
        if (result.error?.code === 'UNREGISTERED' || result.error?.code === 'INVALID_ARGUMENT') {
          invalidTokens.push(row.token);
        }
      }
    }

    // Envoie fallbacks
    const teasers: Record<string, string> = {
      "Bélier": "Le feu de l'action te porte aujourd'hui. Ouvre Astra pour ton message complet 🔥",
      "Taureau": "Une stabilité rayonnante t'attend. Découvre ton horoscope personnalisé ✨",
      "Gémeaux": "Les connexions et les idées abondent. Ton message complet t'attend dans Astra 💫",
      "Cancer": "L'intuition guide tes pas aujourd'hui. Ouvre Astra pour découvrir ton ciel 🌙",
      "Lion": "Ta créativité est décuplée aujourd'hui. Ton horoscope complet t'attend 👑",
      "Vierge": "L'ordre et le soin magnifient ta journée. Découvre ton message dans Astra 🌾",
      "Balance": "L'harmonie et la beauté t'inspirent. Ton ciel complet t'attend ⚖️",
      "Scorpion": "Ta puissance intérieure se déploie. Ouvre Astra pour ton message 🔮",
      "Sagittaire": "L'aventure et la sagesse t'appellent. Découvre ton horoscope 🏹",
      "Capricorne": "La discipline construit ton succès. Ton message complet dans Astra 🐐",
      "Verseau": "L'innovation guide tes actions. Ouvre Astra pour ton ciel du jour 🌊",
      "Poissons": "La compassion t'enveloppe aujourd'hui. Ton horoscope t'attend 🐟"
    };

    for (const row of withoutMessage) {
      const prenom = row.profile?.nom?.split(' ')[0] || 'Voyageur';
      const signe = row.profile?.signe_solaire || 'Bélier';
      const body = teasers[signe] || "Ton horoscope personnalisé t'attend 🔮 Ouvre Astra pour le découvrir.";
      const result = await sendFCM(
        row.token,
        `✦ Ton ciel du jour, ${prenom}`,
        body,
        { screen: "home", type: "horoscope_quotidien", fallback: "true", signe },
        accessToken,
        projectId
      );
      if (result.name) fallbackSent++;
      else {
        failed++;
        if (result.error?.code === 'UNREGISTERED' || result.error?.code === 'INVALID_ARGUMENT') {
          invalidTokens.push(row.token);
        }
      }
    }

    // Nettoie
    if (invalidTokens.length > 0) {
      await supabase.from("notification_tokens").delete().in("token", invalidTokens);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent, 
        fallbackSent, 
        failed, 
        skippedOptOut,
        total: tokens.length, 
        cleaned: invalidTokens.length 
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("[daily-horoscope] Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});