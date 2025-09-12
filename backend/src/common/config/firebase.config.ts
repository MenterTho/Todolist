import * as admin from "firebase-admin";

let _messaging: admin.messaging.Messaging | null = null;

export const initializeFirebase = () => {
  if (admin.apps.length > 0) {
    console.log("Firebase Admin SDK đã được khởi tạo rồi");
    return;
  }

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error("Thiếu biến môi trường Firebase. Kiểm tra .env: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL");
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK khởi tạo thành công");
    _messaging = admin.messaging();
  } catch (error) {
    console.error("Lỗi khi khởi tạo Firebase Admin SDK:", error);
    throw error;
  }
};

export const getMessaging = () => {
  if (!_messaging) {
    throw new Error("Firebase Admin SDK chưa được khởi tạo. Gọi initializeFirebase() trước.");
  }
  return _messaging;
};