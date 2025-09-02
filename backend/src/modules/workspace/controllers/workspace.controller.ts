import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { WorkspaceService } from "../services/workspace.service";
import { CreateWorkspaceDto } from "../dtos/create_workspace.dto";
import { UpdateWorkspaceDto } from "../dtos/update_workspace.dto";

export class WorkspaceController {
  private workspaceService = new WorkspaceService();

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(CreateWorkspaceDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const workspace = await this.workspaceService.create(dto, userId);
      res.status(201).json({
        success: true,
        message: "Tạo không gian làm việc thành công",
        data: workspace,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }

  async getWorkspace(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const workspaceId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const workspace = await this.workspaceService.getWorkspace(workspaceId, userId);
      res.status(200).json({
        success: true,
        message: "Lấy thông tin không gian làm việc thành công",
        data: workspace,
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
      const workspaceId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(UpdateWorkspaceDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const workspace = await this.workspaceService.update(workspaceId, dto, userId);
      res.status(200).json({
        success: true,
        message: "Cập nhật không gian làm việc thành công",
        data: workspace,
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
      const workspaceId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const result = await this.workspaceService.delete(workspaceId, userId);
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

  async listUserWorkspaces(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const workspaces = await this.workspaceService.listUserWorkspaces(userId);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách không gian làm việc thành công",
        data: workspaces,
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