// utils/requireAuth.ts
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export const useRequireAuth = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const requireAuth = (callback: () => void) => {
    if (!user) {
      router.push("/login"); // redirect to login if not logged in
      return;
    }
    callback(); // execute the action if logged in
  };

  return requireAuth;
};
