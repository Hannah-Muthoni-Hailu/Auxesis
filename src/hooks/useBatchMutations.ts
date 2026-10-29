import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BatchPayload } from '@/lib/batchForm'
import type { StagePatch } from '@/lib/batches'
import { supabase } from '@/lib/supabase'

const NOT_ALLOWED = 'You are not allowed to change this batch.'

// Create a new batch, or update an existing one when `id` is given.
export function useSaveBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id?: string; payload: BatchPayload }) => {
      if (id) {
        const { data, error } = await supabase
          .from('production_batches')
          .update(payload)
          .eq('id', id)
          .select('id')
        if (error) throw error
        // Row security hides rows you may not touch, so "nothing updated" means "not allowed".
        if (!data || data.length === 0) throw new Error(NOT_ALLOWED)
      } else {
        // No batch_code is sent: the database generates one.
        const { error } = await supabase.from('production_batches').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['batches'] }),
  })
}

// Move a batch forward one stage.
export function useAdvanceBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: StagePatch }) => {
      const { data, error } = await supabase
        .from('production_batches')
        .update(patch)
        .eq('id', id)
        .select('id')
      if (error) throw error
      if (!data || data.length === 0) throw new Error(NOT_ALLOWED)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['batches'] }),
  })
}

export function useDeleteBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('production_batches')
        .delete()
        .eq('id', id)
        .select('id')
      if (error) throw error
      if (!data || data.length === 0) throw new Error('Only Auxesis staff can delete batches.')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['batches'] }),
  })
}
