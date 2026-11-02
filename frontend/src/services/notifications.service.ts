import { apiClient } from "@/lib/api-client";
import type { NotificationItem } from "@/types/api";

export const notificationsService = {
  async list(): Promise<NotificationItem[]> {
    const response = await apiClient.get<NotificationItem[]>("/notifications");
    return response.data;
  },
};
