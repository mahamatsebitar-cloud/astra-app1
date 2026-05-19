// supabase/functions/delete-user/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // CORS - CORRIGÉ pour accepter Authorization et autres headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { userId } = await req.json()
    console.log('🗑️ Demande suppression userId:', userId)

    if (!userId) {
      console.log('❌ userId manquant')
      return new Response(
        JSON.stringify({ error: 'userId requis' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      )
    }

    // Client admin avec service_role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('🔧 SUPABASE_URL:', supabaseUrl ? 'défini' : 'MANQUANT')
    console.log('🔧 SERVICE_ROLE_KEY:', serviceRoleKey ? 'défini' : 'MANQUANT')

    const supabaseAdmin = createClient(
      supabaseUrl ?? '',
      serviceRoleKey ?? ''
    )

    // 1. D'ABORD changer l'email pour libérer l'adresse
    console.log('🗑️ Anonymisation email...')
    const deletedEmail = `deleted-${userId}@astra.deleted`
    const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email: deletedEmail }
    )

    if (emailError) {
      console.error('❌ Erreur changement email:', JSON.stringify(emailError))
    } else {
      console.log('✅ Email anonymisé:', deletedEmail)
    }

    // 2. PUIS bannir l'utilisateur
    console.log('🗑️ Bannissement...')
    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { banned: true }
    )

    if (banError) {
      console.error('❌ Erreur bannissement:', JSON.stringify(banError))
    } else {
      console.log('✅ Utilisateur banni')
    }

    // 3. Supprimer le profil et données liées
    console.log('🗑️ Suppression profil...')
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('❌ Erreur profil:', JSON.stringify(profileError))
    } else {
      console.log('✅ Profil supprimé')
    }

    console.log('🗑️ Suppression notification_tokens...')
    await supabaseAdmin.from('notification_tokens').delete().eq('user_id', userId)

    console.log('🗑️ Suppression friendships...')
    await supabaseAdmin.from('friendships').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

    console.log('✅ Terminé - email libéré, compte banni')
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )

  } catch (err) {
    console.error('❌ Erreur générale:', err.message)
    console.error('Stack:', err.stack)
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  }
})