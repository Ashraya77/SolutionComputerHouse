// store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setAuth: (token) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
    set({ token });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    set({ token: null });
  },
}));
