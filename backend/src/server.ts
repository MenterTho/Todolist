import express, { Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { initDB } from "./common/config/db";
import { configureCloudinary } from "./common/config/cloudinary";
import { AuthModule } from "./modules/auth/auth.module";

dotenv.config();

const configureApp = (app: express.Application) => {
  const router = Router();
  
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth/login", rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: { success: false, message: "Too many login attempts, please try again later" },
  }));
  app.use("/api/auth/forgot-password", rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 3,
    message: { success: false, message: "Too many password reset requests, please try again later" },
  }));
  app.use("/api", router);

  const modules = [AuthModule];
  modules.forEach(module => module.register(router));
};

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET || !process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
        !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Missing required environment variables");
    }
    configureCloudinary();
    await initDB();
    
    const app = express();
    configureApp(app);
    
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();