import { CreateCommentDto } from "../dtos/createComment.dto";
import { UpdateCommentDto } from "../dtos/updateComment.dto";
import { Comment } from "../model/comment.model";
import { CommentRepository } from "../repositories/comment.repositories";

export class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async create(dto: CreateCommentDto, taskId: number, userId: number): Promise<Comment> {
    const task = await this.commentRepository.findTask(taskId);
    if (!task || task.isDeleted) {
      throw new Error("Không tìm thấy hoặc nhiệm vụ đã bị xóa");
    }
    if (!task.project || !task.project.workspace) {
      throw new Error("Nhiệm vụ không thuộc dự án hoặc không gian làm việc hợp lệ");
    }
    if (task.assigneeId !== userId && task.creatorId !== userId) {
      throw new Error("Chỉ người được giao hoặc người tạo nhiệm vụ mới có thể bình luận");
    }
    const userWorkspace = await this.commentRepository.findUserWorkspace(userId, task.project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }
    if (dto.parentId) {
      const parentComment = await this.commentRepository.findCommentById(dto.parentId);
      if (!parentComment || parentComment.taskId !== taskId) {
        throw new Error("Bình luận cha không tồn tại hoặc không thuộc nhiệm vụ này");
      }
    }

    const comment = await this.commentRepository.save({
      content: dto.content,
      taskId,
      authorId: userId,
      parentId: dto.parentId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return comment;
  }

  async getComment(id: number, userId: number): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment || comment.isDeleted) {
      throw new Error("Không tìm thấy hoặc bình luận đã bị xóa");
    }
    if (!comment.task.project || !comment.task.project.workspace) {
      throw new Error("Bình luận không thuộc dự án hoặc không gian làm việc hợp lệ");
    }

    const userWorkspace = await this.commentRepository.findUserWorkspace(userId, comment.task.project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    return comment;
  }

  async getCommentsByTask(taskId: number, userId: number): Promise<Comment[]> {
    const task = await this.commentRepository.findTask(taskId);
    if (!task || task.isDeleted) {
      throw new Error("Không tìm thấy hoặc nhiệm vụ đã bị xóa");
    }
    if (!task.project || !task.project.workspace) {
      throw new Error("Nhiệm vụ không thuộc dự án hoặc không gian làm việc hợp lệ");
    }

    const userWorkspace = await this.commentRepository.findUserWorkspace(userId, task.project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    const comments = await this.commentRepository.findByTask(taskId);
    return comments;
  }

  async update(id: number, dto: UpdateCommentDto, userId: number): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment || comment.isDeleted) {
      throw new Error("Không tìm thấy hoặc bình luận đã bị xóa");
    }
    if (!comment.task.project || !comment.task.project.workspace) {
      throw new Error("Bình luận không thuộc dự án hoặc không gian làm việc hợp lệ");
    }

    if (comment.authorId !== userId) {
      throw new Error("Bạn chỉ có thể chỉnh sửa bình luận của chính mình");
    }

    const userWorkspace = await this.commentRepository.findUserWorkspace(userId, comment.task.project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    const updatedComment = await this.commentRepository.update(id, {
      content: dto.content,
      updatedAt: new Date(),
    });

    if (!updatedComment) {
      throw new Error("Cập nhật bình luận thất bại");
    }

    return updatedComment;
  }

  async delete(id: number, userId: number): Promise<{ message: string }> {
    const comment = await this.commentRepository.findById(id);
    if (!comment || comment.isDeleted) {
      throw new Error("Không tìm thấy hoặc bình luận đã bị xóa");
    }
    if (!comment.task.project || !comment.task.project.workspace) {
      throw new Error("Bình luận không thuộc dự án hoặc không gian làm việc hợp lệ");
    }

    const userWorkspace = await this.commentRepository.findUserWorkspace(userId, comment.task.project.workspaceId);
    if (!userWorkspace) {
      throw new Error("Người dùng không phải là thành viên của không gian làm việc này");
    }

    if (comment.authorId !== userId && userWorkspace.role !== "admin") {
      throw new Error("Bạn chỉ có thể xóa bình luận của chính mình hoặc nếu bạn là admin");
    }

    const success = await this.commentRepository.softDelete(id);
    if (!success) {
      throw new Error("Xóa bình luận thất bại");
    }

    return { message: "Xóa bình luận thành công" };
  }
}