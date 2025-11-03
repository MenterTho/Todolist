import { UserRepository } from "../../auth/repositories/auth.repositories";
import { WorkspaceRepository } from "../../workspace/repositories/workspace.repositories";
import { InviteUserDto } from "../dtos/inviteUser.dto";
import { UpdateMemberRoleDto } from "../dtos/updateRole.dto";
import { UserWorkspace } from "../model/user_workspace.model";
import { UserWorkspaceRepository } from "../repositories/user_workspace.repositories";
import { NotificationService } from "../../notification/services/notification.service";
import { NotificationType } from "../../notification/models/notification.model";

export class UserWorkspaceService {
  private userWorkspaceRepository: UserWorkspaceRepository;
  private workspaceRepository: WorkspaceRepository;
  private userRepository: UserRepository;
  private notificationService: NotificationService;  
  
  constructor() {
    this.userWorkspaceRepository = new UserWorkspaceRepository();
    this.workspaceRepository = new WorkspaceRepository();
    this.userRepository = new UserRepository();
    this.notificationService = new NotificationService();
  }

  async inviteUser(workspaceId: number, dto: InviteUserDto, adminId: number): Promise<{ message: string }> {
    const userWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(adminId, workspaceId);
    if (!userWorkspace || !["owner", "management"].includes(userWorkspace.role)) {
      throw new Error("Người dùng không có quyền mời thành viên");
    }
    console.log("User role in workspace:", userWorkspace.role);

    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace || workspace.isDeleted) {
      throw new Error("Không tìm thấy hoặc không gian làm việc đã bị xóa");
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.isActive || user.isDeleted) {
      throw new Error("Người dùng không tìm thấy hoặc không hoạt động");
    }

    const existingMembership = await this.userWorkspaceRepository.findByUserAndWorkspace(user.id, workspaceId);
    if (existingMembership) {
      throw new Error("Người dùng đã là thành viên của không gian làm việc này");
    }

    await this.userWorkspaceRepository.save({
      userId: user.id,
      workspaceId,
      role: dto.role,
      joinedAt: new Date(),
    });
      await this.notificationService.create({
          message: `Bạn được mời tham gia không gian làm việc: "${workspace.name}"`,
          recipientId: user.id,
          type: NotificationType.INVITE,
          relatedId: workspaceId, 
        });
    return { message: `Mời ${dto.email} vào không gian làm việc thành công` };
  }

  async updateMemberRole(workspaceId: number, dto: UpdateMemberRoleDto, adminId: number): Promise<UserWorkspace> {
    const adminWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(adminId, workspaceId);
    if (!adminWorkspace || adminWorkspace.role !== "owner") {
      throw new Error("Người dùng không có quyền cập nhật vai trò");
    }

    const userWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(dto.memberId, workspaceId);
    if (!userWorkspace) {
      throw new Error("Thành viên không thuộc không gian làm việc này");
    }

    userWorkspace.role = dto.role;
    return await this.userWorkspaceRepository.save(userWorkspace);
  }

  async removeMember(workspaceId: number, memberId: number, adminId: number): Promise<{ message: string }> {
    const adminWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(adminId, workspaceId);
    if (!adminWorkspace || !["owner", "management"].includes(adminWorkspace.role)) {
      throw new Error("Người dùng không có quyền xóa thành viên");
    }

    const userWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(memberId, workspaceId);
    if (!userWorkspace) {
      throw new Error("Thành viên không thuộc không gian làm việc này");
    }

    if (userWorkspace.userId === adminWorkspace.userId) {
      throw new Error("Không thể tự xóa chính mình");
    }

    const success = await this.userWorkspaceRepository.delete(memberId, workspaceId);
    if (!success) {
      throw new Error("Xóa thành viên thất bại");
    }

    return { message: "Xóa thành viên khỏi không gian làm việc thành công" };
  }

  async listMembers(workspaceId: number, userId: number): Promise<UserWorkspace[]> {
    const userWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(userId, workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    const members = await this.userWorkspaceRepository.findByWorkspace(workspaceId);
    return members;
  }
}