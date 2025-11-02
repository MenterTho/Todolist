// src/modules/notification/controllers/notification.controller.ts
import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { CreateNotificationDto } from "../dtos/createNotification.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class NotificationController {
  private notificationService = new NotificationService();

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Chưa đăng nhập" });

      const dto = plainToInstance(CreateNotificationDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const notification = await this.notificationService.create(dto);
      res.status(201).json({
        success: true,
        message: "Tạo thông báo thành công",
        data: notification,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" });
    }
  }

  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Chưa đăng nhập" });

      const notifications = await this.notificationService.getNotifications(userId);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách thành công",
        data: notifications,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Chưa đăng nhập" });

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "ID không hợp lệ" });

      const notification = await this.notificationService.markAsRead(id, userId);
      res.status(200).json({
        success: true,
        message: "Đánh dấu đã đọc thành công",
        data: notification,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, message: "Chưa đăng nhập" });

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "ID không hợp lệ" });

      const result = await this.notificationService.delete(id, userId);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" });
    }
  }
}