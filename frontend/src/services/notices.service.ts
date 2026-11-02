import { apiClient } from "@/lib/api-client";

export interface BuildingNotice {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
  expiresAt: string | null;
}

export const noticesService = {
  async list(): Promise<BuildingNotice[]> {
    const response = await apiClient.get<BuildingNotice[]>("/notices");
    return response.data;
  },
};
