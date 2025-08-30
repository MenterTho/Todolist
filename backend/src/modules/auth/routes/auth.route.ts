import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginRateLimiter, forgotPasswordRateLimiter } from "../../../common/config/ratelimit.config";
import { upload } from "../../../common/config/multer.config";

const router = Router();
const authController = new AuthController();

router.post("/register", upload.single("avatar"), authController.register.bind(authController));
router.post("/login", loginRateLimiter, authController.login.bind(authController));
router.post("/forgot-password", forgotPasswordRateLimiter, authController.forgotPassword.bind(authController));
router.post("/reset-password", authController.resetPassword.bind(authController));

export default router;