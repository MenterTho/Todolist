"use client";
import { ReactNode, useEffect } from "react";
import Navbar from "@/components/ui-navbar/navbar";
import Sidebar from "@/components/ui-slider/slidebar";

export default function UserLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar cố định */}
      <Navbar />

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
