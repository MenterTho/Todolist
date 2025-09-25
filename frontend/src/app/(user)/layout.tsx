"use client"
import { ReactNode, useEffect } from "react"
import Navbar from "@/components/ui-navbar/navbar"
import Sidebar from "@/components/ui-slider/slidebar"
export default function UserLayout({ children }: { children: ReactNode }) {
  // Sử dụng useEffect để cuộn lên đầu khi trang được tải
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, []) 

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Sidebar/>
      {/* Nội dung chính */}
      <main className="flex-1 bg-[#1d1e20] dark:bg-[#0e1116] duration-300 ease-in-out">
        {children}
      </main>
    </div>
  )
}