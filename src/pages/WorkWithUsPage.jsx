// src/pages/WorkWithUsPage.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ROLES = ['Songwriter', 'Producer', 'Dancer', 'Director', 'Cinematographer', 'Manager', 'Other']

const initialForm = {
  name: '', email: '', phone: '',
  purpose: 'collaborate',
  role: ROLES[0],
  message: '',
}

export default function WorkWithUsPage() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'submitting', message: '' })

    const isCollab = form.purpose === 'collaborate'
    const composedMessage = isCollab
      ? `[Collaboration — ${form.role}]\n${form.message}`
      : `[Service request]\n${form.message}`

    const { error } = await supabase.from('promptiq_inquiries').insert([{
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      inquiry_type: isCollab ? 'general' : 'custom_job',
      service_interest: 'music',
      message: composedMessage,
      status: 'new',
      source: 'iqmusic',
    }])

    if (error) {
      setStatus({ state: 'error', message: "Something didn't send. Please try again or email us directly." })
      return
    }

    setStatus({ state: 'success', message: "Got it — we'll be in touch shortly." })
    setForm(initialForm)
  }

  return (
    <section style={{ paddingTop: 40 }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <span className="eyebrow">Get in touch</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, margin: '14px 0 24px' }}>
          Work with IQ Music.
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="form-label">I'm reaching out to</label>
            <select name="purpose" value={form.purpose} onChange={handleChange} className="form-input">
              <option value="collaborate">Join as a collaborator</option>
              <option value="hire">Hire a service (production, video, management)</option>
            </select>
          </div>

          {form.purpose === 'collaborate' && (
            <div>
              <label className="form-label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="form-input">
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          <div className="form-row">
            <div>
              <label className="form-label">Name</label>
              <input className="form-input" name="name" required value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" required value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="form-label">Phone / WhatsApp</label>
            <input className="form-input" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label">Message</label>
            <textarea className="form-input" name="message" required style={{ minHeight: 110 }} value={form.message} onChange={handleChange} />
          </div>

          <button className="btn-primary" type="submit" disabled={status.state === 'submitting'} style={{ width: 'fit-content' }}>
            {status.state === 'submitting' ? 'Sending…' : 'Send'}
          </button>

          {status.state === 'success' && <p style={{ color: 'var(--accent)', fontSize: 13 }}>{status.message}</p>}
          {status.state === 'error' && <p style={{ color: '#e0776a', fontSize: 13 }}>{status.message}</p>}
        </form>
      </div>
    </section>
  )
}
