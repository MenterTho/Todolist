import { Router } from "express";
import userRoutes from "./routes/user.route";
import { UserController } from "./controllers/user.controller";
export const UserModule = {
  controllers: [UserController],
  routes: (router: Router) => {
    router.use("/user", userRoutes);
  },
};