import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { resetDemoState } from '../platform/reset'
import { Field, PasswordRules } from '../components/Field'
import { emailOk, passwordOk } from './validate'
import { saveUser } from '../platform/state'

export function JoinOrg() {
  // a fresh login always replays the tour
  useEffect(() => { resetDemoState() }, [])
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!code.trim()) next.code = 'Enter the organisation code your admin gave you.'
    else if (code.trim().toUpperCase() === 'WRONG') next.code = 'We could not find that code. Check it with your admin and try again.'
    if (!name.trim()) next.name = 'Enter your name.'
    if (!email.trim()) next.email = 'Enter your work email.'
    else if (!emailOk(email)) next.email = 'That does not look like an email address. Check for a typo.'
    if (!passwordOk(password)) next.password = 'Your password needs all three things in the list below.'
    if (!agree) next.agree = 'Please accept the Terms and Privacy Policy to continue.'
    setErrors(next)
    if (!Object.keys(next).length) {
      saveUser({ name: name.trim(), email: email.trim() })
      nav('/join/requested', { state: { email: email.trim() } })
    }
  }

  return (
    <AuthLayout back={{ to: '/login', label: 'Back to sign in' }}>
      <h1 className="ao-display">Join an organisation</h1>
      <p className="lede">Your admin reviews every request. You can sign in once they approve it.</p>

      <form onSubmit={submit} noValidate>
        <Field
          label="Organisation code"
          placeholder="e.g. ACME-4F9K"
          autoCapitalize="characters"
          autoComplete="off"
          value={code}
          onChange={setCode}
          error={errors.code}
          hint="Ask your admin. It is under Settings, then Invite people."
        />
        <Field label="Your name" placeholder="Jane Doe" autoComplete="name" value={name} onChange={setName} error={errors.name} />
        <Field label="Work email" type="email" placeholder="you@company.com" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
        <Field label="Password" type="password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={setPassword} error={errors.password} />
        <PasswordRules value={password} />

        <label className="check" data-invalid={errors.agree ? '' : undefined}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span className="box" aria-hidden="true" />
          <span>
            I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
          </span>
        </label>
        {errors.agree && <p className="field-msg err" role="alert">{errors.agree}</p>}

        <button className="btn primary" type="submit">
          Request to join
        </button>
      </form>

      <p className="alt">
        Starting fresh? <Link className="link" to="/signup">Create an organisation</Link> · <Link className="link" to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
