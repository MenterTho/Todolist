import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { InviteUserDto } from "../dtos/inviteUser.dto";
import { UpdateMemberRoleDto } from "../dtos/updateRole.dto";
import { UserWorkspaceService } from "../services/user_workspace_service";

export class UserWorkspaceController {
  private userWorkspaceService = new UserWorkspaceService();

  async inviteUser(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const workspaceId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(InviteUserDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const result = await this.userWorkspaceService.inviteUser(workspaceId, dto, userId);
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

  async updateMemberRole(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const workspaceId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const dto = plainToInstance(UpdateMemberRoleDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: errors.map((e) => e.toString()),
        });
      }

      const userWorkspace = await this.userWorkspaceService.updateMemberRole(workspaceId, dto, userId);
      res.status(200).json({
        success: true,
        message: "Cập nhật vai trò thành viên thành công",
        data: userWorkspace,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: "Lỗi không xác định" });
      }
    }
  }

  async removeMember(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const workspaceId = parseInt(req.params.id);
      const memberId = parseInt(req.params.memberId);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const result = await this.userWorkspaceService.removeMember(workspaceId, memberId, userId);
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

  async listMembers(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const workspaceId = parseInt(req.params.id);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
      }

      const members = await this.userWorkspaceService.listMembers(workspaceId, userId);
      res.status(200).json({
        success: true,
        message: "Lấy danh sách thành viên thành công",
        data: members,
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