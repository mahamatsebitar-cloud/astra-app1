// src/lib/notifications.js
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

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
    await Toast.show({ text: '✅ Canal notif créé' });
  } catch (err) {
    await Toast.show({ text: '❌ Erreur canal: ' + err.message });
  }

  // Écoute les notifications reçues (app ouverte)
  PushNotifications.addListener('pushNotificationReceived', async (notification) => {
    await Toast.show({ 
      text: '🔔 Notif reçue: ' + (notification.title || 'Astra').substring(0, 30) 
    });
    
    window.dispatchEvent(new CustomEvent('astra-notification', {
      detail: {
        title: notification.title || '✦ Astra',
        body: notification.body || 'Nouvelle notification',
        data: notification.data
      }
    }));
  });

  // ─── ÉCOUTE LES CLICS SUR NOTIFICATION (DEEP LINK) ───
  PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
    await Toast.show({ text: '👆 CLIC NOTIF DÉTECTÉ !' });
    
    const data = notification.notification?.data || notification.data || {};
    await Toast.show({ text: 'Data: ' + JSON.stringify(data).substring(0, 40) });
    
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
      await Toast.show({ text: '💾 Stocké: ' + data.screen });
      
      // Émet aussi un événement si app ouverte
      window.dispatchEvent(new CustomEvent('astra-deep-link', {
        detail: deepLink
      }));
    } else {
      await Toast.show({ text: '❌ Pas de data.screen' });
    }
  });

  // Vérifie/demande la permission
  let permission = await PushNotifications.checkPermissions();
  if (permission.receive === 'prompt') {
    permission = await PushNotifications.requestPermissions();
  }

  if (permission.receive !== 'granted') {
    await Toast.show({ text: '❌ Permission refusée' });
    return null;
  }

  await PushNotifications.register();
  await Toast.show({ text: '🔔 Push enregistré' });
}

export function getFCMToken() {
  return new Promise((resolve) => {
    if (!Capacitor.isNativePlatform()) {
      resolve(null);
      return;
    }

    const timeout = setTimeout(() => {
      resolve(null);
    }, 10000);

    PushNotifications.addListener('registration', (token) => {
      clearTimeout(timeout);
      resolve(token.value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      clearTimeout(timeout);
      resolve(null);
    });

    PushNotifications.register();
  });
}