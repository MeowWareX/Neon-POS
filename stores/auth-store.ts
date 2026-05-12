"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AUTH_KEY } from "@/lib/constants";
import type { AppUser } from "@/types/domain";

interface AuthState {
  user: AppUser | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: AUTH_KEY,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
