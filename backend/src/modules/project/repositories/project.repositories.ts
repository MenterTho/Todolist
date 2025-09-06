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

  async save(project: Partial<Project>): Promise<Project> {
    return await this.repository.save(project);
  }

  async findById(id: number): Promise<Project | null> {
    return await this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ["workspace", "workspace.owner", "tasks"],
    });
  }

  async findByWorkspace(workspaceId: number): Promise<Project[]> {
    return await this.repository.find({
      where: { workspaceId, isDeleted: false },
      relations: ["workspace", "workspace.owner", "tasks"],
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