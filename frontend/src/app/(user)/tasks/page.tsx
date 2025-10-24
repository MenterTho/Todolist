"use client";

import { useState, useMemo, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useTasks, useTaskMutations } from "@/hooks/usetask.hook";
import { useQueryClient } from "@tanstack/react-query";
import TaskModal from "@/components/popup/editTaskModal";
import Loader from "@/components/ui/loader";
import toast from "react-hot-toast";
import { Task } from "@/types/task.type";

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: tasks = [], isLoading, isError } = useTasks();
  const { updateTask } = useTaskMutations();
  const queryClient = useQueryClient();

  // Gom task theo status
  const grouped = useMemo(() => {
    const groups = { todo: [] as Task[], inprogress: [] as Task[], done: [] as Task[] };
    tasks.forEach((task) => {
      const key =
        task.status === "To Do"
          ? "todo"
          : task.status === "In Progress"
          ? "inprogress"
          : "done";
      if (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        groups[key].push(task);
      }
    });
    return groups;
  }, [tasks, searchTerm]);

  const [localColumns, setLocalColumns] = useState(grouped);

  // Đồng bộ khi server thay đổi
  useEffect(() => {
    const isDifferent = JSON.stringify(localColumns) !== JSON.stringify(grouped);
    if (isDifferent) setLocalColumns(grouped);
  }, [grouped]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId as keyof typeof localColumns;
    const destCol = destination.droppableId as keyof typeof localColumns;
    if (sourceCol === destCol && source.index === destination.index) return;

    const newColumns = structuredClone(localColumns);
    const [moved] = newColumns[sourceCol].splice(source.index, 1);

    const newStatus =
      destCol === "todo" ? "To Do" : destCol === "inprogress" ? "In Progress" : "Done";

    newColumns[destCol].splice(destination.index, 0, { ...moved, status: newStatus });
    setLocalColumns(newColumns);

    updateTask(
      { taskId: moved.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Moved to ${newStatus}`);
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
          toast.error("Cập nhật thất bại, thử lại sau!");
          setLocalColumns(grouped);
        },
      }
    );
  };

  const columnList = [
    { id: "todo", title: "To Do", color: "bg-slate-50" },
    { id: "inprogress", title: "In Progress", color: "bg-yellow-50" },
    { id: "done", title: "Done", color: "bg-emerald-50" },
  ] as const;

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
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tasks or project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none bg-transparent text-gray-700"
        />
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[70vh]">
          {columnList.map(({ id, title, color }) => (
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 min-w-[300px] max-w-[400px] rounded-2xl border border-gray-100 p-4 transition-all duration-200 ${
                    snapshot.isDraggingOver ? "bg-indigo-100" : color
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg shadow-sm">
                      {localColumns[id].length}
                    </span>
                  </div>

                  {localColumns[id].map((task, index) => (
                    <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-transform ${
                            snapshot.isDragging ? "scale-[1.03]" : ""
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: "10px",
                          }}
                        >
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Status:{" "}
                            <span
                              className={`font-medium ${
                                task.status === "Done"
                                  ? "text-emerald-600"
                                  : task.status === "In Progress"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {task.status}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Project: {task.project?.name || "N/A"}
                          </p>
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
      {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
