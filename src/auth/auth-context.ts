import type { Session, User } from '@supabase/supabase-js'
import { createContext } from 'react'

export interface AuthState {
  session: Session | null
  user: User | null
  /** True while we are still checking whether someone is signed in. */
  loading: boolean
  /** True while we are still looking up the signed-in person's role. */
  rolesLoading: boolean
  /** Auxesis team member: can manage every farm and batch. */
  isStaff: boolean
  /** Farms this account belongs to (farmers). */
  farmIds: string[]
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)
