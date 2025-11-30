"use client";

import React, { useState } from "react";
import type { CreateProjectRequest } from "@/types/project.type";

type WorkspaceOption = {
  id: number;
  name: string;
};

interface CreateProjectModalProps {
  onClose: () => void;
  workspaces: WorkspaceOption[]; 
  onCreate: (payload: CreateProjectRequest) => void;
}

export default function CreateProjectModal({ onClose, workspaces, onCreate }: CreateProjectModalProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [workspaceId, setWorkspaceId] = useState<number | undefined>(workspaces?.[0]?.id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      // bạn có thể thay bằng toast nếu đang dùng toast ở page cha
      alert("Vui lòng nhập tên dự án");
      return;
    }

    if (!workspaceId) {
      alert("Vui lòng chọn workspace");
      return;
    }

    const payload: CreateProjectRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      workspaceId,
    };

    onCreate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tạo Project mới</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Đóng</button>
        </div>

        {workspaces.length === 0 ? (
          <div className="text-sm text-gray-600">
            Hiện bạn chưa có workspace khả dụng để tạo project. Vui lòng tạo workspace trước.
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label className="text-sm text-gray-700">
              Tên dự án
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập tên dự án"
                required
              />
            </label>

            <label className="text-sm text-gray-700">
              Mô tả (tùy chọn)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Mô tả ngắn"
              />
            </label>

            <label className="text-sm text-gray-700">
              Workspace
              <select
                value={workspaceId}
                onChange={(e) => setWorkspaceId(Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                Tạo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
