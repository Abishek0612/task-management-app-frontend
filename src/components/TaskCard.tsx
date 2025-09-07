"use client";

import { Task } from "@/types";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
        task.status === "done" ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium text-gray-900 ${
              task.status === "done" ? "line-through" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-gray-600 text-sm">{task.description}</p>
          )}

          <div className="mt-2 flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.status === "done"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.status}
            </span>

            {task.priority && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
            )}

            {task.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {task.category}
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Created {new Date(task.createdAt).toLocaleDateString()}
            {task.completedAt && (
              <span>
                {" "}
                • Completed {new Date(task.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="ml-4 flex items-center space-x-2">
          <button
            onClick={handleStatusToggle}
            disabled={updateTask.isPending}
            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
              task.status === "done"
                ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                : "text-white bg-green-600 hover:bg-green-700"
            } disabled:opacity-50`}
          >
            {updateTask.isPending
              ? "Updating..."
              : task.status === "done"
              ? "Undo"
              : "Complete"}
          </button>

          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
