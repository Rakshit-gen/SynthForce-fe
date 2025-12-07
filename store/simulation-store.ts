import { create } from 'zustand'

export interface Simulation {
  session_id: string
  name?: string
  description?: string
  scenario: string
  status: 'active' | 'paused' | 'completed' | 'failed'
  current_turn: number
  max_turns: number
  created_at: string
  updated_at: string
}

interface SimulationState {
  activeSimulations: Simulation[]
  currentSessionId: string | null
  setActiveSimulations: (simulations: Simulation[]) => void
  setCurrentSession: (sessionId: string | null) => void
  addSimulation: (simulation: Simulation) => void
  updateSimulation: (sessionId: string, updates: Partial<Simulation>) => void
  removeSimulation: (sessionId: string) => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  activeSimulations: [],
  currentSessionId: null,
  setActiveSimulations: (simulations) => set({ activeSimulations: simulations }),
  setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),
  addSimulation: (simulation) =>
    set((state) => ({
      activeSimulations: [...state.activeSimulations, simulation],
    })),
  updateSimulation: (sessionId, updates) =>
    set((state) => ({
      activeSimulations: state.activeSimulations.map((sim) =>
        sim.session_id === sessionId ? { ...sim, ...updates } : sim
      ),
    })),
  removeSimulation: (sessionId) =>
    set((state) => ({
      activeSimulations: state.activeSimulations.filter(
        (sim) => sim.session_id !== sessionId
      ),
    })),
}))

