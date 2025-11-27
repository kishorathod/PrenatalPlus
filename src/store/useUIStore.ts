import { create } from "zustand"

interface UIState {
  // Sidebar state
  sidebarOpen: boolean
  
  // Modal states
  modals: Record<string, boolean>
  
  // Toast queue (if needed beyond useToast)
  // Theme state (handled by next-themes, but can track here)
  
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  toggleModal: (modalId: string) => void
  isModalOpen: (modalId: string) => boolean
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  modals: {},

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  openModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    })),
  
  closeModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    })),
  
  toggleModal: (modalId) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: !state.modals[modalId],
      },
    })),
  
  isModalOpen: (modalId) => {
    return get().modals[modalId] || false
  },
}))


