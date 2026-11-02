import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";

export interface ComplaintSummary {
  id: string;
  title: string;
  category: string;
  location: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "VERIFIED" | "REJECTED";
  createdAt: string;
}

export const complaintsService = {
  async list(page = 1): Promise<PaginatedResponse<ComplaintSummary>> {
    const response = await apiClient.get<PaginatedResponse<ComplaintSummary>>("/reports", {
      params: { page },
    });
    return response.data;
  },

  async getById(reportId: string): Promise<ComplaintSummary> {
    const response = await apiClient.get<ComplaintSummary>(`/reports/${reportId}`);
    return response.data;
  },
};
