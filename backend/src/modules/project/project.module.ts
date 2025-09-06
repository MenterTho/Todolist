import { Router } from "express";
import { ProjectController } from "./controllers/project.controller";
import projectRoutes from "./routes/project.route";

export const ProjectModule = {
  controllers: [ProjectController],
  routes: (router: Router) => {
    router.use("/project", projectRoutes);
  },
};