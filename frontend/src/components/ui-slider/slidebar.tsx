"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-gradient-to-b from-indigo-400 via-indigo-300 to-indigo-200 rounded-r-2xl pt-20 shadow-md">
      <nav className="flex flex-col flex-1 px-4 gap-3 text-gray-800">
        {[
          { href: "/dashboard", icon: "/images/dashboard/dashboard.png", label: "Dashboard" },
          { href: "/workspace", icon: "/images/dashboard/workspace.png", label: "Workspace" },
          { href: "/projects", icon: "/images/dashboard/projects.png", label: "Projects" },
          { href: "/tasks", icon: "/images/dashboard/tasks.png", label: "Tasks" }
        ].map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center px-4 py-2 hover:bg-white hover:bg-opacity-60 rounded-xl transition"
          >
            <img src={icon} alt={label} className="h-10 w-10" />
            <span className="ml-3 font-sans font-bold text-gray-900">
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
