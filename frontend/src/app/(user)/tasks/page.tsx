"use client";

import { useState, useMemo, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import TaskModal from "@/components/popup/editTaskModal";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useTasks, useTaskMutations } from "@/hooks/usetask.hook";
import Loader from "@/components/ui/loader";
import { Task } from "@/types/task.type";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tasks = [], isLoading, isError } = useTasks();
  const { updateTask } = useTaskMutations();
  const queryClient = useQueryClient();

  const grouped = useMemo(() => {
    const groups = { todo: [] as Task[], inprogress: [] as Task[], done: [] as Task[] };
    tasks.forEach((task) => {
      const key =
        task.status === "To Do"
          ? "todo"
          : task.status === "In Progress"
          ? "inprogress"
          : "done";
      groups[key].push(task);
    });
    return groups;
  }, [tasks]);

  //Local state để UI cập nhật ngay
  const [localColumns, setLocalColumns] = useState(grouped);

  // Khi dữ liệu từ server thay đổi đồng bộ lại local
  useEffect(() => {
    setLocalColumns(grouped);
  }, [grouped]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId as keyof typeof localColumns;
    const destCol = destination.droppableId as keyof typeof localColumns;

    if (sourceCol === destCol && source.index === destination.index) return;

    // Clone dữ liệu
    const newColumns = {
      todo: Array.from(localColumns.todo),
      inprogress: Array.from(localColumns.inprogress),
      done: Array.from(localColumns.done),
    };

    // Lấy task bị kéo
    const [moved] = newColumns[sourceCol].splice(source.index, 1);

    // Xác định status mới
    const newStatus =
      destCol === "todo"
        ? "To Do"
        : destCol === "inprogress"
        ? "In Progress"
        : "Done";

    // Cập nhật UI trước
    newColumns[destCol].splice(destination.index, 0, { ...moved, status: newStatus });
    setLocalColumns(newColumns);

    // Gọi API cập nhật backend
    updateTask(
      { taskId: moved.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Moved to ${newStatus}`);
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
          toast.error("Không thể cập nhật trạng thái");
          setLocalColumns(grouped);
        },
      }
    );
  };

  const columnList = [
    { id: "todo", title: "To Do", color: "bg-gray-50" },
    { id: "inprogress", title: "In Progress", color: "bg-yellow-50" },
    { id: "done", title: "Done", color: "bg-green-50" },
  ] as const;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader />
      </div>
    );

  if (isError)
    return <div className="text-center text-red-500">Lỗi khi tải danh sách task.</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <PlusCircle className="w-5 h-5" />
          Create Task
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full outline-none bg-transparent"
        />
      </div>

      {/* Kéo thả task */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto min-h-[70vh]">
          {columnList.map(({ id, title, color }) => (
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 min-w-[300px] rounded-2xl shadow-md p-4 transition-all ${
                    snapshot.isDraggingOver ? "bg-indigo-100" : color
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
                    {title}
                  </h2>

                  {localColumns[id].map((task, index) => (
                    <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-grab ${
                            snapshot.isDragging ? "rotate-1 scale-[1.03]" : ""
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: "10px",
                          }}
                        >
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{task.status}</p>
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
