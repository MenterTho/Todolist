import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserService } from "../services/user.service";
import { UpdateProfileDto } from "../dtos/updatepfofile.dto";
import { UpdateRoleDto } from "../dtos/updateRole.dto";

export class UserController {
  private userService = new UserService();

  async getAllUsers(req: Request, res: Response) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        role: req.query.role as string,
        isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
        search: req.query.search as string,
        exact: req.query.exact === "true",
      };
      const result = await this.userService.getAllUsers(params);
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const profile = await this.userService.getProfile(userId);
      res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: profile,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const dto = plainToInstance(UpdateProfileDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.map(e => e.toString()),
        });
      }
      const profile = await this.userService.updateProfile(userId, dto, req.file);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const result = await this.userService.deleteAccount(userId);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const adminId = req.user?.userId;
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const dto = plainToInstance(UpdateRoleDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.map(e => e.toString()),
        });
      }
      const updatedUser = await this.userService.updateRole(userId, dto, adminId);
      res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }
}