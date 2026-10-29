// Turns database / network errors into short messages a farmer can act on.
export function errorMessage(error: unknown): string {
  const raw =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : ''
  const text = raw.toLowerCase()

  if (text.includes('row-level security') || text.includes('permission denied'))
    return 'You are not allowed to do that. You can only change batches on your own farm.'
  if (text.includes('duplicate key') && text.includes('batch_code'))
    return 'That batch code is already used. Leave it blank to get a new one automatically.'
  if (text.includes('invalid login credentials')) return 'Wrong email or password.'
  if (text.includes('email not confirmed'))
    return 'This account is not confirmed yet. Ask Auxesis to confirm it.'
  if (text.includes('failed to fetch') || text.includes('network'))
    return 'Could not reach the server. Check your internet connection and try again.'
  if (text.includes('no account found')) return 'No account exists for that email yet. Create it in Supabase first.'
  if (text.includes('only auxesis staff')) return 'Only Auxesis staff can do that.'
  return raw || 'Something went wrong. Please try again.'
}
