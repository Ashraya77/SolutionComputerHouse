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
  const { user: existingUser, setAuth, clearAuth } = useAuthStore();
  const { mergeAndSetCart } = useCartStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.get("/users/me");
        const user = response.data.user;
        if (user) {
          setAuth(user);

          // fetch and merge cart
          const cartResponse = await apiClient.get("/cart");
          const serverItems = cartResponse.data.items.map((item: any) => ({
            ...item,
            id: item.productId,
          }));
          mergeAndSetCart(serverItems);
        } else {
          // Only clear auth if there was a user in the store previously
          if (existingUser) {
            clearAuth();
          }
        }
      } catch (error) {
        clearAuth();
      } finally {
        setInitialized(true);
        useAuthStore.setState({ loading: false }); // Set loading to false
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        Initializing App...
      </div>
    );
  }

  return <>{children}</>;
}
