"use client";

import { useState, useMemo } from "react";
import { Task, CreateTaskRequest } from "@/types/task.type";
import { useTaskMutations } from "@/hooks/usetask.hook";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface TaskModalProps {
  onClose: () => void;
  tasks: Task[];
  task?: Task;
}

export default function TaskModal({ onClose, tasks }: TaskModalProps) {
  const { createTask } = useTaskMutations();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("To Do");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [projectId, setProjectId] = useState<number>();
  const [assigneeId, setAssigneeId] = useState<number>();

  //  project 
  const projects = useMemo(() => {
    const map = new Map<number, Task["project"]>();
    tasks.forEach((t) => t.project && !map.has(t.project.id) && map.set(t.project.id, t.project));
    return Array.from(map.values());
  }, [tasks]);

  //  assignee 
  const users = useMemo(() => {
    const map = new Map<number, NonNullable<Task["assignee"]>>();
    tasks.forEach((t) => t.assignee && !map.has(t.assignee.id) && map.set(t.assignee.id, t.assignee));
    return Array.from(map.values());
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return toast.error("Vui lòng chọn Project");

    const payload: CreateTaskRequest = {
      title,
      description,
      status,
      priority,
      projectId,
      assigneeId,
    };

    createTask(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Task</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="border rounded-lg p-2"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            rows={3}
            className="border rounded-lg p-2"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
            className="border rounded-lg p-2"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            className="border rounded-lg p-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={projectId}
            onChange={(e) => setProjectId(Number(e.target.value))}
            className="border rounded-lg p-2"
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(Number(e.target.value))}
            className="border rounded-lg p-2"
          >
            <option value="">Select Assignee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
          >
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}
