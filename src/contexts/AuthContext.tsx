"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User } from "@/types";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const login = (token: string, userData: User) => {
    Cookies.set("token", token, { expires: 7 });
    setUser(userData);

    const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
    if (
      redirectUrl &&
      redirectUrl !== "/login" &&
      redirectUrl !== "/register" &&
      redirectUrl !== "/forgot-password" &&
      redirectUrl !== "/reset-password"
    ) {
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectUrl);
    } else {
      router.push("/dashboard");
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);

      Cookies.remove("token");
      setUser(null);
      sessionStorage.removeItem("redirectAfterLogin");

      authApi.logout().catch((error) => {
        console.error("Server logout failed:", error);
      });

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.success("Logged out successfully");
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get("token");

      if (!token || token === "null" || token === "undefined") {
        setIsLoading(false);
        return;
      }

      let timeoutId: NodeJS.Timeout | undefined = undefined;

      try {
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await authApi.getCurrentUser();
        clearTimeout(timeoutId);

        setUser(response.user);
      } catch (error: any) {
        console.error("Failed to load user:", error);

        if (error.response?.status === 401) {
          Cookies.remove("token");
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login") &&
            !window.location.pathname.includes("/register")
          ) {
            toast.error("Session expired. Please login again.");
          }
        }
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isLoggingOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
