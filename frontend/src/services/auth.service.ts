import { apiClient } from "@/lib/api-client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterStudentInput,
} from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async registerStudent(input: RegisterStudentInput): Promise<void> {
    await apiClient.post("/auth/register", input);
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async currentUser(): Promise<AuthResponse["user"]> {
    const response = await apiClient.get<AuthResponse["user"]>("/auth/me");
    return response.data;
  },
};
