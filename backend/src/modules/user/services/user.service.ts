import { v2 as cloudinary } from "cloudinary";
import { UserRepository } from "../../auth/repositories/auth.repositories";
import { UpdateProfileDto } from "../dtos/updatepfofile.dto";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async   getProfile(userId: number) {
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
}