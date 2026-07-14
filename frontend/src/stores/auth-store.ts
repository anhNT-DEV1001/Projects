"use client";

import { create } from "zustand";

import type { UserResponse } from "@/lib";

interface AuthState {
  user: UserResponse | null;
  isHydrated: boolean;
  setUser: (user: UserResponse | null) => void;
  setHydrated: (isHydrated: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user, isHydrated: true }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  clearAuth: () => set({ user: null, isHydrated: true }),
}));
