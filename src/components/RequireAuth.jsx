import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    const next = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }

  return children
}
