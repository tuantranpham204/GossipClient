import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";

interface NotificationParams {
  page?: number;
  per_page?: number;
}

interface NotificationData {
  id: number;
  user_id: number;
  actor_id: number;
  actor_username: string;
  actor_avatar_url: string | null;
  status: string;
  notification_type: string;
  content: Record<string, any>;
  updated_at: string;
  created_at: string;
}

interface Meta {
  total_pages: number;
  total_count: number;
  current_page: number;
}

interface NotificationResponse {
  data: NotificationData[];
  message: string;
  meta: Meta;
}

export declare const useNotifications: (
  params: NotificationParams
) => UseQueryResult<NotificationResponse, Error>;

export declare const useReadAllNotifications: () => UseMutationResult<any, Error, void>;

export declare const useReadNotification: () => UseMutationResult<any, Error, number>;
