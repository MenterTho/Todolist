import { Router } from "express";
import { WorkspaceController } from "./controllers/workspace.controller";
import workspaceRoutes from "./routes/workspace.route";

export const WorkspaceModule = {
  controllers: [WorkspaceController],
  routes: (router: Router) => {
    router.use("/workspace", workspaceRoutes);
  },
};