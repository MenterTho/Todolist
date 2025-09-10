import { Router } from "express";
import notificationRoutes from "./routes/notification.route";

export class NotificationModule {
  static routes(router: Router) {
    router.use("/notification", notificationRoutes);
  }
}