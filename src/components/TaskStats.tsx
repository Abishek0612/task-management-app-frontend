"use client";

import { useTaskStats } from "@/hooks/useTasks";

export default function TaskStats() {
  const { data: stats, isLoading, error } = useTaskStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
        <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Completed</h3>
        <p className="text-3xl font-bold text-green-600">
          {stats.completedTasks}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Pending</h3>
        <p className="text-3xl font-bold text-yellow-600">
          {stats.pendingTasks}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
        <p className="text-3xl font-bold text-blue-600">
          {stats.completionRate}%
        </p>
      </div>
    </div>
  );
}
