"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-indigo-700 rounded-r-2xl pt-24">
      <nav className="flex flex-col flex-1 px-4 gap-3 text-gray-100">
        <Link
          href="/dashboard"
          className="flex items-center px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition"
        >
          <img src="/images/dashboard/dashboard.png" alt="" className="h-14 w-14" /><span className="ml-3 font-sans font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300">Dashboard</span>
        </Link>

        <Link
          href="/workspace"
          className="flex items-center px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition"
        >
          <img src="/images/dashboard/workspace.png" alt="" className="h-14 w-14" /><span className="ml-3 font-sans font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300">Workspace</span>
        </Link>

        <Link
          href="/projects"
          className="flex items-center px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition"
        >
          <img src="/images/dashboard/projects.png" alt="" className="h-14 w-14" /><span className="ml-3 font-sans font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300">Projects</span>
        </Link>

        <Link
          href="/tasks"
          className="flex items-center px-4 py-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition"
        >
          <img src="/images/dashboard/tasks.png" alt="" className="h-14 w-14" /><span className="ml-3 font-sans font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-300">Tasks</span>
        </Link>
      </nav>
    </div>
  );
}
