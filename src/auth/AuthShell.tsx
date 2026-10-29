import { Outlet } from 'react-router-dom'
import AuthProvider from './AuthProvider'

// Wraps only the sign-in and portal pages, so the rest of the site never downloads
// the sign-in code.
export default function AuthShell() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
