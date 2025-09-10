import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { CreateNotificationDto } from "../dtos/createNotification.dto";
import { Notification, NotificationType } from "../models/notification.model";
import { messaging } from "../../../common/config/firebase.config";
import { User } from "../../auth/model/auth.model";
import { NotificationRepository } from "../repositories/notification.repositories";

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private userRepository: Repository<User>;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.userRepository = AppDataSource.getRepository(User);
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    // Validate related entities based on notification type
    if (dto.type === NotificationType.TASK_ASSIGN) {
      const task = await this.notificationRepository.findTask(dto.relatedId);
      if (!task || task.isDeleted) {
        throw new Error("Không tìm thấy hoặc nhiệm vụ đã bị xóa");
      }
      if (!task.project || !task.project.workspace) {
        throw new Error("Nhiệm vụ không thuộc dự án hoặc không gian làm việc hợp lệ");
      }
      const userWorkspace = await this.notificationRepository.findUserWorkspace(dto.recipientId, task.project.workspaceId);
      if (!userWorkspace || userWorkspace.isDeleted) {
        throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
      }
    } else if (dto.type === NotificationType.COMMENT) {
      const comment = await this.notificationRepository.findComment(dto.relatedId);
      if (!comment || comment.isDeleted) {
        throw new Error("Không tìm thấy hoặc bình luận đã bị xóa");
      }
      if (!comment.task.project || !comment.task.project.workspace) {
        throw new Error("Bình luận không thuộc dự án hoặc không gian làm việc hợp lệ");
      }
      const userWorkspace = await this.notificationRepository.findUserWorkspace(dto.recipientId, comment.task.project.workspaceId);
      if (!userWorkspace || userWorkspace.isDeleted) {
        throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
      }
    } else if (dto.type === NotificationType.INVITE) {
      const userWorkspace = await this.notificationRepository.findUserWorkspace(dto.recipientId, dto.relatedId);
      if (!userWorkspace || userWorkspace.isDeleted) {
        throw new Error("Không tìm thấy lời mời vào không gian làm việc");
      }
    } else if (dto.type === NotificationType.WORKSPACE || dto.type === NotificationType.PROJECT) {
      // No additional validation needed for WORKSPACE or PROJECT types
    } else {
      throw new Error("Loại thông báo không hợp lệ");
    }

    // Save notification to database
    const notification = await this.notificationRepository.save({
      message: dto.message,
      recipientId: dto.recipientId,
      type: dto.type,
      relatedId: dto.relatedId,
      isRead: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send push notification via FCM
    const user = await this.userRepository.findOne({ where: { id: dto.recipientId, isDeleted: false } });
    if (user && user.fcmToken) {
      const message = {
        notification: {
          title: `Thông báo mới: ${dto.type}`,
          body: dto.message,
        },
        token: user.fcmToken,
      };

      try {
        await messaging.send(message);
        console.log(`Đã gửi thông báo đẩy đến user ${dto.recipientId}`);
      } catch (error: any) {
        if (error.code === "messaging/registration-token-not-registered") {
          await this.userRepository.update(dto.recipientId, { fcmToken: undefined });
        }
        console.error("Lỗi khi gửi thông báo đẩy:", error);
      }
    }

    return notification;
  }

  async getNotifications(recipientId: number): Promise<Notification[]> {
    const notifications = await this.notificationRepository.findByUser(recipientId);
    return notifications;
  }

  async markAsRead(id: number, recipientId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification || notification.isDeleted) {
      throw new Error("Không tìm thấy hoặc thông báo đã bị xóa");
    }
    if (notification.recipientId !== recipientId) {
      throw new Error("Bạn chỉ có thể đánh dấu thông báo của chính mình");
    }

    const updatedNotification = await this.notificationRepository.update(id, {
      isRead: true,
      updatedAt: new Date(),
    });

    if (!updatedNotification) {
      throw new Error("Đánh dấu thông báo thất bại");
    }

    return updatedNotification;
  }

  async delete(id: number, recipientId: number): Promise<{ message: string }> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification || notification.isDeleted) {
      throw new Error("Không tìm thấy hoặc thông báo đã bị xóa");
    }
    if (notification.recipientId !== recipientId) {
      throw new Error("Bạn chỉ có thể xóa thông báo của chính mình");
    }

    const success = await this.notificationRepository.softDelete(id);
    if (!success) {
      throw new Error("Xóa thông báo thất bại");
    }

    return { message: "Xóa thông báo thành công" };
  }
}