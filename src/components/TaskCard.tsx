"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Flag,
  MoreVertical,
} from "lucide-react";
import { Task } from "@/types";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  viewMode?: "list" | "grid";
}

export default function TaskCard({
  task,
  onEdit,
  viewMode = "grid",
}: TaskCardProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleStatusToggle = async () => {
    const newStatus = task.status === "pending" ? "done" : "pending";
    updateTask.mutate({
      id: task._id,
      data: { status: newStatus },
    });
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      try {
        await deleteTask.mutateAsync(task._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const priorityConfig = {
    low: { color: "bg-green-100 text-green-800 border-green-200" },
    medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    high: { color: "bg-orange-100 text-orange-800 border-orange-200" },
    urgent: { color: "bg-red-100 text-red-800 border-red-200" },
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status === "pending";
  const isDueSoon =
    task.dueDate &&
    new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) &&
    task.status === "pending";

  if (viewMode === "list") {
    return (
      <div
        className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all duration-200 ${
          task.status === "done" ? "opacity-75" : ""
        } ${isOverdue ? "border-red-300 bg-red-50" : "border-gray-200"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <button
              onClick={handleStatusToggle}
              disabled={updateTask.isPending}
              className="flex-shrink-0"
            >
              {task.status === "done" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <h3
                  className={`font-medium text-gray-900 truncate ${
                    task.status === "done" ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </h3>

                {task.priority && (
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      priorityConfig[task.priority].color
                    }`}
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    {task.priority}
                  </div>
                )}

                {task.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {task.category}
                  </span>
                )}
              </div>

              {task.description && (
                <p className="mt-1 text-sm text-gray-600 truncate">
                  {task.description}
                </p>
              )}

              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(task.createdAt).toLocaleDateString()}
                </div>

                {task.dueDate && (
                  <div
                    className={`flex items-center ${
                      isOverdue
                        ? "text-red-600"
                        : isDueSoon
                        ? "text-yellow-600"
                        : ""
                    }`}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}

                {task.completedAt && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {new Date(task.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border p-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${
        task.status === "done" ? "opacity-75" : ""
      } ${isOverdue ? "border-red-300 bg-red-50" : "border-gray-200"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStatusToggle}
            disabled={updateTask.isPending}
            className="flex-shrink-0"
          >
            {task.status === "done" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
            )}
          </button>

          {task.priority && (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                priorityConfig[task.priority].color
              }`}
            >
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border z-10">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Edit3 className="h-3 w-3 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                disabled={isDeleting}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3
          className={`font-semibold text-gray-900 mb-2 ${
            task.status === "done" ? "line-through" : ""
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {task.category && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {task.category}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>

        {task.dueDate && (
          <div
            className={`flex items-center ${
              isOverdue ? "text-red-600" : isDueSoon ? "text-yellow-600" : ""
            }`}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
