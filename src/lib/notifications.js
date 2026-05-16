// src/lib/notifications.js
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

// ─── PERSISTENCE VIA LOCALSTORAGE (survit à l'app fermée) ───
export function getPendingDeepLink() {
  const link = localStorage.getItem('astra_pending_deep_link');
  if (link) {
    localStorage.removeItem('astra_pending_deep_link');
    return JSON.parse(link);
  }
  return null;
}

export function hasPendingDeepLink() {
  return !!localStorage.getItem('astra_pending_deep_link');
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

  // Écoute les notifications reçues (app ouverte)
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
    console.log('📊 Deep link data:', JSON.stringify(data));
    
    if (data.screen) {
      const deepLink = {
        screen: data.screen,
        type: data.type || '',
        friendId: data.friendId || null,
        planete: data.planete || '',
        signe: data.signe || '',
        maison: data.maison || ''
      };
      
      // Stocke dans localStorage pour persistance
      localStorage.setItem('astra_pending_deep_link', JSON.stringify(deepLink));
      console.log('💾 Deep link stocké:', data.screen);
      
      // Émet aussi un événement si app ouverte
      window.dispatchEvent(new CustomEvent('astra-deep-link', {
        detail: deepLink
      }));
    } else {
      console.log('❌ Pas de data.screen dans la notif');
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