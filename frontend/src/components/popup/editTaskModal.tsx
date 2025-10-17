"use client";
import { X } from "lucide-react";

export default function TaskModal({ onClose }: { onClose: () => void }) {
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

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task title"
            className="border rounded-lg p-2"
          />
          <textarea
            placeholder="Description..."
            rows={3}
            className="border rounded-lg p-2"
          />
          <select className="border rounded-lg p-2">
            <option value="">Select status</option>
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
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
