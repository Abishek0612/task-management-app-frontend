export interface User {
  id: string;
  name: string;
  email: string;
  preferences?: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    taskView: string;
  };
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

export interface UpdateTaskData extends Partial<CreateTaskData> {
  _id: string;
}

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

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
