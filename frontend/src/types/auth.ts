export const USER_ROLES = ["STUDENT", "PROCTOR", "TECHNICIAN", "ADMIN"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterStudentInput {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  password: string;
}
