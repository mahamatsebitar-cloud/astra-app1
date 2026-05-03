import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import admin from "npm:firebase-admin";

const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!);

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

serve(async (req) => {
  const { tokens, title, body, data } = await req.json();

  if (!tokens?.length) {
    return new Response(JSON.stringify({ error: "No tokens" }), { status: 400 });
  }

  const message = {
    notification: { title, body },
    data: data || {},
    tokens: tokens.slice(0, 500),
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    return new Response(JSON.stringify({ success: true, response }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});