import { UserWorkspaceRepository } from "../../user_workspace/repositories/user_workspace.repositories";
import { UserRepository } from "../../auth/repositories/auth.repositories";
import { Workspace } from "../model/workspace.model";
import { WorkspaceRepository } from "../repositories/workspace.repositories";
import { CreateWorkspaceDto } from "../dtos/create_workspace.dto";
import { UpdateWorkspaceDto } from "../dtos/update_workspace.dto";

export class WorkspaceService {
  private workspaceRepository: WorkspaceRepository;
  private userWorkspaceRepository: UserWorkspaceRepository;
  private userRepository: UserRepository;

  constructor() {
    this.workspaceRepository = new WorkspaceRepository();
    this.userWorkspaceRepository = new UserWorkspaceRepository();
    this.userRepository = new UserRepository();
  }

  async create(dto: CreateWorkspaceDto, userId: number): Promise<Workspace> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive || user.isDeleted) {
      throw new Error("Người dùng không hoạt động hoặc đã bị xóa");
    }

    const workspace = await this.workspaceRepository.save({
      name: dto.name,
      description: dto.description,
      ownerId: userId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userWorkspaceRepository.save({
      userId,
      workspaceId: workspace.id,
      role: "owner",
      joinedAt: new Date(),
    });

    return workspace;
  }

  async getWorkspace(id: number, userId: number): Promise<Workspace> {
    const userWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(userId, id);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new Error("Không tìm thấy hoặc không gian làm việc đã bị xóa");
    }

    return workspace;
  }

  async update(id: number, dto: UpdateWorkspaceDto, userId: number): Promise<Workspace> {
    const userWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(userId, id);
    if (!userWorkspace || (userWorkspace.role !== "management" && userWorkspace.role !== "owner")) {
      throw new Error("Người dùng không có quyền cập nhật không gian làm việc này");
    }

    const workspace = await this.workspaceRepository.update(id, {
      name: dto.name,
      description: dto.description,
      updatedAt: new Date(),
    });

    if (!workspace) {
      throw new Error("Không tìm thấy hoặc không gian làm việc đã bị xóa");
    }

    return workspace;
  }

  async delete(id: number, userId: number): Promise<{ message: string }> {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new Error("Không tìm thấy hoặc workspace đã bị xóa");
    }
    const userWorkspace = await this.userWorkspaceRepository.findByUserAndWorkspace(userId, id);
    if (workspace.ownerId !== userId && (!userWorkspace || userWorkspace.role !== "owner")) {
      throw new Error("Người dùng không có quyền xóa không gian làm việc này");
    }

    const success = await this.workspaceRepository.softDelete(id);
    if (!success) {
      throw new Error("Xóa không gian làm việc thất bại");
    }

    return { message: "Xóa không gian làm việc thành công" };
  }

  async listUserWorkspaces(userId: number): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.findWorkspacesByUser(userId);
    return workspaces;
  }
}