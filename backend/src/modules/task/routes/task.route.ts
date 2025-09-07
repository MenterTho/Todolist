import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";

const router = Router();
const taskController = new TaskController();

router.post("/create", AuthMiddleware.authenticate, taskController.create.bind(taskController));
router.get("/project/:id/tasks", AuthMiddleware.authenticate, taskController.getTasksByProject.bind(taskController));
router.get("/:id", AuthMiddleware.authenticate, taskController.getTask.bind(taskController));
router.put("/:id", AuthMiddleware.authenticate, taskController.update.bind(taskController));
router.delete("/:id", AuthMiddleware.authenticate, taskController.delete.bind(taskController));

export default router;