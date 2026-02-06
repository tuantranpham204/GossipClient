import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROLES } from "../utils/enum";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, accessToken }),

      logout: () => set({ user: null, accessToken: null }),

      setUser: (user) => set({ user }),

      isAdmin: () => {
        const user = get().user;
        return user?.role === ROLES.ADMIN;
      },

      isUser: () => {
        const user = get().user;
        return user?.role === ROLES.USER;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
