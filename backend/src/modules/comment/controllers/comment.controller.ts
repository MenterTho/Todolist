import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dtos/createComment.dto";
import { UpdateCommentDto } from "../dtos/updateComment.dto";

export class CommentController {
  private commentService = new CommentService();

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const taskId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(CreateCommentDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const comment = await this.commentService.create(dto, taskId, userId);
      res.status(201).json({
        success: true,
        message: "Tạo bình luận thành công",
        data: comment,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }

  async getCommentsByTask(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const taskId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const comments = await this.commentService.getCommentsByTask(taskId, userId);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách bình luận thành công",
        data: comments,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }

  async getComment(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const commentId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const comment = await this.commentService.getComment(commentId, userId);
      res.status(200).json({
        success: true,
        message: "Lấy thông tin bình luận thành công",
        data: comment,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const commentId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(UpdateCommentDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const comment = await this.commentService.update(commentId, dto, userId);
      res.status(200).json({
        success: true,
        message: "Cập nhật bình luận thành công",
        data: comment,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const commentId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const result = await this.commentService.delete(commentId, userId);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }
}