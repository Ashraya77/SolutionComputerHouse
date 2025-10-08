// utils/requireAuth.ts
"use client";

import { useAuthStore } from "@/store/useAuthStore";

export const useRequireAuth = () => {
  const { user, loading } = useAuthStore();

  const requireAuth = (callback: () => void) => {
    // Wait for the initial auth check to complete before proceeding.
    if (loading) return;

    if (!user) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    callback();
  };

  return requireAuth;
};
