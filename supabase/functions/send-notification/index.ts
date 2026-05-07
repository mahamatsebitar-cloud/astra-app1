import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ONESIGNAL_APP_ID = 'c6503127-f8e2-4571-89b9-71b860b0195e';
const ONESIGNAL_REST_KEY = Deno.env.get('ONESIGNAL_REST_KEY')!;

serve(async (req) => {
  const { user_id, title, body, signe } = await req.json();

  // Envoie par segment de signe ou par user_id spécifique
  const payload: any = {
    app_id: ONESIGNAL_APP_ID,
    headings: { fr: title },
    contents: { fr: body },
    // Notification riche style CoStar
    android_channel_id: 'astra_horoscope',
    small_icon: 'ic_launcher',
  };

  // Si signe fourni → envoie à tous les users avec ce tag
  if (signe) {
    payload.filters = [
      { field: 'tag', key: 'signe_solaire', relation: '=', value: signe }
    ];
  } else if (user_id) {
    // Sinon envoie à un user spécifique via external_id
    payload.include_aliases = { external_id: [user_id] };
    payload.target_channel = 'push';
  } else {
    // Envoie à tous
    payload.included_segments = ['All'];
  }

  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${ONESIGNAL_REST_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  console.log('OneSignal result:', JSON.stringify(result));

  return new Response(
    JSON.stringify({ success: !result.errors, result }),
    { status: 200 }
  );
});