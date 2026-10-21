import { Link, useLocation } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { Icon } from '../components/Icon'

export function Requested() {
  const { state } = useLocation() as { state?: { email?: string } }
  const email = state?.email ?? 'your email'
  return (
    <AuthLayout>
      <div className="status-icon">
        <Icon name="clock" size={28} />
      </div>
      <h1 className="ao-display">Request sent</h1>
      <p className="lede">
        Your admin has been told. We will email <b>{email}</b> the moment they decide.
      </p>
      <ol className="steps">
        <li data-done>
          <span className="tick"><Icon name="check" size={14} strokeWidth={3} /></span>
          <div><b>Request sent</b><small>Just now</small></div>
        </li>
        <li data-now>
          <span className="tick" />
          <div><b>Admin reviews</b><small>Usually within a working day</small></div>
        </li>
        <li>
          <span className="tick" />
          <div><b>You can sign in</b><small>Use the password you just created</small></div>
        </li>
      </ol>
      <Link className="btn soft" to="/login">Back to sign in</Link>
    </AuthLayout>
  )
}
