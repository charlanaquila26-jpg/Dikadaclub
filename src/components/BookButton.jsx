import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function BookButton({ courtId, children = 'Book now', className = '' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const bookingUrl = `/book/${courtId}`

  function handleBook() {
    if (user) {
      navigate(bookingUrl)
      return
    }
    setShowAuthPrompt(true)
  }

  return (
    <>
      <button type="button" onClick={handleBook} className={className}>
        {children}
      </button>

      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4" role="presentation" onMouseDown={() => setShowAuthPrompt(false)}>
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-auth-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowAuthPrompt(false)}
              className="float-right rounded-full px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
            >
              ×
            </button>

            <div className="pr-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-700">Almost there</p>
              <h2 id="booking-auth-title" className="text-2xl font-bold text-slate-950">Create an account to book</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your account keeps your reservations, payments, and upcoming games in one place.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => navigate(`/signup?next=${encodeURIComponent(bookingUrl)}`)}
                className="rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => navigate(`/login?next=${encodeURIComponent(bookingUrl)}`)}
                className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50"
              >
                I already have an account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
