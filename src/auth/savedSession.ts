// A cheap check for "is someone probably signed in?" that does not load the database
// library. Supabase keeps its session in localStorage under a key like
// "sb-<project>-auth-token". Used only to choose between "Sign in" and "My batches" in
// the header; the real check happens on the protected pages.
export function hasSavedSession(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && /^sb-.+-auth-token$/.test(key)) return true
    }
  } catch {
    // Storage can be blocked (private mode); treat as signed out.
  }
  return false
}
