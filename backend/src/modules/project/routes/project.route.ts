import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";

const router = Router();
const projectController = new ProjectController();

router.post("/create", AuthMiddleware.authenticate, projectController.create.bind(projectController));
router.get("/user", AuthMiddleware.authenticate, projectController.getUserProjects.bind(projectController));
router.get("/workspace/:id/projects", AuthMiddleware.authenticate, projectController.getProjectsByWorkspace.bind(projectController));
router.get("/:id", AuthMiddleware.authenticate, projectController.getProject.bind(projectController));
router.put("/:id", AuthMiddleware.authenticate, projectController.update.bind(projectController));
router.delete("/:id", AuthMiddleware.authenticate, projectController.delete.bind(projectController));

export default router;