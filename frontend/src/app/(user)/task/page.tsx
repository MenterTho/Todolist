"use client";

import { useState, useMemo, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useTasks, useTaskMutations } from "@/hooks/usetask.hook";
import { useQueryClient } from "@tanstack/react-query";
import TaskModal from "@/components/popup/editTaskModal";
import Loader from "@/components/ui/loader";
import toast from "react-hot-toast";
import { Task } from "@/types/task.type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth.hook";

type Columns = {
  todo: Task[];
  inprogress: Task[];
  done: Task[];
};

export default function TasksPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, isError } = useTasks();
  const { updateTask, deleteTask } = useTaskMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
     1️⃣ Group task theo status
  ========================== */
  const groupedTasks: Columns = useMemo(() => {
    const groups: Columns = {
      todo: [],
      inprogress: [],
      done: [],
    };

    for (const task of tasks) {
      const key =
        task.status === "To Do"
          ? "todo"
          : task.status === "In Progress"
          ? "inprogress"
          : "done";

      groups[key].push(task);
    }

    return groups;
  }, [tasks]);

  /* =========================
     2️⃣ Local state cho Drag & Drop
  ========================== */
  const [localColumns, setLocalColumns] =
    useState<Columns>(groupedTasks);

  // Chỉ sync khi tasks từ server thay đổi
  useEffect(() => {
    setLocalColumns(groupedTasks);
  }, [groupedTasks]);

  /* =========================
     3️⃣ Search (KHÔNG setState)
  ========================== */
  const filteredColumns: Columns = useMemo(() => {
    const cloned = structuredClone(localColumns);

    (Object.keys(cloned) as (keyof Columns)[]).forEach((key) => {
      cloned[key] = cloned[key].filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.project?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    });

    return cloned;
  }, [localColumns, searchTerm]);

  /* =========================
     Quyền quản lý task
  ========================== */
  const canManageTask = (task: Task) =>
    task.creatorId === currentUser?.id ||
    task.assignee?.id === currentUser?.id;

  /* =========================
     4️⃣ Drag & Drop handler
  ========================== */
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId as keyof Columns;
    const destCol = destination.droppableId as keyof Columns;

    if (
      sourceCol === destCol &&
      source.index === destination.index
    )
      return;

    const newColumns = structuredClone(localColumns);
    const [movedTask] = newColumns[sourceCol].splice(source.index, 1);

    const newStatus =
      destCol === "todo"
        ? "To Do"
        : destCol === "inprogress"
        ? "In Progress"
        : "Done";

    newColumns[destCol].splice(destination.index, 0, {
      ...movedTask,
      status: newStatus,
    });

    setLocalColumns(newColumns);

    updateTask(
      { taskId: movedTask.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Moved to ${newStatus}`);
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
          toast.error("Cập nhật thất bại, thử lại sau!");
          setLocalColumns(groupedTasks);
        },
      }
    );
  };

  const columnList = [
    { id: "todo", title: "To Do", color: "bg-slate-50" },
    { id: "inprogress", title: "In Progress", color: "bg-yellow-50" },
    { id: "done", title: "Done", color: "bg-emerald-50" },
  ] as const;

  /* =========================
     Render state
  ========================== */
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500">
        Lỗi khi tải danh sách task. Vui lòng thử lại sau.
      </div>
    );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-800">
          My Tasks
        </h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow"
        >
          <PlusCircle className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tasks or project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none bg-transparent"
        />
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto min-h-[70vh]">
          {columnList.map(({ id, title, color }) => (
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 min-w-[300px] max-w-[400px] rounded-2xl p-4 border ${
                    snapshot.isDraggingOver
                      ? "bg-indigo-100"
                      : color
                  }`}
                >
                  <div className="flex justify-between mb-4">
                    <h2 className="font-semibold">{title}</h2>
                    <span className="text-xs bg-white px-2 py-1 rounded">
                      {filteredColumns[id].length}
                    </span>
                  </div>

                  {filteredColumns[id].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() =>
                            router.push(`/task/${task.id}`)
                          }
                          className="bg-white p-4 mb-3 rounded-xl shadow cursor-pointer relative"
                        >
                          <h3 className="font-medium">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Project:{" "}
                            {task.project?.name || "N/A"}
                          </p>

                          {canManageTask(task) && (
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTask(task);
                                  setIsModalOpen(true);
                                }}
                                className="text-blue-500"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    confirm(
                                      "Bạn có chắc muốn xóa task?"
                                    )
                                  ) {
                                    deleteTask(task.id, {
                                      onSuccess: () =>
                                        toast.success(
                                          "Xóa task thành công!"
                                        ),
                                      onError: () =>
                                        toast.error(
                                          "Xóa task thất bại!"
                                        ),
                                    });
                                  }
                                }}
                                className="text-red-500"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {isModalOpen && (
        <TaskModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          tasks={tasks}
          task={selectedTask || undefined}
        />
      )}
    </div>
  );
}
