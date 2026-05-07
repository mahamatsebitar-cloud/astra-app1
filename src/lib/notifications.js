import OneSignal from 'onesignal-cordova-plugin';

const ONESIGNAL_APP_ID = 'c6503127-f8e2-4571-89b9-71b860b0195e';

export function initOneSignal() {
  OneSignal.initialize(ONESIGNAL_APP_ID);
  OneSignal.Notifications.requestPermission(true);
}

export async function getOneSignalUserId() {
  try {
    const id = await OneSignal.User.getOnesignalId();
    return id ?? null;
  } catch {
    return null;
  }
}

export async function setUserTags(signe, prenom) {
  OneSignal.User.addTags({ signe_solaire: signe, prenom });
}