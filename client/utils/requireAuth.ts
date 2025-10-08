// utils/requireAuth.ts
"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export const useRequireAuth = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const hasRedirected = useRef(false); 

  const requireAuth = (callback: () => void) => {
    if (!user) {
      if (!hasRedirected.current) {
        hasRedirected.current = true; // mark redirected
        alert("You must be logged in to access this page.");
        router.push("/login");
      }
      return;
    }
    callback();
  };

  return requireAuth;
};
