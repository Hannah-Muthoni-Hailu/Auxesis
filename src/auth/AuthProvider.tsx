import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { errorMessage } from '@/lib/errors'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { AuthContext, type AuthState } from './auth-context'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user.id

  // Who is this person? Staff, or a farmer linked to one or more farms.
  const roles = useQuery({
    queryKey: ['roles', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [staff, members] = await Promise.all([
        supabase.from('staff').select('user_id').eq('user_id', userId!).maybeSingle(),
        supabase.from('farm_members').select('farm_id').eq('user_id', userId!),
      ])
      if (staff.error) throw staff.error
      if (members.error) throw members.error
      return {
        isStaff: Boolean(staff.data),
        farmIds: (members.data ?? []).map((m) => m.farm_id as string),
      }
    },
  })

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return error ? errorMessage(error) : null
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    queryClient.removeQueries({ queryKey: ['roles'] })
  }, [queryClient])

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      rolesLoading: Boolean(userId) && roles.isPending,
      isStaff: roles.data?.isStaff ?? false,
      farmIds: roles.data?.farmIds ?? [],
      signIn,
      signOut,
    }),
    [session, loading, userId, roles.isPending, roles.data, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
