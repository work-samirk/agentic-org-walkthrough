import { useState, type FormEvent } from 'react'
import { AuthLayout } from '../components/AuthLayout'
import { Field } from '../components/Field'
import { Icon } from '../components/Icon'
import { emailOk } from './validate'

export function Forgot() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!emailOk(email)) return setError('Enter the email you signed up with.')
    setError(undefined)
    setSent(true)
  }

  return (
    <AuthLayout back={{ to: '/login', label: 'Back to sign in' }}>
      {sent ? (
        <>
          <div className="status-icon"><Icon name="mail" size={28} /></div>
          <h1 className="ao-display">Check your email</h1>
          <p className="lede">If an account exists for <b>{email}</b>, a reset link is on its way. It works for 30 minutes.</p>
          <button className="btn soft" type="button" onClick={() => setSent(false)}>Use a different email</button>
        </>
      ) : (
        <>
          <h1 className="ao-display">Reset your password</h1>
          <p className="lede">Enter your email and we will send you a link.</p>
          <form onSubmit={submit} noValidate>
            <Field label="Email" type="email" placeholder="you@company.com" autoComplete="email" value={email} onChange={setEmail} error={error} />
            <button className="btn primary" type="submit">Send reset link</button>
          </form>
        </>
      )}
    </AuthLayout>
  )
}
