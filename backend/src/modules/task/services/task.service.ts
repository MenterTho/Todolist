import { UserRepository } from "../../auth/repositories/auth.repositories";
import { CreateTaskDto } from "../dtos/createTask.dto";
import { UpdateTaskDto } from "../dtos/updateTask.dto";
import { Task } from "../model/task.model";
import { TaskRepository } from "../repositories/task.repositories";

export class TaskService {
  private taskRepository: TaskRepository;
  private userRepository: UserRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
    this.userRepository = new UserRepository();
  }

  async create(dto: CreateTaskDto, userId: number): Promise<Task> {
    const project = await this.taskRepository.findProject(dto.projectId);
    if (!project || project.isDeleted) {
      throw new Error("Không tìm thấy hoặc dự án đã bị xóa");
    }

    const userWorkspace = await this.taskRepository.findUserWorkspace(userId, project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    if (dto.assigneeId) {
      const assignee = await this.userRepository.findById(dto.assigneeId);
      if (!assignee || !assignee.isActive || assignee.isDeleted) {
        throw new Error("Người được gán không tồn tại hoặc không hoạt động");
      }
      const assigneeWorkspace = await this.taskRepository.findUserWorkspace(dto.assigneeId, project.workspaceId);
      if (!assigneeWorkspace) {
        throw new Error("Người được gán không phải là thành viên của không gian làm việc này");
      }
    }

    const task = await this.taskRepository.save({
      title: dto.title,
      description: dto.description,
      status: dto.status || "To Do",
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      priority: dto.priority,
      assigneeId: dto.assigneeId,
      projectId: dto.projectId,
      creatorId: userId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return task;
  }

  async getTask(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task || task.isDeleted) {
      throw new Error("Không tìm thấy hoặc nhiệm vụ đã bị xóa");
    }

    const userWorkspace = await this.taskRepository.findUserWorkspace(userId, task.project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    return task;
  }
  async getListTasks(userId: number) {
    return this.taskRepository.findByUser(userId);
  }
  async getTasksByProject(projectId: number, userId: number): Promise<Task[]> {
    const project = await this.taskRepository.findProject(projectId);
    if (!project || project.isDeleted) {
      throw new Error("Không tìm thấy hoặc dự án đã bị xóa");
    }

    const userWorkspace = await this.taskRepository.findUserWorkspace(userId, project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    const tasks = await this.taskRepository.findByProject(projectId);
    return tasks;
  }

  async update(id: number, dto: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task || task.isDeleted) {
      throw new Error("Không tìm thấy hoặc nhiệm vụ đã bị xóa");
    }
    const userWorkspace = await this.taskRepository.findUserWorkspace(userId, task.project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không có trong task này");
    }
    if (userWorkspace.role === "member") {
      if (task.assigneeId !== userId) {
        throw new Error("Bạn không được phép cập nhật nhiệm vụ này");
      }
      if (dto.status) {
        const updatedTask = await this.taskRepository.update(id, {
          status: dto.status,
          updatedAt: new Date(),
        });

        return updatedTask!;
      }
      throw new Error("Bạn chỉ có thể cập nhật trạng thái của nhiệm vụ này");
    }
    if (!["owner", "management"].includes(userWorkspace.role)) {
       throw new Error("Người dùng không có quyền cập nhật nhiệm vụ này");
    }
    
    if (dto.assigneeId) {
      const assignee = await this.userRepository.findById(dto.assigneeId);
      if (!assignee || !assignee.isActive || assignee.isDeleted) {
        throw new Error("Người được gán không tồn tại hoặc không hoạt động");
      }
      const assigneeWorkspace = await this.taskRepository.findUserWorkspace(dto.assigneeId, task.project.workspaceId);
      if (!assigneeWorkspace) {
        throw new Error("Người được gán không phải là thành viên của không gian làm việc này");
      }
    }

    const updatedTask = await this.taskRepository.update(id, {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      priority: dto.priority,
      assigneeId: dto.assigneeId,
      updatedAt: new Date(),
    });

    if (!updatedTask) {
      throw new Error("Cập nhật nhiệm vụ thất bại");
    }

    return updatedTask;
  }

  async delete(id: number, userId: number): Promise<{ message: string }> {
    const task = await this.taskRepository.findById(id);
    if (!task || task.isDeleted) {
      throw new Error("Không tìm thấy hoặc nhiệm vụ đã bị xóa");
    }

    const userWorkspace = await this.taskRepository.findUserWorkspace(userId, task.project.workspaceId);
    if (!userWorkspace || !["owner","management"].includes(userWorkspace.role)) {
      throw new Error("Người dùng không có quyền xóa nhiệm vụ này");
    }

    const success = await this.taskRepository.softDelete(id);
    if (!success) {
      throw new Error("Xóa nhiệm vụ thất bại");
    }

    return { message: "Xóa nhiệm vụ thành công" };
  }
}