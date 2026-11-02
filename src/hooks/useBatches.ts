import { useQuery } from '@tanstack/react-query'
import type { Batch, TracedBatch } from '@/lib/batches'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

// Public read: the database's security rules allow anyone to view batches and farms.
export function useBatches() {
  return useQuery({
    queryKey: ['batches'],
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<Batch[]> => {
      const { data, error } = await supabase
        .from('production_batches')
        .select('*, farms(*)')
        .order('planted_on', { ascending: false })
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as unknown as Batch[]
    },
  })
}

// Look up one batch by its code, with the dates it reached each stage.
export function useBatchByCode(code: string) {
  return useQuery({
    queryKey: ['batch-trace', code],
    enabled: isSupabaseConfigured && code !== '',
    queryFn: async (): Promise<TracedBatch | null> => {
      const { data, error } = await supabase
        .from('production_batches')
        .select('*, farms(*), batch_events(*)')
        .eq('batch_code', code)
        .maybeSingle()
      if (error) throw error
      return (data ?? null) as unknown as TracedBatch | null
    },
  })
}
