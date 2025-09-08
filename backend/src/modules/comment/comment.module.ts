import { Router } from "express";
import { CommentController } from "./controllers/comment.controller";
import commentRoutes from "./routes/comment.route";

export const CommentModule = {
  controllers: [CommentController],
  routes: (router: Router) => {
    router.use("/comment", commentRoutes); 
  },
};