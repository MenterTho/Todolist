import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";
import authRoutes from "./routes/auth.route";

export const AuthModule = {
  controllers: [AuthController],
  register: (router: Router) => {
    router.use("/auth", authRoutes);
  },
};