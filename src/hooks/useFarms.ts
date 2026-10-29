import { useQuery } from '@tanstack/react-query'
import type { Farm } from '@/lib/batches'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export function useFarms() {
  return useQuery({
    queryKey: ['farms'],
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<Farm[]> => {
      const { data, error } = await supabase.from('farms').select('*').order('name')
      if (error) throw error
      return (data ?? []) as Farm[]
    },
  })
}

export interface FarmMember {
  farm_id: string
  user_id: string
  email: string
}

// Staff only: the database function refuses everyone else.
export function useFarmMembers(enabled: boolean) {
  return useQuery({
    queryKey: ['farm-members'],
    enabled: isSupabaseConfigured && enabled,
    queryFn: async (): Promise<FarmMember[]> => {
      const { data, error } = await supabase.rpc('list_farm_members')
      if (error) throw error
      return (data ?? []) as FarmMember[]
    },
  })
}
