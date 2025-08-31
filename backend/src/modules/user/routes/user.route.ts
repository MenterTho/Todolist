import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";
import { upload } from "../../../common/config/multer.config";

const router = Router();
const userController = new UserController();

router.get("/profile", AuthMiddleware.authenticate, userController.getProfile.bind(userController));
router.put("/update-profile", AuthMiddleware.authenticate, upload.single("avatar"), userController.updateProfile.bind(userController));

export default router;