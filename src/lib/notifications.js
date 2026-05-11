import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) {
    console.log('❌ Not native — skip push init');
    return;
  }

  // 🔴 ÉTAPE CRUCIALE : Crée le canal de notification AVANT tout
  try {
    await PushNotifications.createChannel({
      id: 'astra_default',
      name: 'Notifications Astra',
      description: 'Notifications quotidiennes de l\'app Astra',
      importance: 5, // HIGH = affiche en pop-up, son, vibration
      visibility: 1,  // PUBLIC = visible sur écran verrouillé
      sound: 'default',
      vibration: true,
      lights: true
    });
    console.log('✅ Canal astra_default créé');
  } catch (err) {
    console.error('❌ Erreur création canal:', err);
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