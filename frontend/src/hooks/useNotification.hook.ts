import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@/services/notification.service";
import { Notification } from "@/types/notification.type";

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: number) => Promise<void>;
  remove: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: number): Promise<void> => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: unknown) {
      console.error("Mark as read failed:", err);
    }
  }, []);

  const remove = useCallback(async (id: number): Promise<void> => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: unknown) {
      console.error("Delete failed:", err);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    remove,
    refetch: fetchNotifications,
  };
};