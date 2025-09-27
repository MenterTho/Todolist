"use client";
import { FaUsers, FaSignal, FaHeartbeat, FaExclamationTriangle, FaUserPlus, FaFileExport } from "react-icons/fa";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Users" value="1,248" icon={<FaUsers className="text-indigo-500 text-3xl" />} />
        <Card title="Active Sessions" value="342" icon={<FaSignal className="text-green-500 text-3xl" />} />
        <Card title="System Health" value="98%" icon={<FaHeartbeat className="text-red-500 text-3xl" />} />
        <Card title="Recent Alerts" value="5" icon={<FaExclamationTriangle className="text-yellow-500 text-3xl" />} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Chart */}
          <section className="bg-white shadow rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Activity Overview</h3>
              <select className="bg-gray-100 border rounded px-2 py-1">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-40 flex items-center justify-center text-gray-400">
              [Activity Chart Placeholder]
            </div>
          </section>

          {/* Recent Actions */}
          <section className="bg-white shadow rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Recent Actions</h3>
              <button className="text-indigo-500">View All</button>
            </div>
            <div className="space-y-3">
              <ActionItem icon={<FaUserPlus className="text-indigo-500" />} text="New user registered" time="2 minutes ago" />
              <ActionItem icon={<FaFileExport className="text-green-500" />} text="Document uploaded" time="15 minutes ago" />
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* System Status */}
          <section className="bg-white shadow rounded-xl p-4">
            <h3 className="font-semibold mb-4">System Status</h3>
            <StatusItem label="Server Uptime" value="99.9%" valueClass="text-green-600" />
            <StatusItem label="CPU Usage" value="32%" />
            <StatusItem label="Memory Usage" value="45%" />
          </section>

          {/* Quick Actions */}
          <section className="bg-white shadow rounded-xl p-4 space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg py-2">
              <FaUserPlus />
              <span>Add User</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-400 text-white rounded-lg py-2">
              <FaFileExport />
              <span>Export Data</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex justify-between items-center">
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-500">{title}</div>
      </div>
      {icon}
    </div>
  );
}

function ActionItem({ icon, text, time }: { icon: React.ReactNode; text: string; time: string }) {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <div>{text}</div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
  );
}

function StatusItem({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
