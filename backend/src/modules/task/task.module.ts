import { Router } from "express";
import { TaskController } from "./controllers/task.controller";
import taskRoutes from "./routes/task.route";

export const TaskModule = {
  controllers: [TaskController],
  routes: (router: Router) => {
    router.use("/task", taskRoutes);
  },
};