import { create } from "zustand"
import { VitalSign } from "@/types/vitals.types"
import { VitalType } from "@prisma/client"

interface VitalsState {
  vitals: VitalSign[]
  selectedVital: VitalSign | null
  isLoading: boolean
  error: string | null

  // Actions
  setVitals: (vitals: VitalSign[]) => void
  addVital: (vital: VitalSign) => void
  updateVital: (id: string, vital: Partial<VitalSign>) => void
  deleteVital: (id: string) => void
  setSelectedVital: (vital: VitalSign | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Getters
  getVitalsByType: (type: VitalType) => VitalSign[]
  getLatestVital: (type: VitalType) => VitalSign | null
}

export const useVitalsStore = create<VitalsState>((set, get) => ({
  vitals: [],
  selectedVital: null,
  isLoading: false,
  error: null,

  setVitals: (vitals) => set({ vitals }),

  addVital: (vital) =>
    set((state) => ({
      vitals: [vital, ...state.vitals].sort(
        (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      ),
    })),

  updateVital: (id, updatedData) =>
    set((state) => ({
      vitals: state.vitals.map((vital) =>
        vital.id === id ? { ...vital, ...updatedData } : vital
      ),
      selectedVital:
        state.selectedVital?.id === id
          ? { ...state.selectedVital, ...updatedData }
          : state.selectedVital,
    })),

  deleteVital: (id) =>
    set((state) => ({
      vitals: state.vitals.filter((vital) => vital.id !== id),
      selectedVital:
        state.selectedVital?.id === id
          ? null
          : state.selectedVital,
    })),

  setSelectedVital: (vital) => set({ selectedVital: vital }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  getVitalsByType: (type) => {
    return get().vitals.filter((vital) => vital.type === type)
  },

  getLatestVital: (type) => {
    const vitals = get().getVitalsByType(type)
    return vitals.length > 0 ? vitals[0] : null
  },
}))


