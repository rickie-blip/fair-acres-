import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Auth / Session Store ──────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, role: 'gm' | 'staff' | 'guest' }
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);

// ── UI Store (non-persistent) ─────────────────────────────────────────────────
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  activeAdminTab: "qr-codes", // 'qr-codes' | 'feedback-form' | 'confirmation' | 'gm-dashboard'
  activeDashboardTab: "tasks", // 'tasks' | 'complaints' | 'reviews'

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveAdminTab: (tab) => set({ activeAdminTab: tab }),
  setActiveDashboardTab: (tab) => set({ activeDashboardTab: tab }),
}));

// ── Guest / Room Store ────────────────────────────────────────────────────────
export const useRoomStore = create((set) => ({
  currentRoom: null, // room number pre-filled from QR scan
  setCurrentRoom: (room) => set({ currentRoom: room }),
  clearRoom: () => set({ currentRoom: null }),
}));
