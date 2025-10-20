import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { Task } from "../model/task.model";
import { Project } from "../../project/model/project.model";
import { UserWorkspace } from "../../user_workspace/model/user_workspace.model";

export class TaskRepository {
  private repository: Repository<Task>;
  private userWorkspaceRepository: Repository<UserWorkspace>;
  private projectRepository: Repository<Project>;

  constructor() {
    this.repository = AppDataSource.getRepository(Task);
    this.userWorkspaceRepository = AppDataSource.getRepository(UserWorkspace);
    this.projectRepository = AppDataSource.getRepository(Project);
  }

  async save(task: Partial<Task>): Promise<Task> {
    return await this.repository.save(task);
  }

  async findById(id: number): Promise<Task | null> {
    return await this.repository
      .createQueryBuilder("task")
      .leftJoinAndSelect("task.comments", "comments", "comments.isDeleted = :isDeleted", { isDeleted: false })
      .leftJoinAndSelect("task.project", "project")
      .leftJoinAndSelect("task.assignee", "assignee")
      .leftJoinAndSelect("task.creator", "creator")
      .where("task.id = :id", { id })
      .andWhere("task.isDeleted = :isDeleted", { isDeleted: false })
      .getOne();
  }

  async findByProject(projectId: number): Promise<Task[]> {
  return await this.repository
    .createQueryBuilder("task")
    .leftJoinAndSelect("task.project", "project")
    .leftJoinAndSelect("project.workspace", "workspace")
    .leftJoinAndSelect("task.assignee", "assignee")
    .leftJoinAndSelect("task.creator", "creator")
    .leftJoinAndSelect("task.comments", "comments", "comments.isDeleted = false")
    .where("task.projectId = :projectId", { projectId })
    .andWhere("task.isDeleted = false")
    .getMany();
}

async findByUser(userId: number): Promise<Task[]> {
  return this.repository.createQueryBuilder("task")
    .leftJoinAndSelect("task.project", "project")
    .leftJoinAndSelect("project.workspace", "workspace")
    .leftJoinAndSelect("task.assignee", "assignee")
    .leftJoinAndSelect("task.creator", "creator")
    .leftJoinAndSelect("task.comments", "comments", "comments.isDeleted = false")
    .where("(task.creatorId = :userId OR task.assigneeId = :userId)", { userId })
    .andWhere("task.isDeleted = false")
    .getMany();
}

  async update(id: number, updates: Partial<Task>): Promise<Task | null> {
    const task = await this.findById(id);
    if (!task) return null;
    Object.assign(task, updates);
    return await this.repository.save(task);
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update({ id, isDeleted: false }, { isDeleted: true });
    return result.affected ? result.affected > 0 : false;
  }

  async findUserWorkspace(userId: number, workspaceId: number): Promise<UserWorkspace | null> {
    return await this.userWorkspaceRepository.findOne({ where: { userId, workspaceId } });
  }

  async findProject(projectId: number): Promise<Project | null> {
    return await this.projectRepository.findOne({ where: { id: projectId, isDeleted: false } });
  }
}