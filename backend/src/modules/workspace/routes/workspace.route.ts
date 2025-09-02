import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";

const router = Router();
const workspaceController = new WorkspaceController();

router.post("/create", AuthMiddleware.authenticate, workspaceController.create.bind(workspaceController));
router.get("/list", AuthMiddleware.authenticate, workspaceController.listUserWorkspaces.bind(workspaceController));
router.get("/:id", AuthMiddleware.authenticate, workspaceController.getWorkspace.bind(workspaceController));
router.put("/:id", AuthMiddleware.authenticate, workspaceController.update.bind(workspaceController));
router.delete("/:id", AuthMiddleware.authenticate, workspaceController.delete.bind(workspaceController));

export default router;