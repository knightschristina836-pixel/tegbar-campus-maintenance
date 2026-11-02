import { apiClient } from "@/lib/api-client";

export interface MaintenanceSchedule {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export const schedulesService = {
  async list(): Promise<MaintenanceSchedule[]> {
    const response = await apiClient.get<MaintenanceSchedule[]>("/schedules");
    return response.data;
  },
};
