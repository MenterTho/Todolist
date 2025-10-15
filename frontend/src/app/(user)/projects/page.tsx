"use client";
import { useState } from "react";
import { useUserProjects, useProjectMutations } from "@/hooks/useProject.hook";
import { Project } from "@/types/project.type";
import { Loader2, Edit, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import EditProjectModal from "@/components/popup/editProjectModal"; 

export default function ProjectPage() {
  const { data: projects, isLoading, isError } = useUserProjects();
const { deleteProject, updateProject } = useProjectMutations();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
      <Loader2 className="animate-spin mr-2" /> Đang tải danh sách dự án...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Lỗi khi tải dữ liệu. Vui lòng thử lại sau.
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Chưa có dự án nào được tạo.
      </div>
    );
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa dự án này không?")) {
      deleteProject(id);
    }
  };

  const handleSave = (updated: Partial<Project>) => {
  if (!selectedProject) return;

  updateProject(
    {
      projectId: selectedProject.id,
      data: {
        name: updated.name || selectedProject.name,
        description: updated.description || selectedProject.description,
      },
    },
    {
      onSuccess: () => {
        toast.success(`Cập nhật dự án "${updated.name}" thành công!`);
        setIsModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Cập nhật dự án thất bại!");
      },
    }
  );
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dự án của bạn</h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý và theo dõi tất cả dự án trong workspace của bạn
          </p>
        </div>
        <button
          onClick={() => toast("Chức năng tạo mới đang phát triển")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl shadow transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Project mới
        </button>
      </div>

      {/* Danh sách dự án */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {project.name}
                </h2>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {project.description || "Chưa có mô tả."}
              </p>
            </div>

            <div className="flex justify-between items-center border-t pt-3 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5V4H2v16h5m10 0a2 2 0 11-4 0m4 0H9"
                  />
                </svg>
                <span>{project.workspace?.userWorkspaces?.length ?? 0} thành viên</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toast(`Xem chi tiết: ${project.name}`)}
                  className="text-indigo-600 hover:text-indigo-800 transition-all"
                  title="Xem chi tiết"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="text-blue-500 hover:text-blue-700 transition-all"
                  title="Chỉnh sửa"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500 hover:text-red-700 transition-all"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
