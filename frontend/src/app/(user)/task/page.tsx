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
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth.hook";

export default function TasksPage() {
const { user: currentUser } = useAuth();
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState<Task | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const { data: tasks = [], isLoading, isError } = useTasks();
const { updateTask, deleteTask } = useTaskMutations();
const queryClient = useQueryClient();
const router = useRouter();

// Gom task theo status
const grouped = useMemo(() => {
const groups = { todo: [] as Task[], inprogress: [] as Task[], done: [] as Task[] };
for (const task of tasks) {
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
}
return groups;
}, [tasks, searchTerm]);

const [localColumns, setLocalColumns] = useState(grouped);
useEffect(() => setLocalColumns(grouped), [tasks, searchTerm]);

// Quyền quản lý task (creator hoặc assignee có quyền)
const canManageTask = (task: Task) => {
return task.creatorId === currentUser?.id || task.assignee?.id === currentUser?.id;
};

// Drag & Drop
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
return ( <div className="flex justify-center items-center h-[70vh]"> <Loader /> </div>
);

if (isError)
return ( <div className="text-center text-red-500">
Lỗi khi tải danh sách task. Vui lòng thử lại sau. </div>
);

return ( <div className="flex flex-col gap-6 p-4 md:p-6">
{/* Header */} <div className="flex flex-col md:flex-row justify-between md:items-center gap-3"> <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
<button
onClick={() => {
setSelectedTask(null);
setIsModalOpen(true);
}}
className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow transition-all"
> <PlusCircle className="w-5 h-5" />
New Task </button> </div>

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
                      onClick={() => router.push(`/task/${task.id}`)}
                      className="relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-transform cursor-pointer"
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: "10px",
                        transform: snapshot.isDragging
                          ? `${provided.draggableProps.style?.transform} scale(1.03)`
                          : provided.draggableProps.style?.transform,
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

                      {/* Edit/Delete Buttons */}
                      {canManageTask(task) && (
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Bạn có chắc muốn xóa task này?")) {
                                deleteTask(task.id, {
                                  onSuccess: () => toast.success("Xóa task thành công!"),
                                  onError: () => toast.error("Xóa task thất bại!"),
                                });
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
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

  {/* Modal Create/Edit Task */}
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
