import { Repository, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { Workspace } from "../model/workspace.model";
import { UserWorkspace } from "../../user_workspace/model/user_workspace.model";

export class WorkspaceRepository {
  private repository: Repository<Workspace>;
  private userWorkspaceRepository: Repository<UserWorkspace>;

  constructor() {
    this.repository = AppDataSource.getRepository(Workspace);
    this.userWorkspaceRepository = AppDataSource.getRepository(UserWorkspace);
  }

  async save(workspace: Partial<Workspace>): Promise<Workspace> {
    return await this.repository.save(workspace);
  }

  async findById(id: number): Promise<Workspace | null> {
    return await this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ["owner", "userWorkspaces", "userWorkspaces.user", "projects"],
    });
  }

  async findByCriteria(criteria: Partial<Workspace>): Promise<Workspace[]> {
    return await this.repository.find({
      where: { ...criteria, isDeleted: false },
      relations: ["owner", "userWorkspaces", "userWorkspaces.user", "projects"],
    });
  }

  async update(id: number, updates: Partial<Workspace>): Promise<Workspace | null> {
    const workspace = await this.findById(id);
    if (!workspace) return null;
    Object.assign(workspace, updates);
    return await this.repository.save(workspace);
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update({ id, isDeleted: false }, { isDeleted: true });
    return result.affected ? result.affected > 0 : false;
  }

  async findWorkspacesByUser(userId: number): Promise<Workspace[]> {
    const userWorkspaces = await this.userWorkspaceRepository.find({
      where: { userId },
      relations: ["workspace", "workspace.owner"],
    });
    return userWorkspaces.map((uw) => uw.workspace).filter((w) => !w.isDeleted);
  }
}