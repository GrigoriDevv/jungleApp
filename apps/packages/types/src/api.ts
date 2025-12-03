export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
  }
  
  export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
  
  export interface ApiError {
    message: string;
    statusCode: number;
    error: string;
    timestamp: string;
    path: string;
  }
  
  export interface ValidationError {
    field: string;
    message: string;
  }