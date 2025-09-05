import { Router } from "express";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";
import { UserWorkspaceController } from "../controllers/user_workspace.controller";

const router = Router();
const userWorkspaceController = new UserWorkspaceController();

router.post("/:id/invite", AuthMiddleware.authenticate, userWorkspaceController.inviteUser.bind(userWorkspaceController));
router.patch("/:id/update-member-role", AuthMiddleware.authenticate, userWorkspaceController.updateMemberRole.bind(userWorkspaceController));
router.delete("/:id/remove-member/:memberId", AuthMiddleware.authenticate, userWorkspaceController.removeMember.bind(userWorkspaceController));
router.get("/:id/members", AuthMiddleware.authenticate, userWorkspaceController.listMembers.bind(userWorkspaceController));

export default router;