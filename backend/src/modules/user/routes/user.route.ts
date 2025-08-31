import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";
import { upload } from "../../../common/config/multer.config";

const router = Router();
const userController = new UserController();

router.get("/getAll", AuthMiddleware.authenticate, AuthMiddleware.authorize(["admin"]), userController.getAllUsers.bind(userController));
router.get("/profile", AuthMiddleware.authenticate, userController.getProfile.bind(userController));
router.put("/update-profile", AuthMiddleware.authenticate, upload.single("avatar"), userController.updateProfile.bind(userController));
router.delete("/delete-account", AuthMiddleware.authenticate, userController.deleteAccount.bind(userController));
router.patch("/update-role/:userId", AuthMiddleware.authenticate, AuthMiddleware.authorize(["admin"]), userController.updateRole.bind(userController));

export default router;