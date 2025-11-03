"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Folder, Users, Mail, Shield, List, UserPlus, Trash2, Edit2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useGetWorkspaceQuery,
  useGetMembersQuery,
  useWorkspaceMutations,
} from "@/hooks/useWorkspaces.hook";
import {
  UserWorkspace,
  Workspace,
  UpdateMemberRoleRequest,
  InviteUserRequest,
  RemoveMemberRequest,
} from "@/types/workspace.type";
import { useAuth } from "@/hooks/useAuth.hook";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId = Number(params.id);

  const { user: currentUser } = useAuth(); 
  const currentUserId = currentUser?.id;

  const { data: workspace, isLoading, isError } = useGetWorkspaceQuery(workspaceId);
  const { data: members = [], isLoading: isMembersLoading } = useGetMembersQuery(workspaceId);

  const [selectedMember, setSelectedMember] = useState<UserWorkspace | null>(null);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteRole, setInviteRole] = useState<"member">("member");
  const [updateRoleValue, setUpdateRoleValue] = useState<"management" | "member">("member");

  const { inviteUser, updateMemberRole, removeMember, isLoading: isMutationLoading } =
    useWorkspaceMutations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải chi tiết workspace...
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Lỗi khi tải dữ liệu workspace!
      </div>
    );
  }

  // find role user into workspace
  const currentUserWorkspace = workspace.userWorkspaces.find(
    (uw) => uw.userId === currentUserId
  );
  const currentUserRole = currentUserWorkspace?.role ?? "member";
  const canManageMembers = ["owner", "management"].includes(currentUserRole);

  const handleInviteUser = () => {
    if (!inviteEmail) {
      toast.error("Vui lòng nhập email để mời");
      return;
    }
    inviteUser({
      workspaceId,
      data: { email: inviteEmail, role: inviteRole } as InviteUserRequest,
    });
    setInviteEmail("");
  };

  const handleUpdateRole = (memberId: number) => {
    updateMemberRole({
      workspaceId,
      data: { memberId, role: updateRoleValue } as UpdateMemberRoleRequest,
    });
    setSelectedMember(null);
  };

  const handleRemoveMember = (memberId: number) => {
    const payload: RemoveMemberRequest = { workspaceId, memberId };
    removeMember(payload);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <main className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* Header Workspace */}
        <div className="flex items-center gap-4 mb-6">
          <Folder className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{workspace.name}</h1>
            <p className="text-gray-600 mt-1">{workspace.description || "Không có mô tả."}</p>
          </div>
        </div>

        {/* Chủ sở hữu */}
        <div className="flex items-center gap-3 mb-8 text-gray-700">
          <Shield size={20} className="text-blue-500" />
          <span>
            Chủ sở hữu: <strong>{workspace.owner?.name}</strong>
          </span>
          <span className="text-gray-400">({workspace.owner?.email})</span>
        </div>

        {/* Dự án */}
        {workspace.projects.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <List size={22} className="text-blue-600" /> Dự án trong workspace này
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {workspace.projects.map((project) => (
                <div
                  key={project.id}
                  className="border-2 border-blue-300 rounded-xl p-5 bg-white shadow-sm hover:shadow-md hover:border-blue-500 transition cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Folder className="text-blue-500" size={22} />
                    <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  </div>
                  <p className="text-gray-400 text-xs mt-3">
                    Tạo ngày: {new Date(project.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form mời thành viên */}
        {canManageMembers && (
          <div className="mb-10 flex items-center gap-3">
            <input
              type="email"
              placeholder="Nhập email thành viên"
              className="border rounded-lg px-3 py-2 flex-1"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button
              onClick={handleInviteUser}
              disabled={isMutationLoading}
              className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <UserPlus size={18} /> Mời
            </button>
          </div>
        )}

        {/* Danh sách thành viên */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={22} /> Danh sách thành viên
        </h2>

        {isMembersLoading ? (
          <p className="text-gray-500">Đang tải danh sách thành viên...</p>
        ) : members.length === 0 ? (
          <p className="text-gray-500">Chưa có thành viên nào trong workspace này.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((member) => (
              <div
                key={member.userId}
                onClick={() => setSelectedMember(member)}
                className="border-2 border-blue-300 rounded-xl p-4 shadow hover:shadow-lg cursor-pointer transition bg-gray-50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={member.user.avatarUrl || "/default-avatar.png"}
                    alt={member.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{member.user.name}</p>
                    <p className="text-gray-500 text-sm">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail size={14} /> {member.user.email}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Popup chi tiết thành viên */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[400px] relative">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>

            <div className="flex flex-col items-center text-center gap-3">
              <img
                src={selectedMember.user.avatarUrl || "/default-avatar.png"}
                alt={selectedMember.user.name}
                className="w-20 h-20 rounded-full mb-2"
              />
              <h3 className="text-xl font-semibold">{selectedMember.user.name}</h3>
              <p className="text-gray-600 text-sm">{selectedMember.user.email}</p>
              <p className="text-gray-700 font-medium">
                Vai trò: <span className="capitalize text-blue-600">{selectedMember.role}</span>
              </p>
              <p className="text-gray-400 text-sm">
                Tham gia ngày: {new Date(selectedMember.joinedAt).toLocaleDateString("vi-VN")}
              </p>

              {/* Quản lý role và xóa member */}
              {canManageMembers && selectedMember.userId !== workspace.ownerId && (
                <div className="flex flex-col gap-2 mt-4 w-full">
                  <div className="flex gap-2">
                    <select
                      value={updateRoleValue}
                      onChange={(e) =>
                        setUpdateRoleValue(e.target.value as "management" | "member")
                      }
                      className="border px-2 py-1 rounded-lg flex-1"
                    >
                      <option value="member">Member</option>
                      <option value="management">Management</option>
                    </select>
                    <button
                      onClick={() => handleUpdateRole(selectedMember.userId)}
                      disabled={isMutationLoading}
                      className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                    >
                      <Edit2 size={16} /> Cập nhật
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveMember(selectedMember.userId)}
                    disabled={isMutationLoading}
                    className="flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} /> Xóa thành viên
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
