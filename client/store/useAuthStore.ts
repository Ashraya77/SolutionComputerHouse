// store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  token: string | null;

}

interface AuthState {
  user: User | null;
  isInitializing: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isInitializing: true, // Start in an initializing state
      setAuth: (user) => set({ user }),
      clearAuth: () => set({ user: null }),
      setInitializing: (isInitializing) => set({ isInitializing }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
