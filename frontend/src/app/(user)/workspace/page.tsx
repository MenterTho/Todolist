"use client";

import { useState } from "react";
import { PlusCircle, Folder, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaces, useWorkspaceMutations } from "@/hooks/useWorkspaces.hook";
import { Workspace } from "@/types/workspace.type";
import toast from "react-hot-toast";

export default function WorkspaceManager() {
  const router = useRouter();
  const { data: workspaces = [], isLoading, isError } = useWorkspaces();
  const { createWorkspace, isLoading: isMutating } = useWorkspaceMutations();

  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newWorkspace, setNewWorkspace] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      toast.error("Vui lòng nhập tên workspace!");
      return;
    }

    createWorkspace(
      {
        name: newWorkspace.name,
        description: newWorkspace.description,
      },
      {
        onSuccess: () => {
          setShowCreateForm(false);
          setNewWorkspace({ name: "", description: "" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải danh sách workspace...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Lỗi khi tải danh sách workspace
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Danh sách Workspace</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            <span>Tạo Workspace</span>
          </button>
        </div>

        {/* Form tạo workspace */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Tạo mới Workspace</h2>
            <input
              type="text"
              placeholder="Tên workspace"
              value={newWorkspace.name}
              onChange={(e) =>
                setNewWorkspace({ ...newWorkspace, name: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <textarea
              placeholder="Mô tả (tuỳ chọn)"
              value={newWorkspace.description}
              onChange={(e) =>
                setNewWorkspace({ ...newWorkspace, description: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateWorkspace}
                disabled={isMutating}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isMutating ? "Đang tạo..." : "Tạo"}
              </button>
            </div>
          </div>
        )}

        {/* Danh sách workspace */}
        {workspaces.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Không có workspace nào.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws: Workspace) => (
              <div
                key={ws.id}
                onClick={() => router.push(`/workspace/${ws.id}`)}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer"
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
