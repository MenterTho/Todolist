"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaProjectDiagram,
  FaTasks,
  FaBuilding,
  FaFireAlt,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkspaces: 0,
    totalProjects: 0,
    totalTasks: 0,
  });

  const [chartData, setChartData] = useState<
    { name: string; tasks: number; projects: number }[]
  >([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStats({
        totalUsers: 1258,
        totalWorkspaces: 12,
        totalProjects: 37,
        totalTasks: 245,
      });

      setChartData([
        { name: "T1", tasks: 120, projects: 10 },
        { name: "T2", tasks: 200, projects: 15 },
        { name: "T3", tasks: 170, projects: 12 },
        { name: "T4", tasks: 250, projects: 18 },
        { name: "T5", tasks: 300, projects: 20 },
        { name: "T6", tasks: 280, projects: 22 },
      ]);
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome Back 👋
        </h1>
        <span className="text-gray-500 text-sm">
          Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers className="text-sky-500 text-3xl" />}
        />
        <StatCard
          title="Workspaces"
          value={stats.totalWorkspaces}
          icon={<FaBuilding className="text-teal-500 text-3xl" />}
        />
        <StatCard
          title="Projects"
          value={stats.totalProjects}
          icon={<FaProjectDiagram className="text-emerald-500 text-3xl" />}
        />
        <StatCard
          title="Tasks"
          value={stats.totalTasks}
          icon={<FaTasks className="text-blue-500 text-3xl" />}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 bg-white shadow rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4 text-gray-700">
            Activity Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-white shadow rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4 text-gray-700">Top Projects</h3>
          <div className="space-y-4">
            <TopProject name="Redesign Website" progress={85} />
            <TopProject name="Mobile App Launch" progress={70} />
            <TopProject name="Marketing Campaign" progress={60} />
          </div>
        </motion.section>
      </div>

      {/* Performance Overview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-gradient-to-r from-teal-400 via-sky-400 to-blue-500 rounded-xl text-white p-6 shadow"
      >
        <div className="flex items-center space-x-4 mb-4">
          <FaFireAlt className="text-4xl animate-bounce" />
          <div>
            <h3 className="text-lg font-semibold">Performance Overview</h3>
            <p className="text-sm opacity-80">
              Tình hình hoạt động trong tháng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <PerformanceItem label="Completion Rate" value="92%" />
          <PerformanceItem label="On-Time Tasks" value="88%" />
          <PerformanceItem label="Avg. Response" value="1.3h" />
          <PerformanceItem label="New Members" value="+24" />
        </div>
      </motion.section>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow rounded-xl p-5 flex justify-between items-center hover:shadow-md transition-all duration-300"
    >
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-gray-500">{title}</div>
      </div>
      {icon}
    </motion.div>
  );
}

function TopProject({ name, progress }: { name: string; progress: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1 text-sm font-medium text-gray-600">
        <span>{name}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
          className="bg-sky-500 h-2 rounded-full"
        />
      </div>
    </div>
  );
}

function PerformanceItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-lg">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}
