"use client";

import { useState, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import TaskStats from "@/components/TaskStats";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const debouncedSearch = useDebounce(searchTerm, 300);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: 12,
      search: debouncedSearch,
      status: statusFilter === "all" ? "" : statusFilter,
      sortBy,
      sortOrder,
    }),
    [currentPage, debouncedSearch, statusFilter, sortBy, sortOrder]
  );

  const { data: tasksData, isLoading, error, refetch } = useTasks(queryParams);

  console.log("Tasks data:", tasksData);
  console.log("Tasks error:", error);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split("-");
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <TaskStats />

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
                    Tasks
                  </h2>

                  <button
                    onClick={handleCreateTask}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={handleSortChange}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="title-asc">Title A-Z</option>
                      <option value="title-desc">Title Z-A</option>
                      <option value="updatedAt-desc">Recently Updated</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-200 rounded-lg h-32 animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">
                      {error instanceof Error
                        ? error.message
                        : "Error loading tasks. Please try again."}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : !tasksData?.tasks?.length ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== "all"
                        ? "No tasks found matching your criteria."
                        : "No tasks yet. Create your first task to get started!"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tasksData.tasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleEditTask}
                        />
                      ))}
                    </div>

                    {tasksData.pagination?.totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing{" "}
                          {(currentPage - 1) *
                            (tasksData.pagination?.limit || 12) +
                            1}{" "}
                          to{" "}
                          {Math.min(
                            currentPage * (tasksData.pagination?.limit || 12),
                            tasksData.pagination?.totalTasks || 0
                          )}{" "}
                          of {tasksData.pagination?.totalTasks || 0} results
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!tasksData.pagination?.hasPrevPage}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>

                          {[
                            ...Array(tasksData.pagination?.totalPages || 1),
                          ].map((_, i) => {
                            const page = i + 1;
                            const isCurrentPage = page === currentPage;
                            const totalPages =
                              tasksData.pagination?.totalPages || 1;

                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-2 border rounded-md text-sm font-medium ${
                                    isCurrentPage
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span
                                  key={page}
                                  className="px-3 py-2 text-gray-500"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!tasksData.pagination?.hasNextPage}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        {showTaskForm && (
          <TaskForm task={editingTask} onClose={handleCloseForm} />
        )}
      </div>
    </ProtectedRoute>
  );
}
