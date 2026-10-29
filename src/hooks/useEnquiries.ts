import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { EnquiryPayload } from '@/lib/enquiry'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export interface Enquiry extends EnquiryPayload {
  id: string
  created_at: string
}

// Anyone may send an enquiry. No row is read back: visitors are not allowed to read the table.
export function useSubmitEnquiry() {
  return useMutation({
    mutationFn: async (payload: EnquiryPayload) => {
      const { error } = await supabase.from('enquiries').insert(payload)
      if (error) throw error
    },
  })
}

// Staff only: the database hides this table from everyone else.
export function useEnquiries() {
  return useQuery({
    queryKey: ['enquiries'],
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<Enquiry[]> => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Enquiry[]
    },
  })
}

export function useDeleteEnquiry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('enquiries').delete().eq('id', id).select('id')
      if (error) throw error
      if (!data || data.length === 0) throw new Error('Only Auxesis staff can delete enquiries.')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enquiries'] }),
  })
}
