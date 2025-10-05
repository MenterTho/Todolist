import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken, MessagePayload } from 'firebase/messaging';
import toast from 'react-hot-toast';
import { updateFcmToken } from '@/services/auth.service';
import { CustomApiError } from '@/utils/apiErrorHandler.util';
import { UpdateFcmTokenRequest, UpdateFcmTokenResponse } from '@/types/auth.type';

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

export async function initializeFCM(): Promise<void> {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      const response: UpdateFcmTokenResponse = await updateFcmToken({ fcmToken: token });
      console.log('FCM token updated:', token);
      toast.success(response.message || 'Cập nhật FCM token thành công!');
    } else {
      throw new CustomApiError({ message: 'Quyền thông báo bị từ chối' });
    }
  } catch (error) {
    console.error('Lỗi khởi tạo FCM:', error);
    const errorMessage =
      error instanceof CustomApiError
        ? error.details?.join(', ') || error.message || 'Lỗi khởi tạo FCM'
        : 'Lỗi khởi tạo FCM';
    toast.error(errorMessage);
    throw error instanceof CustomApiError ? error : new CustomApiError({ message: 'Lỗi khởi tạo FCM' });
  }
}

export function listenForNotifications(callback: (payload: MessagePayload) => void) {
  onMessage(messaging, (payload) => {
    if (payload.notification?.body) {
      toast.success(payload.notification.body ?? 'Thông báo mới');
    }
    callback(payload);
  });
}