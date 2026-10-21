import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { Field } from '../components/Field'
import { GoogleMark, Icon, MicrosoftMark } from '../components/Icon'
import { emailOk } from './validate'

export function SignIn() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [busy, setBusy] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'Enter your work email.'
    else if (!emailOk(email)) next.email = 'That does not look like an email address. Check for a typo.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    window.setTimeout(() => {
      setBusy(false)
      // prototype: the password "password" stands in for a wrong password
      if (password === 'password') setErrors({ form: 'That email and password do not match. Try again, or reset your password.' })
      else nav('/welcome/1')
    }, 700)
  }

  return (
    <AuthLayout>
      <h1 className="ao-display">Sign in to AgenticOrg</h1>
      <p className="lede">Pick the account you use at work.</p>

      <div className="sso">
        <button type="button" className="btn soft" onClick={() => nav('/welcome/1')}>
          <GoogleMark /> Continue with Google
        </button>
        <button type="button" className="btn soft" onClick={() => nav('/welcome/1')}>
          <MicrosoftMark /> Continue with Microsoft
        </button>
      </div>

      <div className="divider">
        <span>or use your email</span>
      </div>

      <form onSubmit={submit} noValidate>
        {errors.form && (
          <p className="banner err" role="alert">
            <Icon name="alert" size={18} />
            {errors.form}
          </p>
        )}
        <Field label="Work email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={setEmail} error={errors.email} />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          aside={
            <Link className="link small" to="/forgot">
              Forgot password?
            </Link>
          }
        />
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="new-here">
        <p>New to AgenticOrg?</p>
        <Link to="/join" className="row-link">
          <Icon name="users" size={20} />
          <span>Join an existing organisation</span>
          <Icon name="arrowRight" size={18} />
        </Link>
        <Link to="/signup" className="row-link">
          <Icon name="building" size={20} />
          <span>Create a new organisation</span>
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>

      <p className="legal">
        By continuing you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
      </p>
      <Link className="home" to="/">
        <Icon name="arrowLeft" size={16} />
        Back to home
      </Link>
    </AuthLayout>
  )
}
