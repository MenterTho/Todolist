import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { RegisterDto } from "../dtos/register.dto";
import { LoginDto } from "../dtos/login.dto";
import { ForgotPasswordDto } from "../dtos/forgotpassword.dto";
import { ResetPasswordDto } from "../dtos/resetpassword.dto";
import { UserRepository } from "../repositories/auth.repositories";
import { SessionRepository } from "../repositories/session.repositories";

export class AuthService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.sessionRepository = new SessionRepository();
  }

  async register(data: RegisterDto, file?: Express.Multer.File) {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    if (data.phoneNumber) {
      const existingPhone = await this.userRepository.findByPhoneNumber(data.phoneNumber);
      if (existingPhone) {
        throw new Error("Phone number already exists");
      }
    }

    let avatarUrl: string | undefined;

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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.save({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phoneNumber: data.phoneNumber,
      avatarUrl,
      role: "member",
      isActive: true,
      isDeleted: false,
    });

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

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    await this.userRepository.update(user.id, { lastLogin: new Date() });

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT configuration is missing");
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    const csrfToken = uuidv4(); // Tạo CSRF token

    const session = await this.sessionRepository.save({
      userId: user.id,
      refreshToken,
      isActive: true,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      csrfToken, // Trả về CSRF token trong body
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      refreshToken, // Sẽ đặt vào cookie trong controller
    };
  }

  async refreshToken(refreshToken: string, csrfToken: string, providedCsrfToken: string) {
    if (csrfToken !== providedCsrfToken) {
      throw new Error("Invalid CSRF token");
    }

    const session = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session || !session.isActive || session.expiresAt < new Date()) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await this.userRepository.findById(session.userId);
    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT configuration is missing");
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const newCsrfToken = uuidv4(); // Tạo CSRF token mới

    return {
      accessToken,
      csrfToken: newCsrfToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(refreshToken: string, csrfToken: string, providedCsrfToken: string) {
    if (csrfToken !== providedCsrfToken) {
      throw new Error("Invalid CSRF token");
    }

    const session = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session || !session.isActive) {
      throw new Error("Invalid or already logged out session");
    }

    await this.sessionRepository.deactivateSession(session.id);
    return { message: "Logged out successfully" };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = uuidv4();
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await this.userRepository.updateResetToken(user.id, resetToken, resetTokenExpiresAt);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration is missing");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `Click this link to reset your password: http://localhost:3001/api/auth/reset-password?token=${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    return { message: "Password reset email sent" };
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userRepository.findByResetToken(data.token);
    if (!user) {
      throw new Error("Invalid or expired token");
    }

    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      throw new Error("Token expired");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiresAt: undefined,
    });

    return { message: "Password reset successfully" };
  }
}