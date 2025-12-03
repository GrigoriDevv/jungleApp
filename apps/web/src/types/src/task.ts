import { User } from './user';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface BaseTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task extends BaseTask {
  createdBy: User;
  assignedUsers: User[];
  comments: Comment[];
  history: TaskHistory[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  status?: TaskStatus;
  deadline?: string;
  assignedUserIds?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  deadline?: string | null;
  assignedUserIds?: string[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  changedBy: User;
  changeType: string;
  oldData: Record<string, any>;
  newData: Record<string, any>;
  createdAt: string;
}