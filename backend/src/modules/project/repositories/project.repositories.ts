import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { Project } from "../model/project.model";
import { UserWorkspace } from "../../user_workspace/model/user_workspace.model";

export class ProjectRepository {
  private repository: Repository<Project>;
  private userWorkspaceRepository: Repository<UserWorkspace>;

  constructor() {
    this.repository = AppDataSource.getRepository(Project);
    this.userWorkspaceRepository = AppDataSource.getRepository(UserWorkspace);
  }
  async findByUser(userId: number, options: { skip?: number; take?: number } = {}): Promise<Project[]> {
    const { skip = 0, take = 10 } = options;
    return await this.repository
      .createQueryBuilder("project")
    .innerJoinAndSelect("project.workspace", "workspace") 
    .innerJoin("workspace.userWorkspaces", "userWorkspace")
    .where("userWorkspace.userId = :userId", { userId })
    .andWhere("project.isDeleted = false")
    .leftJoinAndSelect("project.tasks", "tasks", "tasks.isDeleted = false")
    .leftJoinAndSelect("workspace.userWorkspaces", "userWorkspaces") 
    .leftJoinAndSelect("userWorkspaces.user", "user")
    .orderBy("project.updatedAt", "DESC")
    .skip(skip)
    .take(take)
    .getMany();

  }
  async save(project: Partial<Project>): Promise<Project> {
    return await this.repository.save(project);
  }

  async findById(id: number): Promise<Project | null> {
    return await this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ["workspace",
      "workspace.owner",
      "workspace.userWorkspaces",
      "workspace.userWorkspaces.user",
      "tasks"],
    });
  }

  async findByWorkspace(workspaceId: number): Promise<Project[]> {
    return await this.repository.find({
      where: { workspaceId, isDeleted: false },
      relations: ["workspace", "workspace.userWorkspaces","workspace.userWorkspaces.user", "tasks"],
    });
  }

  async update(id: number, updates: Partial<Project>): Promise<Project | null> {
    const project = await this.findById(id);
    if (!project) return null;
    Object.assign(project, updates);
    return await this.repository.save(project);
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update({ id, isDeleted: false }, { isDeleted: true });
    return result.affected ? result.affected > 0 : false;
  }

  async findUserWorkspace(userId: number, workspaceId: number): Promise<UserWorkspace | null> {
    return await this.userWorkspaceRepository.findOne({ where: { userId, workspaceId } });
  }
}