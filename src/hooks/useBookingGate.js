import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export function useBookingGate() {
  const { user } = useAuth()
  const navigate = useNavigate()

  function startBooking(bookingUrl) {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(bookingUrl)}`)
      return false
    }

    navigate(bookingUrl)
    return true
  }

  return { startBooking, isSignedIn: Boolean(user) }
}
