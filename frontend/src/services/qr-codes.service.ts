import { apiClient } from "@/lib/api-client";
import type { CampusLocation } from "@/services/locations.service";

export interface RoomQrCode {
  room: CampusLocation;
  code: string;
  imageUrl: string;
}

export const qrCodesService = {
  async getForRoom(roomId: string): Promise<RoomQrCode> {
    const response = await apiClient.get<RoomQrCode>(`/qr/rooms/${roomId}`);
    return response.data;
  },
};
