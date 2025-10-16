"use client";
import { useState, useEffect } from "react";

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: { name: string; description: string };
  loading?: boolean;
  title: string;
  submitText: string;
}

export default function WorkspaceModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  title,
  submitText,
}: WorkspaceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: "", description: "" });
  }, [initialData, isOpen]);

  if (!isOpen) return null; // không render khi ẩn

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>

        <input
          type="text"
          placeholder="Tên workspace"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring focus:ring-indigo-300"
        />
        <textarea
          placeholder="Mô tả (tuỳ chọn)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring focus:ring-indigo-300"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={() => onSubmit(formData)}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
