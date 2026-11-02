"use client";

import { Suspense, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import type { UserRole } from "@/types/auth";

const roleBySlug: Record<string, UserRole> = {
  student: "STUDENT",
  proctor: "PROCTOR",
  technician: "TECHNICIAN",
  admin: "ADMIN",
};

function DashboardRoleContent({ children }: { children: ReactNode }) {
  const params = useParams<{ role: string }>();
  const role = roleBySlug[params.role];
  if (!role) return <RoleGuard roles={[]}>{children}</RoleGuard>;

  return (
    <RoleGuard roles={[role]}>
      <WorkspaceShell roleLabel={role}>{children}</WorkspaceShell>
    </RoleGuard>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading workspace…</div>}>
      <DashboardRoleContent>{children}</DashboardRoleContent>
    </Suspense>
  );
}
