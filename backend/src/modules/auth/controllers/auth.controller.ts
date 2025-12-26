import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dtos/register.dto";
import { LoginDto } from "../dtos/login.dto";
import { ForgotPasswordDto } from "../dtos/forgotpassword.dto";
import { ResetPasswordDto } from "../dtos/resetpassword.dto";
import { UpdateFcmTokenDto } from "../dtos/updatefcmtoken.dto";
export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const dto = plainToInstance(RegisterDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.map(e => e.toString()),
        });
      }
      const user = await this.authService.register(dto, req.file);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      console.error("Register error:", error);
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const dto = plainToInstance(LoginDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.map(e => e.toString()),
        });
      }
      const result = await this.authService.login(dto);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", 
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          accessToken: result.accessToken,
          csrfToken: result.csrfToken, 
          user: result.user,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }
  // async updateFcmToken(req: Request, res: Response) {
  //   try {
  //     const userId = req.user?.userId;
  //     if (!userId) {
  //       return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
  //     }

  //     const dto = plainToInstance(UpdateFcmTokenDto, req.body);
  //     const errors = await validate(dto);
  //     if (errors.length > 0) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Dữ liệu không hợp lệ",
  //         errors: errors.map((e) => e.toString()),
  //       });
  //     }

  //     const result = await this.authService.updateFcmToken(userId, dto);
  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //     });
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       res.status(400).json({ success: false, message: error.message });
  //     } else {
  //       res.status(400).json({ success: false, message: "Lỗi không xác định" });
  //     }
  //   }
  // }
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const csrfToken = req.body.csrfToken;
      if (!refreshToken || !csrfToken) {
        return res.status(400).json({
          success: false,
          message: "Missing refresh token or CSRF token",
        });
      }
      const result = await this.authService.refreshToken(refreshToken, csrfToken, req.body.csrfToken);
      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: result.accessToken,
          csrfToken: result.csrfToken, 
          user: result.user,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const csrfToken = req.body.csrfToken;
      if (!refreshToken || !csrfToken) {
        return res.status(400).json({
          success: false,
          message: "Missing refresh token or CSRF token",
        });
      }
      const result = await this.authService.logout(refreshToken, csrfToken, req.body.csrfToken);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const dto = plainToInstance(ForgotPasswordDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.map(e => e.toString()),
        });
      }
      const result = await this.authService.forgotPassword(dto);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const dto = plainToInstance(ResetPasswordDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.map(e => e.toString()),
        });
      }
      const result = await this.authService.resetPassword(dto);
      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "An unexpected error occurred",
        });
      }
    }
  }
}