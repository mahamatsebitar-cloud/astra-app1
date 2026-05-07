import OneSignal from 'onesignal-cordova-plugin';

const ONESIGNAL_APP_ID = 'c6503127-f8e2-4571-89b9-71b860b0195e';

export function initOneSignal() {
  try {
    // Vérifie que le plugin est bien disponible avant d'appeler ses méthodes
    if (!window.OneSignal) {
      console.log('OneSignal plugin not ready, retrying in 500ms...');
      setTimeout(() => initOneSignal(), 500);
      return;
    }
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(true);
    console.log('OneSignal initialized successfully');
  } catch (err) {
    console.error('OneSignal init error:', err);
  }
}

export async function getOneSignalUserId() {
  try {
    if (!window.OneSignal) {
      console.log('OneSignal not available');
      return null;
    }
    const id = await OneSignal.User.getOnesignalId();
    return id ?? null;
  } catch {
    return null;
  }
}

export async function setUserTags(signe, prenom) {
  try {
    if (!window.OneSignal) return;
    OneSignal.User.addTags({ signe_solaire: signe, prenom });
  } catch (err) {
    console.error('OneSignal tag error:', err);
  }
}