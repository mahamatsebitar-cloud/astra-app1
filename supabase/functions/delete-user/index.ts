// supabase/functions/delete-user/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // CORS
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
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🗑️ [DELETE-USER] Demande suppression')
    console.log('   userId:', userId)

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('🔧 Config:', supabaseUrl ? 'URL ✅' : 'URL ❌', serviceRoleKey ? 'KEY ✅' : 'KEY ❌')

    const supabaseAdmin = createClient(
      supabaseUrl ?? '',
      serviceRoleKey ?? ''
    )

    // ═══════════════════════════════════════
    // PHASE 0 : NETTOYAGE DONNÉES MÉTIER (AVANT auth)
    // ═══════════════════════════════════════
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔵 [PHASE 0] NETTOYAGE DONNÉES MÉTIER')
    console.log('   → Suppression profil...')
    await supabaseAdmin.from('profiles').delete().eq('id', userId)
    console.log('   ✅ Profil supprimé')

    console.log('   → Suppression notification_tokens...')
    await supabaseAdmin.from('notification_tokens').delete().eq('user_id', userId)
    console.log('   ✅ Tokens supprimés')

    console.log('   → Suppression friendships...')
    await supabaseAdmin.from('friendships').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    console.log('   ✅ Friendships supprimés')

    // ═══════════════════════════════════════
    // PHASE 1 : SUPPRESSION AUTH (API OFFICIELLE)
    // ═══════════════════════════════════════
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔴 [PHASE 1] SUPPRESSION AUTH VIA API ADMIN')

    let authDeleted = false
    
    try {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      
      if (deleteError) {
        console.log('❌ [PHASE 1] API ADMIN ÉCHOUÉ:', deleteError.message)
        console.log('   → Erreur détaillée:', JSON.stringify(deleteError))
      } else {
        authDeleted = true
        console.log('✅ [PHASE 1] API ADMIN RÉUSSI')
        console.log('   → auth.users SUPPRIMÉ DÉFINITIVEMENT')
      }
    } catch (err) {
      console.log('❌ [PHASE 1] API ADMIN EXCEPTION:', err.message)
    }

    // ═══════════════════════════════════════
    // PHASE 2 : FALLBACK BANNISSEMENT (si API échoue)
    // ═══════════════════════════════════════
    if (!authDeleted) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🟡 [PHASE 2] FALLBACK BANNISSEMENT')

      const deletedEmail = `deleted-${userId}@astra.deleted`
      
      console.log('   → Anonymisation email:', deletedEmail)
      await supabaseAdmin.auth.admin.updateUserById(userId, { email: deletedEmail })
      console.log('   ✅ Email anonymisé')

      console.log('   → Bannissement...')
      await supabaseAdmin.auth.admin.updateUserById(userId, { banned: true })
      console.log('   ✅ Utilisateur BANNI')
      
      console.log('   ⚠️  Email NON libéré')
      console.log('   ⚠️  Réinscription impossible')
    }

    // ═══════════════════════════════════════
    // RÉSULTAT FINAL
    // ═══════════════════════════════════════
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 [RÉSULTAT FINAL]')
    console.log('   Méthode:', authDeleted ? '✅ API ADMIN (suppression réelle)' : '🟡 FALLBACK BAN')
    console.log('   Email libéré:', authDeleted ? '✅ OUI' : '❌ NON')
    console.log('   Réinscription:', authDeleted ? '✅ POSSIBLE' : '❌ BLOQUÉE')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return new Response(
      JSON.stringify({ 
        success: true, 
        authDeleted,
        method: authDeleted ? 'api_admin_delete' : 'ban_fallback',
        emailFreed: authDeleted
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )

  } catch (err) {
    console.error('💥 [ERREUR FATALE]', err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  }
})