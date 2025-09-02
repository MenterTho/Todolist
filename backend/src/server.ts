import express, { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { initDB } from "./common/config/db.config";
import { configureCloudinary } from "./common/config/cloudinary.config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";

const configureApp = (app: express.Application) => {
  const router = Router();

  app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true, 
  }));
  app.use(express.json());
  app.use(cookieParser()); 
  app.use(morgan('combined'));
  app.use("/api", router);

  const modules = [AuthModule,UserModule,WorkspaceModule];
  modules.forEach(module => module.routes(router));
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