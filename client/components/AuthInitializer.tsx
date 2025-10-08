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
  const { mergeAndSetCart, clearCart: clearCartItems } = useCartStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.get("/users/me");
        const user = response.data.user;
        setAuth(user);
        // If user is logged in, fetch their cart and merge it with the local guest cart.
        if (user) {
          const cartResponse = await apiClient.get('/cart');
          const serverItems = cartResponse.data.items.map((item: any) => ({ ...item, id: item.productId }));
          mergeAndSetCart(serverItems);
        }
      } catch (error) {
        clearAuth();
      } finally {
        setInitialized(true);
      }
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Use an empty dependency array to ensure this runs only once on mount.

  if (!initialized) {
    return <div className="flex justify-center items-center h-screen">Initializing App...</div>;
  }

  return <>{children}</>;
}