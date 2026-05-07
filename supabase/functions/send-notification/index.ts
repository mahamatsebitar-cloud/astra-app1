import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import admin from "npm:firebase-admin";

const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!);

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

serve(async (req) => {
  const { user_id, title, body, data } = await req.json();

  if (!user_id) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), { status: 400 });
  }

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

  const tokens = rows.map((r: { token: string }) => r.token);

  const message = {
    notification: { title, body },
    data: data || {},
    tokens: tokens.slice(0, 500),
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    
    // Ajoute ce log pour voir l'erreur exacte
    if (response.failureCount > 0) {
      response.responses.forEach((r, i) => {
        if (!r.success) {
          console.error(`Token ${i} failed:`, r.error?.code, r.error?.message);
        }
      });
    }

    return new Response(
      JSON.stringify({ success: true, sent: response.successCount, failed: response.failureCount }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});