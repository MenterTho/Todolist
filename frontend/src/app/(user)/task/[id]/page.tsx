"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Send,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth.hook";
import { useCommentsByTask, useCommentMutations } from "@/hooks/useComment.hook";
import { getTask } from "@/services/task.service";
import { Task } from "@/types/task.type";
import { Comment } from "@/types/comment.type";
import Loader from "@/components/ui/loader";

export default function TaskDetailPage() {
  const { id } = useParams();
  const numericTaskId = Number(id);

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const { data: comments = [], isLoading: isLoadingComments } =
    useCommentsByTask(numericTaskId);

  const { createComment, updateComment, deleteComment } = useCommentMutations();

  // Fetch task detail
  useEffect(() => {
    console.log(id,"task id")
    console.log(task, "task")
    console.log("Task ID param:", numericTaskId);
console.log("Task:", task);
    const fetchTask = async () => {
      try {
        const data = await getTask(numericTaskId);
        setTask(data);
      } catch (error: unknown) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Không thể tải chi tiết nhiệm vụ");
      } finally {
        setLoading(false);
      }
    };

    if (numericTaskId) fetchTask();
  }, [numericTaskId]);

  // Add comment
  const handleAddComment = () => {
    if (!commentText.trim())
      return toast.error("Vui lòng nhập nội dung bình luận");

    createComment(
      { taskId: numericTaskId, content: commentText },
      {
        onSuccess: () => {
          setCommentText("");
          queryClient.invalidateQueries({ queryKey: ["comments", numericTaskId] });
        },
      }
    );
  };

  // Edit comment
  const handleEditComment = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editingContent.trim())
      return toast.error("Nội dung không được để trống");
    if (!editingId) return;

    updateComment(
      { commentId: editingId, data: { content: editingContent } },
      {
        onSuccess: () => {
          setEditingId(null);
          queryClient.invalidateQueries({ queryKey: ["comments", numericTaskId] });
          toast.success("Cập nhật bình luận thành công");
        },
      }
    );
  };

  // Delete comment
  const handleDeleteComment = (commentId: number) => {
    deleteComment(
      { commentId, taskId: numericTaskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["comments", numericTaskId] });
          toast.success("Đã xóa bình luận");
        },
      }
    );
  };

  // 
  const canModify = (comment: Comment): boolean => {
    if (!user) return false;
    if (comment.author?.id === user.id) return true;
    if (user.role === "admin") return true;
    return false;
  };

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader />
      </div>
    );

  if (!task)
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy thông tin nhiệm vụ.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {task.title}
          </h1>
          <p className="text-gray-500">
            Dự án:{" "}
            <span className="font-medium text-indigo-600">
              {task.project?.name}
            </span>
          </p>
          <p className="text-gray-500 mt-1">
            Người tạo:{" "}
            <span className="font-medium text-gray-700">
              {task.creator?.name}
            </span>
          </p>
          {task.assignee && (
            <p className="text-gray-500 mt-1">
              Người được giao:{" "}
              <span className="font-medium text-gray-700">
                {task.assignee.name}
              </span>
            </p>
          )}
        </div>

        <div className="mt-4 md:mt-0">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              task.status === "Done"
                ? "bg-emerald-100 text-emerald-700"
                : task.status === "In Progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Mô tả</h2>
          <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
        </div>
      )}

      {/* Comments */}
      <div className="border-t pt-5">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          Bình luận ({comments.length})
        </h2>

        {/* Comment input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Nhập bình luận..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            onClick={handleAddComment}
            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            Gửi
          </button>
        </div>

        {/* Comment list */}
        <div className="space-y-4">
          {isLoadingComments ? (
            <Loader />
          ) : comments.length === 0 ? (
            <p className="text-gray-400">Chưa có bình luận nào.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border border-gray-100 p-4 rounded-xl shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-800">
                    {comment.author?.name || "Người dùng ẩn danh"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>

                {editingId === comment.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600">{comment.content}</p>
                )}

                {canModify(comment) && (
                  <div className="flex gap-4 mt-2 text-sm">
                    {editingId !== comment.id && (
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="text-indigo-500 hover:underline flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Sửa
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
