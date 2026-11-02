import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { RegistrationPayload } from '@/lib/farmerRegistration'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export interface FarmerRegistration extends RegistrationPayload {
  id: string
  created_at: string
}

// Anyone may register. No row is read back: visitors are not allowed to read the table.
export function useSubmitRegistration() {
  return useMutation({
    mutationFn: async (payload: RegistrationPayload) => {
      const { error } = await supabase.from('farmer_registrations').insert(payload)
      if (error) throw error
    },
  })
}

// Staff only: the database hides this table from everyone else.
export function useFarmerRegistrations() {
  return useQuery({
    queryKey: ['farmer-registrations'],
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<FarmerRegistration[]> => {
      const { data, error } = await supabase
        .from('farmer_registrations')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as FarmerRegistration[]
    },
  })
}

export function useDeleteRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('farmer_registrations')
        .delete()
        .eq('id', id)
        .select('id')
      if (error) throw error
      if (!data || data.length === 0) throw new Error('Only Auxesis staff can delete registrations.')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farmer-registrations'] }),
  })
}
