import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TaskService } from "../services/task.service";
import { CreateTaskDto } from "../dtos/createTask.dto";
import { UpdateTaskDto } from "../dtos/updateTask.dto";

export class TaskController {
  private taskService = new TaskService();

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(CreateTaskDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const task = await this.taskService.create(dto, userId);
      res.status(201).json({
        success: true,
        message: "Tạo nhiệm vụ thành công",
        data: task,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }

  async getTask(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const taskId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const task = await this.taskService.getTask(taskId, userId);
      res.status(200).json({
        success: true,
        message: "Lấy thông tin nhiệm vụ thành công",
        data: task,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }
async getAllTasks(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập",
      });
    }

    const tasks = await this.taskService.getListTasks(userId);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách tất cả nhiệm vụ thành công",
      data: tasks,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Lỗi không xác định",
    });
  }
}
  async getTasksByProject(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const projectId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const tasks = await this.taskService.getTasksByProject(projectId, userId);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách nhiệm vụ thành công",
        data: tasks,
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
      const taskId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(UpdateTaskDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const task = await this.taskService.update(taskId, dto, userId);
      res.status(200).json({
        success: true,
        message: "Cập nhật nhiệm vụ thành công",
        data: task,
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
      const taskId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const result = await this.taskService.delete(taskId, userId);
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