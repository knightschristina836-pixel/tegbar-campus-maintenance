import { apiClient } from "@/lib/api-client";

export interface MaintenanceCategory {
  id: string;
  name: string;
  description: string | null;
}

export const categoriesService = {
  async list(): Promise<MaintenanceCategory[]> {
    const response = await apiClient.get<MaintenanceCategory[]>("/categories");
    return response.data;
  },
};
