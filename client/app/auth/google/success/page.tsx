"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/lib/apiClient";
import useCartStore from "@/store/useCartStore";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { mergeAndSetCart } = useCartStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/users/me");
        setAuth(res.data.user);

        // Optionally merge cart
        const cartRes = await apiClient.get("/cart");
        mergeAndSetCart(
          cartRes.data.items.map((item: any) => ({ ...item, id: item.productId }))
        );

        router.push("/"); // redirect to homepage
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router, setAuth, mergeAndSetCart]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging you in with Google...</p>
    </div>
  );
}
