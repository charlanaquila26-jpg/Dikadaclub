import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(params.get('next'))

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setSubmitting(false)
      return
    }

    navigate(next, { replace: true })
  }

  return (
    <main className="min-h-screen grid place-items-center bg-white px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to continue your booking.</p>
        </div>
        <input className="w-full rounded-xl border px-4 py-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border px-4 py-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={submitting} className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-60">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-sm text-center text-slate-600">
          New to Dinkada Club? <Link className="font-semibold text-green-700" to={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link>
        </p>
      </form>
    </main>
  )
}
