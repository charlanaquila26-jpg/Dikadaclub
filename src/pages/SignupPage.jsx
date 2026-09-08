import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(params.get('next'))

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (authError) {
      setError(authError.message)
      setSubmitting(false)
      return
    }

    if (data.session) {
      navigate(next, { replace: true })
      return
    }

    setMessage('Account created. Check your email to confirm, then sign in to continue.')
    setSubmitting(false)
  }

  return (
    <main className="min-h-screen grid place-items-center bg-white px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Join Dinkada Club</h1>
          <p className="text-sm text-slate-500">Create an account before booking a court.</p>
        </div>
        <input className="w-full rounded-xl border px-4 py-3" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full rounded-xl border px-4 py-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border px-4 py-3" type="password" minLength="6" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button disabled={submitting} className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-60">
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-sm text-center text-slate-600">
          Already have an account? <Link className="font-semibold text-green-700" to={`/login?next=${encodeURIComponent(next)}`}>Sign in</Link>
        </p>
      </form>
    </main>
  )
}
