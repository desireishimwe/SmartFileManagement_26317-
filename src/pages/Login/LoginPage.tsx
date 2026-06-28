import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import nuVisionLogo from '../../assets/nu-vision-logo.jpg';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.ok) {
        // role is set in AuthContext; read it from the result to decide where to go
        navigate(
          result.role === 'admin'    ? '/dashboard'           :
          result.role === 'academic' ? '/academic/dashboard'  :
          result.role === 'finance'  ? '/finance/dashboard'   :
          result.role === 'parent'   ? '/parent/dashboard'    :
          result.role === 'teacher'  ? '/teacher/dashboard'   :
                                       '/student/dashboard',
          { replace: true }
        );
      } else {
        setError(result.error ?? 'Login failed.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-overlay" />

      <div className="login-content">
        <div className="login-center-box">

          {/* Left: school branding */}
          <div className="login-branding">
            <div className="login-logo-wrap">
              <img src={nuVisionLogo} alt="Nu Vision High School logo" />
            </div>
            <h1 className="login-school-name">Nu Vision High School</h1>
            <p className="login-tagline">Education for <em>Excellence</em></p>
          </div>

          {/* Right: sign-in card */}
          <div className="login-card">
            <div className="login-card-header">
              <h2>Sign In</h2>
              <p>Access your academic portal</p>
            </div>

            {error && (
              <div className="login-error-alert">
                <FiAlertCircle aria-hidden="true" />
                {error}
              </div>
            )}

            <form noValidate onSubmit={submit}>
              <div className="login-field">
                <label className="login-field-label">ID OR EMAIL</label>
                <div className="login-input-wrap">
                  <FiMail className="login-input-icon" aria-hidden="true" />
                  <input
                    className="login-input"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-field-label">PASSWORD</label>
                <div className="login-input-wrap">
                  <FiLock className="login-input-icon" aria-hidden="true" />
                  <input
                    className="login-input"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div className="login-forgot-row">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button className="btn-login" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : <> Sign In <FiArrowRight aria-hidden="true" /></>}
              </button>

              <p className="login-register-text">
                New here? <Link to="/register">Create an account</Link>
              </p>
            </form>
          </div>

        </div>
      </div>

      <footer className="login-footer">© 2026 Nu Vision High School • All rights reserved</footer>
    </div>
  );
}
