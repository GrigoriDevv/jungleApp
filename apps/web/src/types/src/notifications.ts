import { User } from './user';
import { Task } from './task';

export type NotificationType = 
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'COMMENT_ADDED'
  | 'TASK_ASSIGNED'
  | 'STATUS_CHANGED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  user?: User;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface TaskNotificationPayload {
  task: Task;
  notification: {
    title: string;
    message: string;
  };
  userId?: string;
}

export interface CommentNotificationPayload {
  task: Task;
  comment: Comment;
  notification: {
    title: string;
    message: string;
  };
}