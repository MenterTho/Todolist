import { Router } from "express";
import userWorkspaceRoutes from "./routes/user_workspace.route";
import { UserWorkspaceController } from "./controllers/user_workspace.controller";

export const UserWorkspaceModule = {
  controllers: [UserWorkspaceController],
  routes: (router: Router) => {
    router.use("/userworkspace", userWorkspaceRoutes);
  },
};