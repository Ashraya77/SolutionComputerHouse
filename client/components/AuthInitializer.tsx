"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/lib/apiClient";

export default function AuthInitializer() {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.get("/users/me");
        setAuth(response.data.user);
      } catch (error) {
        // User is not logged in, or token is invalid. No action needed.
      }
    };
    initializeAuth();
  }, [setAuth]);

  return null; // This component does not render anything
}