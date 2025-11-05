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
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}