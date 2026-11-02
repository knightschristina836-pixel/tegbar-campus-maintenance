import { apiClient } from "@/lib/api-client";
import type { ComplaintSummary } from "@/services/complaints.service";

export interface ComplaintAssignment {
  id: string;
  report: ComplaintSummary;
  technicianId: string;
  assignedAt: string;
}

export const assignmentsService = {
  async list(): Promise<ComplaintAssignment[]> {
    const response = await apiClient.get<ComplaintAssignment[]>("/assignments");
    return response.data;
  },
};
