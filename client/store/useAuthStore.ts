// store/useAuthStore.ts
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
}));
