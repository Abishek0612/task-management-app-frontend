import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api";
import { CreateTaskData, UpdateTaskData } from "@/types";
import toast from "react-hot-toast";

export function useTasks(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
) {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => tasksApi.getTasks(params),
    staleTime: 30000,
    retry: (failureCount, error: any) => {
      console.error("Query failed:", error);
      if (error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    onError: (error: any) => {
      console.error("Tasks query error:", error);
      toast.error("Failed to load tasks");
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: ["task-stats"],
    queryFn: () => tasksApi.getStats(),
    staleTime: 60000,
    retry: 2,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => tasksApi.createTask(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      console.error("Create task error:", error);
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateTaskData> }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });

      queryClient.setQueryData(["tasks"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          tasks:
            oldData.tasks?.map((task: any) =>
              task._id === variables.id ? data.task : task
            ) || [],
        };
      });

      toast.success(data.message);
    },
    onError: (error: any) => {
      console.error("Update task error:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });

      queryClient.setQueryData(["tasks"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          tasks: oldData.tasks?.filter((task: any) => task._id !== id) || [],
        };
      });

      toast.success(data.message);
    },
    onError: (error: any) => {
      console.error("Delete task error:", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });
}
