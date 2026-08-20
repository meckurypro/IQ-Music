// src/pages/staff/StaffLogin.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function StaffLogin() {
  const { user, isStaff, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading || !user) return
    if (isStaff) navigate('/staff/dashboard')
    else navigate('/')
  }, [loading, user, isStaff, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)
    if (signInError) setError('Incorrect email or password.')
  }

  return (
    <section style={{ paddingTop: 60, minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <span className="eyebrow">Staff access</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '14px 0 24px' }}>Sign in</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <div>
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p style={{ color: '#e0776a', fontSize: 13 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting} style={{ width: 'fit-content' }}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
          Same login as Meckury AI. No signup here — access is granted by staff role.
        </p>
      </div>
    </section>
  )
}
