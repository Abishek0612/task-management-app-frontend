import axios from "axios";
import {
  AuthResponse,
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  TasksResponse,
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskStats,
} from "@/types";
import { cookies } from "./cookies";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

console.log("API_BASE_URL:", API_BASE_URL);
console.log("Raw env var:", process.env.NEXT_PUBLIC_API_URL);
console.log("Final API_BASE_URL:", API_BASE_URL);
console.log("All env vars:", process.env);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const baseURL = config.baseURL || "";
    const url = config.url || "";
    console.log("Making request to:", baseURL + url);

    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.config?.url,
      error.response?.status || error.message
    );
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/logout") &&
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login")
    ) {
      cookies.remove("token");
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

  forgotPassword: async (
    data: ForgotPasswordData
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<AuthResponse> => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (
    data: Partial<{ name: string; preferences: object; avatar: string }>
  ) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

export const tasksApi = {
  getTasks: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<TasksResponse> => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== "" && value !== undefined
      )
    );

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
