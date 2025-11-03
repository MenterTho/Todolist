"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", icon: "/images/dashboard/dashboard.png", label: "Dashboard" },
    { href: "/workspace", icon: "/images/dashboard/workspace.png", label: "Workspace" },
    { href: "/projects", icon: "/images/dashboard/projects.png", label: "Projects" },
    { href: "/task", icon: "/images/dashboard/tasks.png", label: "Tasks" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-gradient-to-b from-cyan-500 via-blue-400 to-blue-300 rounded-r-2xl pt-20 shadow-xl backdrop-blur-md border-r border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <nav className="relative flex flex-col flex-1 px-4 gap-2 text-gray-800">
        {links.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-4 py-3 rounded-xl relative font-medium transition-all duration-300 group ${
                active
                  ? "bg-white/80 text-blue-700 shadow-md"
                  : "hover:bg-white/50 hover:text-blue-700 hover:shadow-sm"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 h-full w-[5px] bg-blue-600 rounded-r-lg"
                />
              )}

              <img
                src={icon}
                alt={label}
                className="h-8 w-8 opacity-90 group-hover:scale-110 transition-transform"
              />
              <span className="ml-3 font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 text-xs text-gray-700 text-center border-t border-white/30">
        © 2025 TaskFlow
      </div>
    </aside>
  );
}
