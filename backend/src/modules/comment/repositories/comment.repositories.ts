import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { Comment } from "../model/comment.model";
import { Task } from "../../task/model/task.model";
import { UserWorkspace } from "../../user_workspace/model/user_workspace.model";

export class CommentRepository {
  private repository: Repository<Comment>;
  private userWorkspaceRepository: Repository<UserWorkspace>;
  private taskRepository: Repository<Task>;

  constructor() {
    this.repository = AppDataSource.getRepository(Comment);
    this.userWorkspaceRepository = AppDataSource.getRepository(UserWorkspace);
    this.taskRepository = AppDataSource.getRepository(Task);
  }

  async save(comment: Partial<Comment>): Promise<Comment> {
    return await this.repository.save(comment);
  }

  async findById(id: number): Promise<Comment | null> {
    return await this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ["task", "task.project", "task.project.workspace", "author", "parent"],
    });
  }

  async findByTask(taskId: number): Promise<Comment[]> {
    return await this.repository.find({
      where: { taskId, isDeleted: false },
      relations: ["task", "task.project", "task.project.workspace", "author", "parent"],
    });
  }

  async update(id: number, updates: Partial<Comment>): Promise<Comment | null> {
    const comment = await this.findById(id);
    if (!comment) return null;
    Object.assign(comment, updates);
    return await this.repository.save(comment);
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update({ id, isDeleted: false }, { isDeleted: true });
    return result.affected ? result.affected > 0 : false;
  }

  async findUserWorkspace(userId: number, workspaceId: number): Promise<UserWorkspace | null> {
    return await this.userWorkspaceRepository.findOne({ where: { userId, workspaceId } });
  }

  async findTask(taskId: number): Promise<Task | null> {
  return await this.taskRepository.findOne({
    where: { id: taskId, isDeleted: false },
    relations: ["project", "project.workspace"], 
  });
}

  async findCommentById(id: number): Promise<Comment | null> {
    return await this.repository.findOne({ where: { id, isDeleted: false } });
  }
}