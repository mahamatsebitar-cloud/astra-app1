import OneSignal from 'onesignal-cordova-plugin';

const ONESIGNAL_APP_ID = 'c6503127-f8e2-4571-89b9-71b860b0195e';

export function initOneSignal() {
  try {
    console.log('🔔 initOneSignal: starting');
    console.log('🔔 initOneSignal: OneSignal type =', typeof OneSignal);
    OneSignal.initialize(ONESIGNAL_APP_ID);
    console.log('✅ OneSignal initialized');
  } catch (err) {
    console.error('❌ OneSignal init error:', err.name, err.message);
  }
}

export async function requestNotificationPermission() {
  try {
    console.log('🔔 Step 1: checking OneSignal object:', typeof OneSignal);
    console.log('🔔 Step 2: OneSignal.Notifications:', typeof OneSignal?.Notifications);
    
    const permitted = await OneSignal.Notifications.requestPermission(true);
    console.log('🔔 Step 3: permission result:', permitted);
    
    if (!permitted) {
      console.log('❌ Permission denied at Step 3');
      return null;
    }

    for (let i = 0; i < 10; i++) {
      const id = await OneSignal.User.getOnesignalId();
      console.log(`🔔 Step 4 attempt ${i+1}: id =`, id);
      if (id) {
        console.log('✅ OneSignal ID:', id);
        return id;
      }
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log('❌ OneSignal ID still null after 5s');
    return null;
  } catch (err) {
    console.error('❌ FULL ERROR:', err.name, err.message, err.stack);
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