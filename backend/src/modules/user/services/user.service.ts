import { v2 as cloudinary } from "cloudinary";
import { UserRepository } from "../../auth/repositories/auth.repositories";
import { SessionRepository } from "../../auth/repositories/session.repositories";
import { Like, FindOptionsWhere } from "typeorm";
import { UpdateRoleDto } from "../dtos/updateRole.dto";
import { UpdateProfileDto } from "../dtos/updateprofile.dto";
import { User } from "../../auth/model/auth.model";

export class UserService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.sessionRepository = new SessionRepository();
  }

  async getAllUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
    exact?: boolean;
  }) {
    const { page = 1, limit = 10, role, isActive, search, exact = false } = params;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User>[] = [{ isDeleted: false }];

    if (role) {
      where[0].role = role;
    }
    if (isActive !== undefined) {
      where[0].isActive = isActive;
    }

    if (search) {
      const searchConditions: FindOptionsWhere<User>[] = [
        { isDeleted: false, email: exact ? search : Like(`%${search}%`) },
        { isDeleted: false, name: exact ? search : Like(`%${search}%`) },
        { isDeleted: false, phoneNumber: exact ? search : Like(`%${search}%`) },
      ];
      if (role) {
        searchConditions.forEach(condition => (condition.role = role));
      }
      if (isActive !== undefined) {
        searchConditions.forEach(condition => (condition.isActive = isActive));
      }
      where.push(...searchConditions);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take: limit,
      select: ["id", "email", "name", "phoneNumber", "avatarUrl", "role", "isActive", "createdAt"],
    });

    return {
      users: users.map((user: User) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive || user.isDeleted) {
      throw new Error("User is inactive or deleted");
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: number, data: UpdateProfileDto, file?: Express.Multer.File) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive || user.isDeleted) {
      throw new Error("User is inactive or deleted");
    }

    if (data.phoneNumber) {
      const existingPhone = await this.userRepository.findByPhoneNumber(data.phoneNumber);
      if (existingPhone && existingPhone.id !== userId) {
        throw new Error("Phone number already exists");
      }
    }

    let avatarUrl: string | undefined = user.avatarUrl;

    if (file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
          folder: "todolist/avatars",
          resource_type: "image",
        });
        avatarUrl = uploadResult.secure_url;
      } catch (error) {
        throw new Error("Failed to upload avatar to Cloudinary");
      }
    } else if (data.avatarUrl && data.avatarUrl.startsWith("data:image")) {
      try {
        const uploadResult = await cloudinary.uploader.upload(data.avatarUrl, {
          folder: "todolist/avatars",
          resource_type: "image",
        });
        avatarUrl = uploadResult.secure_url;
      } catch (error) {
        throw new Error("Failed to upload avatar to Cloudinary");
      }
    } else if (data.avatarUrl) {
      const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
      if (!urlRegex.test(data.avatarUrl)) {
        throw new Error("Invalid avatar URL format");
      }
      avatarUrl = data.avatarUrl;
    }

    const updatedUser = await this.userRepository.update(userId, {
      name: data.name || user.name,
      phoneNumber: data.phoneNumber || user.phoneNumber,
      avatarUrl,
    });

    if (!updatedUser) {
      throw new Error("Failed to update profile");
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phoneNumber: updatedUser.phoneNumber,
      avatarUrl: updatedUser.avatarUrl,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    };
  }

  async deleteAccount(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive || user.isDeleted) {
      throw new Error("User is inactive or already deleted");
    }

    // Deactivate all sessions
    const sessions = await this.sessionRepository.findByCriteria({ userId, isActive: true });
    for (const session of sessions) {
      await this.sessionRepository.deactivateSession(session.id);
    }

    const success = await this.userRepository.softDelete(userId);
    if (!success) {
      throw new Error("Failed to delete account");
    }

    return { message: "Account deleted successfully" };
  }

  async updateRole(userId: number, data: UpdateRoleDto, adminId: number) {
    if (userId === adminId) {
      throw new Error("Cannot change your own role");
    }

    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive || user.isDeleted) {
      throw new Error("User is inactive or deleted");
    }

    const updatedUser = await this.userRepository.update(userId, { role: data.role });
    if (!updatedUser) {
      throw new Error("Failed to update role");
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phoneNumber: updatedUser.phoneNumber,
      avatarUrl: updatedUser.avatarUrl,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
    };
  }
}