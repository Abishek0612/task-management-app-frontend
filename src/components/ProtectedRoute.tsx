"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push("/login");
    }
  }, [user, isLoading, router, pathname, requireAuth]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
