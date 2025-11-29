import { GenericResponse, GenericDeleteResponse } from "@/utils/common.type";

export type NotificationType =
  | "TASK_ASSIGN"
  | "COMMENT"
  | "INVITE"
  | "WORKSPACE"
  | "PROJECT";

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  relatedId: number;
  recipientId: number;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  message: string;
  recipientId: number;
  type: NotificationType;
  relatedId: number;
}

export type NotificationResponse = GenericResponse<Notification>;
export type NotificationsResponse = GenericResponse<Notification[]>;
export type DeleteNotificationResponse = GenericDeleteResponse;