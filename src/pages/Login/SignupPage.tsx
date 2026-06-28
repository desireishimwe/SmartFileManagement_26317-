import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiAlertCircle, FiArrowRight, FiEye, FiEyeOff,
  FiLock, FiMail, FiPhone, FiUser,
} from 'react-icons/fi';
import nuVisionLogo from '../../assets/nu-vision-logo.jpg';

type Role = 'student' | 'parent' | 'teacher';

export function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'student' as Role,
    studentId: '',
    password: '',
    confirm: '',
  });
  const [showPwd, setShowPwd]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  function validate() {
    if (!form.fullName.trim())  return 'Full name is required.';
    if (!form.email.trim())     return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.phone.trim())     return 'Phone number is required.';
    if ((form.role === 'student' || form.role === 'parent') && !form.studentId.trim())
      return 'Student ID is required for students and parents.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return '';
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login', { state: { registered: true } });
    }, 800);
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-overlay" />

      <div className="login-content">
        <div className="login-center-box" style={{ maxWidth: 960 }}>

          {/* Left branding */}
          <div className="login-branding">
            <div className="login-logo-wrap">
              <img src={nuVisionLogo} alt="Nu Vision High School logo" />
            </div>
            <h1 className="login-school-name">Nu Vision High School</h1>
            <p className="login-tagline">Education for <em>Excellence</em></p>
          </div>

          {/* Right: sign-up form */}
          <div className="login-card" style={{ overflowY: 'auto', maxHeight: '90vh' }}>
            <div className="login-card-header">
              <h2>Create Account</h2>
              <p>Register to access the school portal</p>
            </div>

            {error && (
              <div className="login-error-alert">
                <FiAlertCircle aria-hidden="true" />
                {error}
              </div>
            )}

            <form noValidate onSubmit={handleSubmit}>

              {/* Full name */}
              <div className="login-field">
                <label className="login-field-label">FULL NAME</label>
                <div className="login-input-wrap">
                  <FiUser className="login-input-icon" aria-hidden="true" />
                  <input
                    className="login-input"
                    type="text"
                    placeholder="e.g. Ava Johnson"
                    value={form.fullName}
                    onChange={e => set('fullName', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="login-field">
                <label className="login-field-label">EMAIL ADDRESS</label>
                <div className="login-input-wrap">
                  <FiMail className="login-input-icon" aria-hidden="true" />
                  <input
                    className="login-input"
                    type="email"
                    placeholder="you@nuvision.edu"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="login-field">
                <label className="login-field-label">PHONE NUMBER</label>
                <div className="login-input-wrap">
                  <FiPhone className="login-input-icon" aria-hidden="true" />
                  <input
                    className="login-input"
                    type="tel"
                    placeholder="e.g. 0786341041"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div className="login-field">
                <label className="login-field-label">ROLE</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['student', 'parent', 'teacher'] as Role[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => set('role', r)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: 8,
                        border: `2px solid ${form.role === r ? 'var(--school-primary)' : '#e2e8f0'}`,
                        background: form.role === r ? 'var(--school-primary)' : '#fff',
                        color: form.role === r ? '#fff' : '#555',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s',
                      }}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student ID — shown for student & parent */}
              {(form.role === 'student' || form.role === 'parent') && (
                <div className="login-field">
                  <label className="login-field-label">
                    {form.role === 'parent' ? "CHILD'S STUDENT ID" : 'STUDENT ID'}
                  </label>
                  <div className="login-input-wrap">
                    <FiUser className="login-input-icon" aria-hidden="true" />
                    <input
                      className="login-input"
                      type="text"
                      placeholder="e.g. STU-1001"
                      value={form.studentId}
                      onChange={e => set('studentId', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="login-field">
                <label className="login-field-label">PASSWORD</label>
                <div className="login-input-wrap">
                  <FiLock className="login-input-icon" aria-hidden="true" />
                  <input
                    className="login-input"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPwd(v => !v)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="login-field">
                <label className="login-field-label">CONFIRM PASSWORD</label>
                <div className="login-input-wrap">
                  <FiLock className="login-input-icon" aria-hidden="true" />
                  <input
                    className="login-input"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={e => set('confirm', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowConfirm(v => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <button className="btn-login" type="submit" disabled={loading}>
                {loading
                  ? 'Creating account…'
                  : <> Create Account <FiArrowRight aria-hidden="true" /></>}
              </button>

              <p className="login-register-text">
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </form>
          </div>

        </div>
      </div>

      <footer className="login-footer">© 2026 Nu Vision High School • All rights reserved</footer>
    </div>
  );
}
