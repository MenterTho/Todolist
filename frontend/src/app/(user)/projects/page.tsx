"use client";
import { useUserProjects } from "@/hooks/useProject.hook";
import { Project } from "@/types/project.type";

export default function ProjectPage() {
  const { data: projects, isLoading, isError } = useUserProjects();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Đang tải danh sách dự án...
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý và theo dõi tất cả dự án trong workspace của bạn
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl shadow transition-all">
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
            className="bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-200 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{project.name}</h2>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  Active
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {project.description || "Chưa có mô tả."}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-3 border-t border-indigo-50">
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
              <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
