// Auth
export * from "./auth";
export * from "./user";

// Tasks
export * from "./task";

// Notifications
export * from "./notifications";

// API
export * from "./api";

// WebSocket
export * from "./web-socket";

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
