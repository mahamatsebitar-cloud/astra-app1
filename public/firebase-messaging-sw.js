// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAH5c_MnL3yqHE18YVua9-U5zIL52s84zI",
  authDomain: "astra-app-baeae.firebaseapp.com",
  projectId: "astra-app-baeae",
  storageBucket: "astra-app-baeae.firebasestorage.app",
  messagingSenderId: "1033858955559",
  appId: "1:1033858955559:android:e90a39a216b422bf6c5102"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Astra', {
    body: body || '',
    icon: icon || '/icon-192.png',
    data: payload.data
  });
});