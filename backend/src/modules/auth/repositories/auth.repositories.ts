import { Repository, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../../../common/config/db.config";
import { User } from "../model/auth.model";
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  // Create or Update
  async save(user: Partial<User>): Promise<User> {
    return await this.repository.save(user);
  }

  // Read: Find by ID
  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({ where: { id, isDeleted: false } });
  }

  // Read: Find by Email
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email, isDeleted: false } });
  }

  // Read: Find by Phone Number
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.repository.findOne({ where: { phoneNumber, isDeleted: false } });
  }

  // Read: Find by Reset Token
  async findByResetToken(token: string): Promise<User | null> {
    return await this.repository.findOne({ where: { resetToken: token, isDeleted: false } });
  }

  // Read: Find all users (with optional filters)
  async findAll(options: { isActive?: boolean; role?: string } = {}): Promise<User[]> {
    const where: FindOptionsWhere<User> = { isDeleted: false };
    if (options.isActive !== undefined) where.isActive = options.isActive;
    if (options.role) where.role = options.role;
    return await this.repository.find({ where });
  }
    async findAndCount(options: { 
        where: FindOptionsWhere<User> | FindOptionsWhere<User>[];
        skip?: number;
        take?: number;
        select?: (keyof User)[];
      }): Promise<[User[], number]> {
        return await this.repository.findAndCount({
          where: options.where,
          skip: options.skip,
          take: options.take,
          select: options.select,
        });
      }
  // Read: Find by multiple criteria
  async findByCriteria(criteria: Partial<User>): Promise<User[]> {
    return await this.repository.find({ 
      where: { ...criteria, isDeleted: false }
    });
  }

  // Update: Update specific fields
  async update(id: number, updates: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    Object.assign(user, updates);
    return await this.repository.save(user);
  }

  // Update: Update reset token and expiry
  async updateResetToken(id: number, resetToken: string | undefined, resetTokenExpiresAt: Date | undefined): Promise<User | null> {
    return await this.update(id, { resetToken, resetTokenExpiresAt });
  }

  // Delete: Soft delete (set isDeleted = true)
  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update({ id, isDeleted: false }, { isDeleted: true });
    return result.affected ? result.affected > 0 : false;
  }

  // Delete: Hard delete (permanently remove)
  async hardDelete(id: number): Promise<boolean> {
    const result = await this.repository.delete({ id });
    return result.affected ? result.affected > 0 : false;
  }
}