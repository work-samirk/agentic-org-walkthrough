import { useId, useState, type ReactNode, type InputHTMLAttributes } from 'react'
import { Icon } from './Icon'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
  aside?: ReactNode
}

export function Field({ label, value, onChange, error, hint, aside, type = 'text', ...rest }: Props) {
  const id = useId()
  const [shown, setShown] = useState(false)
  const isPassword = type === 'password'
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined

  return (
    <div className="field" data-invalid={error ? '' : undefined}>
      <div className="field-top">
        <label htmlFor={id}>{label}</label>
        {aside}
      </div>
      <div className="input-wrap">
        <input
          id={id}
          type={isPassword && shown ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {isPassword && (
          <button type="button" className="eye" onClick={() => setShown((s) => !s)} aria-label={shown ? 'Hide password' : 'Show password'}>
            <Icon name={shown ? 'eyeOff' : 'eye'} size={20} />
          </button>
        )}
      </div>
      {error ? (
        <p className="field-msg err" id={`${id}-err`} role="alert">
          <Icon name="alert" size={16} />
          {error}
        </p>
      ) : hint ? (
        <p className="field-msg" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function PasswordRules({ value }: { value: string }) {
  const rules = [
    { ok: value.length >= 8, text: '8 or more characters' },
    { ok: /[A-Z]/.test(value), text: 'An uppercase letter' },
    { ok: /[0-9]|[^A-Za-z0-9]/.test(value), text: 'A number or symbol' },
  ]
  return (
    <ul className="rules" aria-label="Password rules">
      {rules.map((r) => (
        <li key={r.text} data-ok={r.ok ? '' : undefined}>
          <span className="tick">{r.ok && <Icon name="check" size={12} strokeWidth={3} />}</span>
          {r.text}
          <span className="sr">{r.ok ? ', done' : ', not yet'}</span>
        </li>
      ))}
    </ul>
  )
}
