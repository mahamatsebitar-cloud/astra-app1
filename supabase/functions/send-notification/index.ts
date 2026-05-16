// supabase/functions/send-notification/index.ts
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

serve(async (req) => {
  try {
    const { user_id, title, body, data } = await req.json();
    if (!user_id) return new Response(JSON.stringify({ error: "Missing user_id" }), { status: 400 });

    const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!);

    const supabase = createClient(
      Deno.env.get("MY_SUPABASE_URL")!,
      Deno.env.get("MY_SERVICE_ROLE_KEY")!
    );

    const { data: rows, error } = await supabase
      .from("notification_tokens")
      .select("token")
      .eq("user_id", user_id);

    if (error || !rows?.length) {
      return new Response(JSON.stringify({ error: "No tokens found" }), { status: 404 });
    }

    console.log("Tokens found:", rows.length);
    const accessToken = await getAccessToken(serviceAccount);

    const invalidTokens: string[] = [];

    const results = await Promise.all(
      rows.map(async (row: { token: string }) => {
        // ─── CONSTRUIT LE PAYLOAD AVEC DATA ───
        const messagePayload: any = {
          token: row.token,
          notification: { title, body },
          android: {
            priority: "high",
            notification: {
              sound: "default",
              channel_id: "astra_default"
            }
          }
        };

        // Ajoute les data si présentes
        if (data && Object.keys(data).length > 0) {
          messagePayload.data = data;
        }

        const res = await fetch(
          `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: messagePayload }),
          }
        );
        const result = await res.json();
        console.log("FCM result:", JSON.stringify(result));

        // ─── TRACK LES TOKENS INVALIDES ───
        if (result.error?.code === 'UNREGISTERED' || result.error?.code === 'INVALID_ARGUMENT') {
          invalidTokens.push(row.token);
        }

        return result;
      })
    );

    // ─── NETTOIE LES TOKENS INVALIDES ───
    if (invalidTokens.length > 0) {
      await supabase.from("notification_tokens").delete().in("token", invalidTokens);
      console.log("Cleaned invalid tokens:", invalidTokens.length);
    }

    const sent   = results.filter((r: any) => r.name).length;
    const failed = results.filter((r: any) => r.error).length;

    return new Response(
      JSON.stringify({ success: sent > 0, sent, failed, cleaned: invalidTokens.length, results }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Handler error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});