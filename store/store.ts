import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: null | string;
  setInitialized: (value: boolean) => void;
  setAuthenticated: (value: boolean) => void;
  setUser: (value: string | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    isInitialized: false,
    isAuthenticated: false,
    user: null,

    setInitialized: (value) => set({ isInitialized: value }),
    setAuthenticated: (value) => set({ isAuthenticated: value }),
    setUser: (value) => set({ user: value }),
  }))
);
