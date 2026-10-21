import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { Field, PasswordRules } from '../components/Field'
import { GoogleMark, MicrosoftMark } from '../components/Icon'
import { emailOk, passwordOk } from './validate'
import { saveUser } from '../platform/state'

export function CreateOrg() {
  const nav = useNavigate()
  const [org, setOrg] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!org.trim()) next.org = 'Give your organisation a name. You can change it later.'
    if (!name.trim()) next.name = 'Enter your name.'
    if (!email.trim()) next.email = 'Enter your work email.'
    else if (!emailOk(email)) next.email = 'That does not look like an email address. Check for a typo.'
    else if (email.trim().toLowerCase() === 'taken@company.com') next.email = 'An account with this email already exists. Sign in instead.'
    if (!passwordOk(password)) next.password = 'Your password needs all three things in the list below.'
    if (!agree) next.agree = 'Please accept the Terms and Privacy Policy to continue.'
    setErrors(next)
    if (!Object.keys(next).length) {
      saveUser({ org: org.trim(), name: name.trim(), email: email.trim() })
      nav('/welcome/1')
    }
  }

  return (
    <AuthLayout back={{ to: '/login', label: 'Back to sign in' }}>
      <h1 className="ao-display">Create your organisation</h1>
      <p className="lede">You will be its administrator. Invite your team once you are in.</p>

      <div className="sso">
        <button type="button" className="btn soft" onClick={() => nav('/welcome/1')}>
          <GoogleMark /> Sign up with Google
        </button>
        <button type="button" className="btn soft" onClick={() => nav('/welcome/1')}>
          <MicrosoftMark /> Sign up with Microsoft
        </button>
      </div>
      <div className="divider">
        <span>or use your email</span>
      </div>

      <form onSubmit={submit} noValidate>
        <Field label="Organisation name" placeholder="Acme Corp" autoComplete="organization" value={org} onChange={setOrg} error={errors.org} />
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
          Create account
        </button>
      </form>

      <p className="alt">
        Already have a team here? <Link className="link" to="/join">Join an organisation</Link> · <Link className="link" to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
