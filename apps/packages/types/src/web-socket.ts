import { Task, Comment, Notification } from './index';

export interface WebSocketEvents {
  // Eventos enviados pelo cliente
  'auth:identify': { userId: string; accessToken: string };
  'notification:mark-read': { notificationId: string };
  
  // Eventos recebidos pelo cliente
  'task:created': { task: Task; notification?: any };
  'task:updated': { task: Task; notification?: any };
  'task:deleted': { taskId: string; notification?: any };
  'comment:new': { task: Task; comment: Comment; notification?: any };
  'notification:new': { notification: Notification };
  'auth:invalid': { reason: string };
  'connection:established': { message: string };
}