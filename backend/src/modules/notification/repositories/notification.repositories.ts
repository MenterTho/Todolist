import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { Notification, NotificationType } from "../models/notification.model";
import { Task } from "../../task/model/task.model";
import { Comment } from "../../comment/model/comment.model";
import { UserWorkspace } from "../../user_workspace/model/user_workspace.model";

export class NotificationRepository {
  private repository: Repository<Notification>;
  private taskRepository: Repository<Task>;
  private commentRepository: Repository<Comment>;
  private userWorkspaceRepository: Repository<UserWorkspace>;

  constructor() {
    this.repository = AppDataSource.getRepository(Notification);
    this.taskRepository = AppDataSource.getRepository(Task);
    this.commentRepository = AppDataSource.getRepository(Comment);
    this.userWorkspaceRepository = AppDataSource.getRepository(UserWorkspace);
  }

  async save(notification: Partial<Notification>): Promise<Notification> {
    return await this.repository.save(notification);
  }

  async findById(id: number): Promise<Notification | null> {
    return await this.repository.findOne({ where: { id, isDeleted: false } });
  }

  async findByUser(recipientId: number): Promise<Notification[]> {
    return await this.repository.find({
      where: { recipientId, isDeleted: false },
      order: { createdAt: "DESC" },
    });
  }

  async findTask(taskId: number): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id: taskId, isDeleted: false },
      relations: ["project", "project.workspace"],
    });
  }

  async findComment(commentId: number): Promise<Comment | null> {
    return await this.commentRepository.findOne({
      where: { id: commentId, isDeleted: false },
      relations: ["task", "task.project", "task.project.workspace"],
    });
  }

  async findUserWorkspace(recipientId: number, workspaceId: number): Promise<UserWorkspace | null> {
    return await this.userWorkspaceRepository.findOne({
      where: { userId: recipientId, workspaceId, isDeleted: false },
    });
  }

  async update(id: number, updates: Partial<Notification>): Promise<Notification | null> {
    const notification = await this.findById(id);
    if (!notification) return null;
    Object.assign(notification, updates);
    return await this.repository.save(notification);
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update({ id, isDeleted: false }, { isDeleted: true });
    return result.affected ? result.affected > 0 : false;
  }
}