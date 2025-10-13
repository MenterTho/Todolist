import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ProjectService } from "../services/project.service";
import { CreateProjectDto } from "../dtos/createProject.dto";
import { UpdateProjectDto } from "../dtos/updateProject.dto";

export class ProjectController {
  private projectService = new ProjectService();

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(CreateProjectDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const project = await this.projectService.create(dto, userId);
      res.status(201).json({
        success: true,
        message: "Tạo dự án thành công",
        data: project,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }

  async getProject(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const projectId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const project = await this.projectService.getProject(projectId, userId);
      res.status(200).json({
        success: true,
        message: "Lấy thông tin dự án thành công",
        data: project,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }
  async getUserProjects(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const projects = await this.projectService.getUserProjects(userId, skip, take);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách dự án của người dùng thành công",
        data: projects,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }
  async getProjectsByWorkspace(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const workspaceId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const projects = await this.projectService.getProjectsByWorkspace(workspaceId, userId);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách dự án thành công",
        data: projects,
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
      const projectId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(UpdateProjectDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const project = await this.projectService.update(projectId, dto, userId);
      res.status(200).json({
        success: true,
        message: "Cập nhật dự án thành công",
        data: project,
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
      const projectId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const result = await this.projectService.delete(projectId, userId);
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