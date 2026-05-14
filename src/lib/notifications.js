// src/lib/notifications.js
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

// ─── STORE GLOBAL POUR LE DEEP LINK ───
let pendingDeepLink = null;

export function getPendingDeepLink() {
  const link = pendingDeepLink;
  pendingDeepLink = null; // Consume
  return link;
}

export function hasPendingDeepLink() {
  return pendingDeepLink !== null;
}

export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) {
    console.log('❌ Not native — skip push init');
    return;
  }

  // Crée le canal de notification
  try {
    await PushNotifications.createChannel({
      id: 'astra_default',
      name: 'Notifications Astra',
      description: 'Notifications quotidiennes de l\'app Astra',
      importance: 5,
      visibility: 1,
      sound: 'default',
      vibration: true,
      lights: true
    });
    console.log('✅ Canal astra_default créé');
  } catch (err) {
    console.error('❌ Erreur création canal:', err);
  }

  // Écoute les notifications reçues quand l'app est ouverte
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('🔔 Notification reçue (app ouverte):', notification);
    
    window.dispatchEvent(new CustomEvent('astra-notification', {
      detail: {
        title: notification.title || '✦ Astra',
        body: notification.body || 'Nouvelle notification',
        data: notification.data
      }
    }));
  });

  // ─── ÉCOUTE LES CLICS SUR NOTIFICATION (DEEP LINK) ───
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('👆 Notification cliquée:', notification);
    
    const data = notification.notification?.data || notification.data || {};
    console.log('📊 Deep link data:', data);
    
    // Stocke le deep link pour que App.jsx le consomme
    if (data.screen) {
      pendingDeepLink = {
        screen: data.screen,
        type: data.type || '',
        friendId: data.friendId || null,
        planete: data.planete || '',
        signe: data.signe || '',
        maison: data.maison || ''
      };
      
      // Émet aussi un événement si l'app est déjà ouverte
      window.dispatchEvent(new CustomEvent('astra-deep-link', {
        detail: pendingDeepLink
      }));
    }
  });

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

  await PushNotifications.register();
  console.log('🔔 register() called');
}

export function getFCMToken() {
  return new Promise((resolve) => {
    if (!Capacitor.isNativePlatform()) {
      resolve(null);
      return;
    }

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

    PushNotifications.register();
  });
}