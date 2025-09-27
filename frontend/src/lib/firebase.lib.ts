import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken,MessagePayload } from 'firebase/messaging';
import toast from 'react-hot-toast';
import { updateFcmToken } from '@/services/auth.service';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function initializeFCM() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      await updateFcmToken(token);
      console.log('FCM token updated:', token);
    } else {
      console.warn('Notification permission denied');
    }
  } catch (error) {
    console.error('Error initializing FCM:', error);
  }
}

export function listenForNotifications(callback: (payload: MessagePayload) => void) {
  onMessage(messaging, (payload) => {
    if (payload.notification?.body) {
      toast.success(payload.notification.body ?? 'New notification');
    }
    callback(payload);
  });
}