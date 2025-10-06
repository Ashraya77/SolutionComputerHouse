import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const useInitializeAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuth(token);
    setMounted(true);
  }, [setAuth]);

  return mounted;
};

export default useInitializeAuth;