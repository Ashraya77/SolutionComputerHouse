// utils/requireAuth.ts
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export const useRequireAuth = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const requireAuth = (callback: () => void) => {
    if (!token) {
      router.push("/login"); // redirect to login if not logged in
      return;
    }
    callback(); // execute the action if logged in
  };

  return requireAuth;
};
