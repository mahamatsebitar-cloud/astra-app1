import OneSignal from 'onesignal-cordova-plugin';

const ONESIGNAL_APP_ID = 'c6503127-f8e2-4571-89b9-71b860b0195e';

export function initOneSignal() {
  try {
    OneSignal.initialize(ONESIGNAL_APP_ID);
    console.log('✅ OneSignal initialized');
  } catch (err) {
    console.error('❌ OneSignal init error:', err);
  }
}

export async function requestNotificationPermission() {
  try {
    // 1. Demande la permission Android
    const permitted = await OneSignal.Notifications.requestPermission(true);
    console.log('🔔 Permission granted:', permitted);
    
    if (!permitted) return null;

    // 2. Attend que OneSignal enregistre le device (max 5 secondes)
    for (let i = 0; i < 10; i++) {
      const id = await OneSignal.User.getOnesignalId();
      if (id) {
        console.log('✅ OneSignal ID:', id);
        return id;
      }
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log('❌ OneSignal ID still null after 5s');
    return null;
  } catch (err) {
    console.error('❌ Permission error:', err);
    return null;
  }
}

export async function setUserTags(signe, prenom) {
  try {
    OneSignal.User.addTags({ signe_solaire: signe, prenom });
    console.log('✅ Tags set:', signe, prenom);
  } catch (err) {
    console.error('❌ Tag error:', err);
  }
}