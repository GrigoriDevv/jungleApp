// Auth
export * from "./src/auth";
export * from "./src/user";

// Tasks
export * from "./src/task";

// Notifications
export * from "./src/notifications";

// API
export * from "./src/api";

// WebSocket
export * from "./src/web-socket";

// Common
export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface FilterParams {
  status?: string;
  priority?: string;
  assignedTo?: string;
  createdBy?: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
};
