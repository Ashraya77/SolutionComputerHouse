"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/lib/apiClient";

export default function AuthInitializer() {
  const { setAuth, clearAuth } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.get("/users/me");
        setAuth(response.data.user);
      } catch (error) {
        clearAuth();
      } finally {
        setInitialized(true);
      }
    };
    initializeAuth();
  }, [setAuth, clearAuth]);

  return initialized ? null : <div className="flex justify-center items-center h-screen">Initializing App...</div>;
}