import axios from "axios";
import {
  AuthResponse,
  LoginData,
  RegisterData,
  TasksResponse,
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskStats,
} from "@/types";
import { cookies } from "./cookies";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      config.url,
      config.params
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(
      "API Response:",
      response.config.url,
      response.status,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data,
      error.config?.url
    );
    if (error.response?.status === 401) {
      cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const tasksApi = {
  getTasks: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<TasksResponse> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    console.log("Getting tasks with params:", cleanParams);
    const response = await api.get("/tasks", { params: cleanParams });
    return response.data;
  },

  getTask: async (id: string): Promise<{ task: Task }> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (
    data: CreateTaskData
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  updateTask: async (
    id: string,
    data: Partial<UpdateTaskData>
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  getStats: async (): Promise<TaskStats> => {
    const response = await api.get("/tasks/stats");
    return response.data;
  },
};

export default api;
