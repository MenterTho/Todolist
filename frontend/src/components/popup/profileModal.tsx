"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, ChangeEvent } from "react";
import { UserProfile } from "@/types/user.type";
import { updateProfile } from "@/services/user.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { CustomApiError } from "@/utils/apiErrorHandler.util";

interface ProfilePopupProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (updatedUser: UserProfile) => void;
}

interface FormDataState {
  name: string;
  phoneNumber: string;
  avatar: File | null;
}

export default function ProfilePopup({
  user,
  isOpen,
  onClose,
  onUpdated,
}: ProfilePopupProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataState>({
    name: user?.name ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    avatar: null,
  });

  if (!isOpen || !user) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = async (): Promise<void> => {
    if (!formData.name.trim()) {
      toast.error("Tên không được để trống!");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await updateProfile(
        {
          name: formData.name,
          phoneNumber: formData.phoneNumber || undefined,
        },
        formData.avatar ?? undefined
      );
      toast.success("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      onUpdated?.(updatedUser);
    } catch (error) {
      const err = error as AxiosError<CustomApiError>;
      const message =
        err.response?.data?.message || err.message || "Cập nhật thất bại!";
      toast.error(message);
      console.error("Update profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              aria-label="Đóng"
            >
              ✕
            </button>

            {/* Avatar + Info */}
            <div className="flex flex-col items-center">
              <img
                src={user.avatarUrl || "/images/avatar/avatardefault.png"}
                alt={user.name}
                width={100}
                height={100}
                className="rounded-full border-4 border-indigo-200 shadow-md"
              />

              {!isEditing ? (
                <>
                  <h2 className="mt-3 text-xl font-semibold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </>
              ) : (
                <div className="mt-3 space-y-2 w-full">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                    placeholder="Tên của bạn"
                  />
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                    placeholder="Số điện thoại"
                  />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full text-sm text-gray-600"
                  />
                </div>
              )}
            </div>

            {/* Info View Mode */}
            {!isEditing && (
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                {user.phoneNumber && (
                  <p>
                    <span className="font-medium text-gray-600">
                      📞 Số điện thoại:
                    </span>{" "}
                    {user.phoneNumber}
                  </p>
                )}
                <p>
                  <span className="font-medium text-gray-600">🧩 Vai trò:</span>{" "}
                  <span className="capitalize">{user.role}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">📅 Ngày tạo:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <span className="font-medium text-gray-600">🔔 Trạng thái:</span>{" "}
                  {user.isActive ? "Hoạt động" : "Bị khóa"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                  >
                    Đóng
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
