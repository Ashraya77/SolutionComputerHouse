"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import apiClient from "@/lib/apiClient";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAuth, clearAuth } = useAuthStore();
  const { fetchCart, clearCart: clearCartItems } = useCartStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.get("/users/me");
        const user = response.data.user;
        setAuth(user);
        // If user is logged in, fetch their cart from the server
        if (user) {
          await fetchCart();
        }
      } catch (error) {
        clearAuth();
      } finally {
        setInitialized(true);
      }
    };
    initializeAuth();
  }, [setAuth, clearAuth]);

  if (!initialized) {
    return <div className="flex justify-center items-center h-screen">Initializing App...</div>;
  }

  return <>{children}</>;
}