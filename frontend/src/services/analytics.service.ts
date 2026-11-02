import { apiClient } from "@/lib/api-client";

export interface DashboardStatistics {
  totalComplaints: number;
  pendingComplaints: number;
  assignedComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  verifiedComplaints: number;
  criticalComplaints: number;
}

export const analyticsService = {
  async dashboard(): Promise<DashboardStatistics> {
    const response = await apiClient.get<DashboardStatistics>("/analytics/dashboard");
    return response.data;
  },
};
