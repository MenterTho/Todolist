import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";

const router = Router();
const notificationController = new NotificationController();

router.post("/create", AuthMiddleware.authenticate, notificationController.create.bind(notificationController));
router.get("/list", AuthMiddleware.authenticate, notificationController.getNotifications.bind(notificationController));
router.put("/:id/read", AuthMiddleware.authenticate, notificationController.markAsRead.bind(notificationController));
router.delete("/:id", AuthMiddleware.authenticate, notificationController.delete.bind(notificationController));

export default router;