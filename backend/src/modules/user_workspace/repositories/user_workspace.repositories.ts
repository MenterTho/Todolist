import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { UserWorkspace } from "../model/user_workspace.model";

export class UserWorkspaceRepository {
  private repository: Repository<UserWorkspace>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserWorkspace);
  }

  async save(userWorkspace: Partial<UserWorkspace>): Promise<UserWorkspace> {
    return await this.repository.save(userWorkspace);
  }

  async findByUserAndWorkspace(userId: number, workspaceId: number): Promise<UserWorkspace | null> {
    return await this.repository.findOne({ where: { userId, workspaceId } });
  }

  async findByWorkspace(workspaceId: number): Promise<UserWorkspace[]> {
    return await this.repository.find({
      where: { workspaceId },
      relations: ["user"],
    });
  }

  async delete(userId: number, workspaceId: number): Promise<boolean> {
    const result = await this.repository.delete({ userId, workspaceId });
    return result.affected ? result.affected > 0 : false;
  }
}