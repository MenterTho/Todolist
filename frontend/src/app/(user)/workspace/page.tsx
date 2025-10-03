"use client";
import React, { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

interface UserWorkspace {
  userId: number;
  role: "owner" | "management" | "member";
}

interface Workspace {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  userWorkspaces: UserWorkspace[];
  projects: { id: number }[];
}

export default function WorkspaceManager() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [inviteEmail, setInviteEmail] = useState("");

  // 👉 Giả định user hiện tại
  const currentUserId = 3;

  // 👉 Data mẫu
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 1,
      name: "Marketing Team",
      description: "Chiến dịch marketing Q4 2024",
      ownerId: 1,
      userWorkspaces: [
        { userId: 1, role: "owner" },
        { userId: 2, role: "management" },
        { userId: 3, role: "member" },
      ],
      projects: [{ id: 1 }, { id: 2 }],
    },
    {
      id: 2,
      name: "Client: ABC Corp",
      description: "Dự án phát triển website",
      ownerId: 3,
      userWorkspaces: [
        { userId: 3, role: "owner" },
        { userId: 2, role: "member" },
      ],
      projects: [{ id: 1 }],
    },
    {
      id: 3,
      name: "Workspace nội bộ",
      description: "Workspace này bạn không tham gia",
      ownerId: 4,
      userWorkspaces: [{ userId: 4, role: "owner" }],
      projects: [],
    },
  ]);

  // 👉 Chỉ lấy những workspace mà user hiện tại có tham gia
  const joinedWorkspaces = workspaces.filter((ws) =>
    ws.userWorkspaces.some((uw) => uw.userId === currentUserId)
  );

  const getUserRole = (workspace: Workspace) => {
    return (
      workspace.userWorkspaces.find((uw) => uw.userId === currentUserId)?.role ||
      "member"
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      case "management":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "member":
        return "bg-gray-100 text-gray-600 border border-gray-300";
      default:
        return "";
    }
  };

  const handleInviteMember = (workspaceId: number) => {
    if (!inviteEmail.trim()) return;
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.id === workspaceId
          ? {
              ...w,
              userWorkspaces: [
                ...w.userWorkspaces,
                { userId: Date.now(), role: "member" },
              ],
            }
          : w
      )
    );
    setInviteEmail("");
  };

  const handleRemoveMember = (workspaceId: number, userId: number) => {
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.id === workspaceId
          ? {
              ...w,
              userWorkspaces: w.userWorkspaces.filter((u) => u.userId !== userId),
            }
          : w
      )
    );
  };

  const handleChangeRole = (
    workspaceId: number,
    userId: number,
    newRole: "owner" | "management" | "member"
  ) => {
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.id === workspaceId
          ? {
              ...w,
              userWorkspaces: w.userWorkspaces.map((u) =>
                u.userId === userId ? { ...u, role: newRole } : u
              ),
            }
          : w
      )
    );
  };

  const handleDeleteWorkspace = (workspaceId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa workspace này?")) return;
    setWorkspaces(workspaces.filter((w) => w.id !== workspaceId));
    setView("list");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-6xl mx-auto px-6 py-8 font-sans">
        {/* Danh sách workspace */}
        {view === "list" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Workspaces của bạn
            </h2>
            {joinedWorkspaces.length === 0 ? (
              <p className="text-gray-500">
                Bạn chưa tham gia workspace nào. Hãy tạo hoặc được mời vào nhóm.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedWorkspaces.map((workspace) => {
                  const role = getUserRole(workspace);
                  return (
                    <div
                      key={workspace.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {workspace.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {workspace.description}
                        </p>
                        <span
                          className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            role
                          )}`}
                        >
                          {role.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setSelectedWorkspace(workspace);
                            setView("detail");
                          }}
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                        >
                          Quản lý
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Detail Workspace */}
        {view === "detail" && selectedWorkspace && (
          <div className="bg-white p-6 rounded-2xl shadow max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Thành viên trong <span className="text-blue-600">{selectedWorkspace.name}</span>
              </h2>
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
            </div>

            {/* Form Invite: Owner & Management được thêm */}
            {(getUserRole(selectedWorkspace) === "owner" ||
              getUserRole(selectedWorkspace) === "management") && (
              <div className="mb-6 flex gap-3">
                <input
                  type="email"
                  placeholder="Nhập email để mời..."
                  className="flex-1 border px-3 py-2 rounded-lg text-sm"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button
                  onClick={() => handleInviteMember(selectedWorkspace.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                >
                  <Plus className="w-4 h-4 inline" /> Mời
                </button>
              </div>
            )}

            <ul className="divide-y divide-gray-200">
              {selectedWorkspace.userWorkspaces.map((member) => {
                const currentRole = getUserRole(selectedWorkspace);
                return (
                  <li
                    key={member.userId}
                    className="flex justify-between items-center py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        User {member.userId}
                      </p>
                      <span
                        className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                          member.role
                        )}`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      {/* Owner có quyền đổi role */}
                      {currentRole === "owner" &&
                        member.userId !== selectedWorkspace.ownerId && (
                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleChangeRole(
                                selectedWorkspace.id,
                                member.userId,
                                e.target.value as
                                  | "owner"
                                  | "management"
                                  | "member"
                              )
                            }
                            className="border rounded-lg p-1 text-sm"
                          >
                            <option value="management">Management</option>
                            <option value="member">Member</option>
                          </select>
                        )}

                      {/* Owner & Management được xóa member (trừ owner) */}
                      {(currentRole === "owner" ||
                        currentRole === "management") &&
                        member.role !== "owner" && (
                          <button
                            onClick={() =>
                              handleRemoveMember(
                                selectedWorkspace.id,
                                member.userId
                              )
                            }
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {getUserRole(selectedWorkspace) === "owner" && (
              <div className="mt-6 text-right">
                <button
                  onClick={() => handleDeleteWorkspace(selectedWorkspace.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
                >
                  <Trash2 className="w-4 h-4 inline" /> Xóa Workspace
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
