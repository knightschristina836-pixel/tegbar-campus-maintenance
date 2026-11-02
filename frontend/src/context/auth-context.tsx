"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { disconnectNotificationSocket } from "@/lib/socket";
import type { AuthUser, LoginCredentials } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  signIn: (credentials: LoginCredentials) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const getStoredSession = () => {
    if (typeof window === "undefined") {
      return { token: null, user: null, status: "loading" as AuthStatus };
    }

    const storedToken = window.sessionStorage.getItem("tegbar.accessToken");
    const storedUser = window.sessionStorage.getItem("tegbar.user");

    if (!storedToken || !storedUser) {
      return { token: null, user: null, status: "unauthenticated" as AuthStatus };
    }

    try {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as AuthUser,
        status: "authenticated" as AuthStatus,
      };
    } catch {
      window.sessionStorage.removeItem("tegbar.accessToken");
      window.sessionStorage.removeItem("tegbar.user");
      return { token: null, user: null, status: "unauthenticated" as AuthStatus };
    }
  };

  const initialSession = useMemo(() => getStoredSession(), []);
  const [user, setUser] = useState<AuthUser | null>(initialSession.user);
  const [token, setToken] = useState<string | null>(initialSession.token);
  const [status, setStatus] = useState<AuthStatus>(initialSession.status);
  const router = useRouter();

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    window.sessionStorage.setItem("tegbar.accessToken", result.accessToken);
    window.sessionStorage.setItem("tegbar.user", JSON.stringify(result.user));
    setToken(result.accessToken);
    setUser(result.user);
    setStatus("authenticated");
    return result.user;
  }, []);

  const signOut = useCallback(() => {
    window.sessionStorage.removeItem("tegbar.accessToken");
    window.sessionStorage.removeItem("tegbar.user");
    disconnectNotificationSocket();
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, token, status, signIn, signOut }),
    [user, token, status, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
