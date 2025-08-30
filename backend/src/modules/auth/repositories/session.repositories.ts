import { Repository } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { Session } from "../model/session.model";
export class SessionRepository {
  private repository: Repository<Session>;

  constructor() {
    this.repository = AppDataSource.getRepository(Session);
  }

  async save(session: Partial<Session>): Promise<Session> {
    return await this.repository.save(session);
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return await this.repository.findOne({ where: { refreshToken, isActive: true } });
  }

  async deactivateSession(id: number): Promise<boolean> {
    const result = await this.repository.update({ id, isActive: true }, { isActive: false });
    return result.affected ? result.affected > 0 : false;
  }
}