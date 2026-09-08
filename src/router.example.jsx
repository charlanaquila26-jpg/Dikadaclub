import { createBrowserRouter } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

// Replace these imports with your existing page components.
import HomePage from './pages/HomePage'
import CourtsPage from './pages/CourtsPage'
import CourtPage from './pages/CourtPage'
import ClubsPage from './pages/ClubsPage'
import ClubPage from './pages/ClubPage'
import PickleQueuePage from './pages/PickleQueuePage'
import BookingPage from './pages/BookingPage'
import MyBookingsPage from './pages/MyBookingsPage'
import ProfilePage from './pages/ProfilePage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/courts', element: <CourtsPage /> },
  { path: '/courts/:courtSlug', element: <CourtPage /> },
  { path: '/clubs', element: <ClubsPage /> },
  { path: '/clubs/:clubSlug', element: <ClubPage /> },
  { path: '/pickle-queue', element: <PickleQueuePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },

  // Booking-related pages are protected.
  { path: '/book/:courtId', element: <RequireAuth><BookingPage /></RequireAuth> },
  { path: '/my-bookings', element: <RequireAuth><MyBookingsPage /></RequireAuth> },
  { path: '/profile', element: <RequireAuth><ProfilePage /></RequireAuth> },
])
