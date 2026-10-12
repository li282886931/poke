import { create } from 'zustand'
import type { Role } from '@/types/business'

interface SessionState {
  role: Role
  loggedIn: boolean
  credit: number
  setRole: (role: Role) => void
  login: () => void
  consumeCredit: (amount: number) => boolean
}

export const useSession = create<SessionState>((set, get) => ({
  role: 'resident',
  loggedIn: false,
  credit: 36,
  setRole: role => set({ role }),
  login: () => set({ loggedIn: true }),
  consumeCredit: amount => {
    if (get().credit < amount) return false
    set(state => ({ credit: state.credit - amount }))
    return true
  },
}))
