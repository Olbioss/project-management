import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalState {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  setIsSideBarCollapsed: (value: boolean) => void;
  setIsDarkMode: (value: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isDarkMode: false,
      setIsSideBarCollapsed: (value) => set({ isSidebarCollapsed: value }),
      setIsDarkMode: (value) => set({ isDarkMode: value }),
    }),
    { name: "global-storage" }
  )
);
