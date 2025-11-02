import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { CreateNotificationDto } from "../dtos/createNotification.dto";
import { Notification, NotificationType } from "../models/notification.model";
import { User } from "../../auth/model/auth.model";
import { NotificationRepository } from "../repositories/notification.repositories";
import { sendEmail } from "../../../common/config/email.config";
import { getNotificationUrl } from "../../../utils/notification.util";

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private userRepository: Repository<User>;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.userRepository = AppDataSource.getRepository(User);
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    let taskIdForComment: number | undefined;
    if (dto.type === NotificationType.TASK_ASSIGN) {
      const task = await this.notificationRepository.findTask(dto.relatedId);
      if (!task || task.isDeleted) {
        throw new Error("Không tìm thấy hoặc nhiệm vụ đã bị xóa");
      }
      if (!task.project || !task.project.workspace) {
        throw new Error("Nhiệm vụ không thuộc dự án hoặc không gian làm việc hợp lệ");
      }
      const userWorkspace = await this.notificationRepository.findUserWorkspace(
        dto.recipientId,
        task.project.workspaceId
      );
      if (!userWorkspace || userWorkspace.isDeleted) {
        throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
      }
    } 
    else if (dto.type === NotificationType.COMMENT) {
      const comment = await this.notificationRepository.findComment(dto.relatedId);
      if (!comment || comment.isDeleted) {
        throw new Error("Không tìm thấy hoặc bình luận đã bị xóa");
      }
      if (!comment.task.project || !comment.task.project.workspace) {
        throw new Error("Bình luận không thuộc dự án hoặc không gian làm việc hợp lệ");
      }
      const userWorkspace = await this.notificationRepository.findUserWorkspace(
        dto.recipientId,
        comment.task.project.workspaceId
      );
      if (!userWorkspace || userWorkspace.isDeleted) {
        throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
      }

      taskIdForComment = comment.taskId;
    } 
    else if (dto.type === NotificationType.INVITE) {
      const userWorkspace = await this.notificationRepository.findUserWorkspace(
        dto.recipientId,
        dto.relatedId
      );
      if (!userWorkspace || userWorkspace.isDeleted) {
        throw new Error("Không tìm thấy lời mời vào không gian làm việc");
      }
    } 
    else if (dto.type === NotificationType.WORKSPACE || dto.type === NotificationType.PROJECT) {
    } 
    else {
      throw new Error("Loại thông báo không hợp lệ");
    }

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

    const detailUrl = getNotificationUrl(dto.type, dto.relatedId, {
      taskId: taskIdForComment,
    });

    const recipient = await this.userRepository.findOne({
      where: { id: dto.recipientId, isDeleted: false },
      select: ["email", "name"],
    });

    if (recipient?.email) {
      const subject = `Thông báo mới: ${dto.type}`;
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #1a73e8; margin-top: 0;">${dto.message}</h2>
          <p><strong>Loại thông báo:</strong> <span style="color: #555; font-weight: 500;">${dto.type}</span></p>
          <p>
            <a href="${detailUrl}" 
               style="background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 15px;">
              Xem chi tiết
            </a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <small style="color: #888; font-size: 12px;">Đây là email tự động từ TaskFlow. Vui lòng không trả lời.</small>
        </div>
      `;

      try {
        await sendEmail(recipient.email, subject, html);
        console.log(`[Notification] Email sent to ${recipient.email} → ${detailUrl}`);
      } catch (error) {
        console.error("[Notification] Failed to send email:", error);
      }
    }

    return notification;
  }

  async getNotifications(recipientId: number): Promise<Notification[]> {
    return await this.notificationRepository.findByUser(recipientId);
  }

  async markAsRead(id: number, recipientId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification || notification.isDeleted) {
      throw new Error("Không tìm thấy hoặc thông báo đã bị xóa");
    }
    if (notification.recipientId !== recipientId) {
      throw new Error("Bạn chỉ có thể đánh dấu thông báo của chính mình");
    }

    const updated = await this.notificationRepository.update(id, {
      isRead: true,
      updatedAt: new Date(),
    });

    if (!updated) throw new Error("Đánh dấu thất bại");
    return updated;
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
    if (!success) throw new Error("Xóa thất bại");

    return { message: "Xóa thông báo thành công" };
  }
}