"use client";

import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Calendar, Flag, Tag, AlignLeft } from "lucide-react";
import { CreateTaskData, Task } from "@/types";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { useEffect, useState } from "react";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

export default function TaskForm({ task, onClose }: TaskFormProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateTaskData>({
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || "",
          status: task.status,
          priority: task.priority || "medium",
          category: task.category || "",
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : "",
        }
      : {
          status: "pending",
          priority: "medium",
        },
  });

  const watchedTitle = watch("title");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority || "medium",
        category: task.category || "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
      setTags(task.tags || []);
    }
  }, [task, reset]);

  const onSubmit = async (data: CreateTaskData) => {
    try {
      const formData = { ...data, tags };

      if (task) {
        await updateTask.mutateAsync({
          id: task._id,
          data: formData,
        });
      } else {
        await createTask.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const priorityOptions = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-orange-600" },
    { value: "urgent", label: "Urgent", color: "text-red-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {task ? "Edit Task" : "Create New Task"}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {task
                  ? "Update your task details"
                  : "Add a new task to your list"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <AlignLeft className="h-4 w-4 mr-2" />
                Task Title
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter a clear, descriptive title"
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <AlignLeft className="h-4 w-4 mr-2" />
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Add any additional details or notes..."
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Flag className="h-4 w-4 mr-2" />
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  {...register("category")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Work, Personal, Shopping"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due Date
                </label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </label>

              {/* Tag Input */}
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTagInput(e.target.value)
                  }
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Tag List */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {tags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {task ? "Update Task" : "Create Task"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
