import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export async function requestNotificationPermission() {
  // Si on est dans un navigateur web (pas Android natif)
  if (!Capacitor.isNativePlatform()) {
    console.log('🔔 Plateforme web — notifications non supportées en dehors de l\'APK');
    return null;
  }

  // Demande la permission
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') {
    console.log('🔔 Permission refusée');
    return null;
  }

  // Enregistre le device
  await PushNotifications.register();

  // Récupère le token Android natif
  return new Promise((resolve) => {
    PushNotifications.addListener('registration', (token) => {
      console.log('🔔 Token Android:', token.value);
      resolve(token.value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('🔔 Erreur registration:', err);
      resolve(null);
    });
  });
}