"use client";

import { useState } from "react";
import { PlusCircle, Folder, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth.hook";
import { useWorkspaces, useWorkspaceMutations } from "@/hooks/useWorkspaces.hook";
import { Workspace } from "@/types/workspace.type";
import WorkspaceModal from "@/components/popup/editWorkspaceModal";

export default function WorkspaceManager() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: workspaces = [], isLoading, isError } = useWorkspaces();
  const { createWorkspace, updateWorkspace, deleteWorkspace, isLoading: isMutating } = useWorkspaceMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  const openCreateModal = () => {
    setEditingWorkspace(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ws: Workspace) => {
    setEditingWorkspace(ws);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: { name: string; description: string }) => {
    if (!data.name.trim()) {
      toast.error("Tên workspace không được để trống!");
      return;
    }

    if (editingWorkspace) {
      // Update
      updateWorkspace(
        { id: editingWorkspace.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật thành công!");
            setIsModalOpen(false);
            setEditingWorkspace(null);
          },
        }
      );
    } else {
      // Create
      createWorkspace(data, {
        onSuccess: () => {
          toast.success("Tạo workspace thành công!");
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa workspace này không?")) {
      deleteWorkspace(id);
    }
  };

  if (isLoading)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải danh sách workspace...</div>;

  if (isError)
    return <div className="min-h-screen flex items-center justify-center text-red-500">Lỗi khi tải danh sách workspace</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <main className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Danh sách Workspace</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            <span>Tạo Workspace</span>
          </button>
        </div>

        {workspaces.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Không có workspace nào.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws) => {
              const isOwner = ws.ownerId === user?.id;
              return (
                <div
                  key={ws.id}
                  className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition relative"
                >
                  <div
                    onClick={() => router.push(`/workspace/${ws.id}`)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Folder className="text-blue-600" size={24} />
                      <h3 className="text-xl font-semibold text-gray-800">{ws.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {ws.description || "Không có mô tả."}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Users size={18} />
                      <span>Chủ sở hữu: {ws.owner?.name}</span>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(ws);
                        }}
                        className="px-2 py-1 text-sm bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ws.id);
                        }}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal dùng chung */}
      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={
          editingWorkspace
            ? { name: editingWorkspace.name, description: editingWorkspace.description || "" }
            : undefined
        }
        loading={isMutating}
        title={editingWorkspace ? "Chỉnh sửa Workspace" : "Tạo mới Workspace"}
        submitText={editingWorkspace ? "Lưu thay đổi" : "Tạo"}
      />
    </div>
  );
}
