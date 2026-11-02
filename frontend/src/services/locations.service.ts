import { apiClient } from "@/lib/api-client";

export interface CampusLocation {
  id: string;
  name: string;
  parentId: string | null;
  kind: "CAMPUS" | "BLOCK" | "FLOOR" | "ROOM";
}

export const locationsService = {
  async children(parentId?: string): Promise<CampusLocation[]> {
    const response = await apiClient.get<CampusLocation[]>("/locations", {
      params: parentId ? { parentId } : undefined,
    });
    return response.data;
  },

  async roomByQr(code: string): Promise<CampusLocation> {
    const response = await apiClient.get<CampusLocation>(`/qr/rooms/${encodeURIComponent(code)}`);
    return response.data;
  },
};
