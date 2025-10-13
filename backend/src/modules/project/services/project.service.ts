import { CreateProjectDto } from "../dtos/createProject.dto";
import { UpdateProjectDto } from "../dtos/updateProject.dto";
import { Project } from "../model/project.model";
import { ProjectRepository } from "../repositories/project.repositories";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async create(dto: CreateProjectDto, userId: number): Promise<Project> {
    const userWorkspace = await this.projectRepository.findUserWorkspace(userId, dto.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    const project = await this.projectRepository.save({
      name: dto.name,
      description: dto.description,
      workspaceId: dto.workspaceId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return project;
  }

  async getProject(id: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project || project.isDeleted) {
      throw new Error("Không tìm thấy hoặc dự án đã bị xóa");
    }

    const userWorkspace = await this.projectRepository.findUserWorkspace(userId, project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    return project;
  }
  async getUserProjects(userId: number, skip = 0, take = 10): Promise<Project[]> {
    return await this.projectRepository.findByUser(userId, { skip, take });
  }
  async getProjectsByWorkspace(workspaceId: number, userId: number): Promise<Project[]> {
    const userWorkspace = await this.projectRepository.findUserWorkspace(userId, workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    const projects = await this.projectRepository.findByWorkspace(workspaceId);
    return projects;
  }

  async update(id: number, dto: UpdateProjectDto, userId: number): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project || project.isDeleted) {
      throw new Error("Không tìm thấy hoặc dự án đã bị xóa");
    }

    const userWorkspace = await this.projectRepository.findUserWorkspace(userId, project.workspaceId);
    if (!userWorkspace || !["owner","management"].includes(userWorkspace.role)) {
      throw new Error("Người dùng không có quyền cập nhật dự án này");
    }

    const updatedProject = await this.projectRepository.update(id, {
      name: dto.name,
      description: dto.description,
      updatedAt: new Date(),
    });

    if (!updatedProject) {
      throw new Error("Cập nhật dự án thất bại");
    }

    return updatedProject;
  }

  async delete(id: number, userId: number): Promise<{ message: string }> {
    const project = await this.projectRepository.findById(id);
    if (!project || project.isDeleted) {
      throw new Error("Không tìm thấy hoặc dự án đã bị xóa");
    }

    const userWorkspace = await this.projectRepository.findUserWorkspace(userId, project.workspaceId);
    if (!userWorkspace || !["owner","management"].includes(userWorkspace.role)) {
      throw new Error("Người dùng không có quyền xóa dự án này");
    }

    const success = await this.projectRepository.softDelete(id);
    if (!success) {
      throw new Error("Xóa dự án thất bại");
    }

    return { message: "Xóa dự án thành công" };
  }
}