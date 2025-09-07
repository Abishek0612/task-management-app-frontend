export interface User {
  id: string;
  name: string;
  email: string;
  preferences?: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
    };
    taskView: "list" | "grid" | "kanban";
  };
  avatar?: string;
  lastLogin?: string;
  isEmailVerified?: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  tags?: string[];
  dueDate?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: "pending" | "done";
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  tags?: string[];
  dueDate?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
