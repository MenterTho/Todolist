import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/auth.repositories";

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "JWT configuration is missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      
      const userRepository = new UserRepository();
      const user = await userRepository.findById(decoded.userId);
      if (!user || !user.isActive || user.isDeleted) {
        return res.status(401).json({ success: false, message: "Invalid or inactive user" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }

  static authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
      }

      next();
    };
  }
}