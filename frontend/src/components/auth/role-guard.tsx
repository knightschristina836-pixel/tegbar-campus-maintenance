"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/types/auth";

export function RoleGuard({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    else if (status === "authenticated" && user && !roles.includes(user.role)) {
      router.replace("/unauthorized");
    }
  }, [roles, router, status, user]);

  if (status === "loading" || status === "unauthenticated" || !user || !roles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        <LoaderCircle className="mr-2 animate-spin" size={18} /> Checking access…
      </div>
    );
  }
  return children;
}
