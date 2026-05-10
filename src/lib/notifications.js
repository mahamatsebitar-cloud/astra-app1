import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) {
    console.log('❌ Not native — skip push init');
    return;
  }

  // Vérifie/demande la permission
  let permission = await PushNotifications.checkPermissions();
  console.log('🔔 Current permission:', permission.receive);

  if (permission.receive === 'prompt') {
    permission = await PushNotifications.requestPermissions();
    console.log('🔔 After request:', permission.receive);
  }

  if (permission.receive !== 'granted') {
    console.log('❌ Permission denied');
    return null;
  }

  // Enregistre le device
  await PushNotifications.register();
  console.log('🔔 register() called');
}

export function getFCMToken() {
  return new Promise((resolve) => {
    if (!Capacitor.isNativePlatform()) {
      resolve(null);
      return;
    }

    // Timeout de sécurité 10 secondes
    const timeout = setTimeout(() => {
      console.log('❌ Token timeout');
      resolve(null);
    }, 10000);

    PushNotifications.addListener('registration', (token) => {
      clearTimeout(timeout);
      console.log('✅ FCM Token:', token.value);
      resolve(token.value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      clearTimeout(timeout);
      console.error('❌ Registration error:', JSON.stringify(err));
      resolve(null);
    });

    // Déclenche l'enregistrement
    PushNotifications.register();
  });
}