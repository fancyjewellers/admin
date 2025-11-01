// types/notification.ts
export interface NotificationPayload {
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  export interface INotificationDevice {
    _id?: string;
    token: string;
    meta?: Record<string, unknown> | null;
    lastUpdated?: string | Date;
  }
  
 
  