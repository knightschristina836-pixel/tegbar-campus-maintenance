import { apiClient } from "@/lib/api-client";
import type { AuthUser } from "@/types/auth";
import type { PaginatedResponse } from "@/types/api";

export const usersService = {
  async list(page = 1): Promise<PaginatedResponse<AuthUser>> {
    const response = await apiClient.get<PaginatedResponse<AuthUser>>("/users", {
      params: { page },
    });
    return response.data;
  },

  async getById(userId: string): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>(`/users/${userId}`);
    return response.data;
  },
};
