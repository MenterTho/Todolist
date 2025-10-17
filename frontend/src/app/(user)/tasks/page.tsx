"use client";

import { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import TaskModal from "@/components/popup/editTaskModal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type Task = {
  id: string;
  title: string;
  status: "todo" | "inprogress" | "done";
};

type Columns = {
  todo: Task[];
  inprogress: Task[];
  done: Task[];
};

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [columns, setColumns] = useState<Columns>({
    todo: [
      { id: "1", title: "Design dashboard UI", status: "todo" },
      { id: "2", title: "Write API docs", status: "todo" },
    ],
    inprogress: [{ id: "3", title: "Fix login bug", status: "inprogress" }],
    done: [{ id: "4", title: "Test notification API", status: "done" }],
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId as keyof Columns;
    const destCol = destination.droppableId as keyof Columns;

    // Không thay đổi vị trí
    if (sourceCol === destCol && source.index === destination.index) return;

    const sourceTasks = Array.from(columns[sourceCol]);
    const destTasks = Array.from(columns[destCol]);
    const [moved] = sourceTasks.splice(source.index, 1);

    if (sourceCol === destCol) {
      sourceTasks.splice(destination.index, 0, moved);
      setColumns((prev) => ({ ...prev, [sourceCol]: sourceTasks }));
    } else {
      destTasks.splice(destination.index, 0, { ...moved, status: destCol });
      setColumns((prev) => ({
        ...prev,
        [sourceCol]: sourceTasks,
        [destCol]: destTasks,
      }));
    }
  };

  const columnList = [
    { id: "todo", title: "To Do", color: "bg-gray-50" },
    { id: "inprogress", title: "In Progress", color: "bg-yellow-50" },
    { id: "done", title: "Done", color: "bg-green-50" },
  ] as const;

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
                    <Draggable
                      draggableId={task.id}
                      index={index}
                      key={task.id}
                    >
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
                          <h3 className="font-medium text-gray-800">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 capitalize">
                            {task.status}
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

      {/* Popup Modal */}
      {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
