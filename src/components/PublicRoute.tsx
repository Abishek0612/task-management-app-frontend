"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

export default function PublicRoute({
  children,
  redirectIfAuthenticated = true,
}: PublicRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && redirectIfAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router, redirectIfAuthenticated]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (redirectIfAuthenticated && user) {
    return null;
  }

  return <>{children}</>;
}
