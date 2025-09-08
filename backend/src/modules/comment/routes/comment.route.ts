import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { AuthMiddleware } from "../../auth/middlewares/auth.middleware";

const router = Router();
const commentController = new CommentController();

router.post("/task/:id/comment", AuthMiddleware.authenticate, commentController.create.bind(commentController));
router.get("/task/:id/comments", AuthMiddleware.authenticate, commentController.getCommentsByTask.bind(commentController));
router.get("/:id", AuthMiddleware.authenticate, commentController.getComment.bind(commentController));
router.put("/:id", AuthMiddleware.authenticate, commentController.update.bind(commentController));
router.delete("/:id", AuthMiddleware.authenticate, commentController.delete.bind(commentController));

export default router;