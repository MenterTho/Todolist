"use client";

import { useState, useMemo } from "react";
import { PlusCircle, Search } from "lucide-react";
import TaskModal from "@/components/popup/editTaskModal";
import { useTasksByProject } from "@/hooks/usetask.hook";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Task } from "@/types/task.type";

export default function TasksPage() {
  const projectId = 1; // 👉 tạm thời hardcode (sau có thể lấy từ useParams hoặc Redux)
  const { data: tasks = [], isLoading } = useTasksByProject(projectId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Gom nhóm task theo status
  const columns = useMemo(() => {
    const grouped = {
      todo: [] as Task[],
      inprogress: [] as Task[],
      done: [] as Task[],
    };
    tasks.forEach((task) => {
      const key = task.status.toLowerCase().replace(" ", "") as keyof typeof grouped;
      if (grouped[key]) grouped[key].push(task);
    });
    return grouped;
  }, [tasks]);

  // 👉 xử lý kéo thả (nếu cần sau này update API)
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
  };

  const columnList = [
    { id: "todo", title: "To Do", color: "bg-gray-50" },
    { id: "inprogress", title: "In Progress", color: "bg-yellow-50" },
    { id: "done", title: "Done", color: "bg-green-50" },
  ] as const;

  if (isLoading) return <div className="text-center mt-10 text-gray-500">Loading tasks...</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Project Tasks</h1>
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

      {/* Kéo thả tasks */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto min-h-[70vh]">
          {columnList.map(({ id, title, color }) => (
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 min-w-[300px] rounded-2xl shadow-md p-4 transition-all relative ${
                    snapshot.isDraggingOver ? "bg-indigo-100" : color
                  }`}
                  style={{ minHeight: "70vh" }}
                >
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
                    {title}
                  </h2>

                  {columns[id].map((task, index) => (
                    <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
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
                            userSelect: "none",
                            marginBottom: "10px",
                          }}
                        >
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{task.status}</p>
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

      {/* Popup Modal */}
      {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
