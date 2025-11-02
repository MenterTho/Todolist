import { NotificationType } from "../modules/notification/models/notification.model";

export function getNotificationUrl(
  type: NotificationType,
  relatedId: number,
  extra?: { taskId?: number; commentId?: number }
): string {
  const base = process.env.FRONTEND_URL || "http://localhost:3000";

  switch (type) {
    case NotificationType.TASK_ASSIGN:
      return `${base}/task/${relatedId}`;

    case NotificationType.COMMENT:
      const taskId = extra?.taskId;
      if (taskId) {
        return `${base}/task/${taskId}#comment-${relatedId}`;
      }
      return `${base}/task/${relatedId}`; 

    case NotificationType.INVITE:
      return `${base}/invite/${relatedId}`;

    case NotificationType.WORKSPACE:
      return `${base}/workspace/${relatedId}`;

    case NotificationType.PROJECT:
      return `${base}/project/${relatedId}`;

    default:
      return `${base}/notifications`;
  }
}