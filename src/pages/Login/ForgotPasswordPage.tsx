import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import nuVisionLogo from '../../assets/nu-vision-logo.svg';

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (event.currentTarget.checkValidity()) {
      setSent(true);
    }
  };

  return (
    <div className="auth-page">
      <Link className="auth-back" to="/">
        Back to Home
      </Link>
      <div className="auth-panel shadow">
        <div className="text-center mb-4">
          <div className="school-logo auth-logo mx-auto mb-3">
            <img src={nuVisionLogo} alt="Nu Vision High School logo" />
          </div>
          <h1 className="h3 fw-bold">Reset Password</h1>
          <p className="text-muted">Enter your school email and we will send password recovery instructions.</p>
        </div>
        {sent && <div className="alert alert-success">Recovery instructions have been sent.</div>}
        <form onSubmit={submit}>
          <label className="form-label">School email</label>
          <div className="input-group mb-4">
            <span className="input-group-text">
              <FiMail />
            </span>
            <input className="form-control" type="email" placeholder="admin@nuvision.edu" required />
          </div>
          <button className="btn btn-primary w-100" type="submit">Send Reset Link</button>
          <Link className="btn btn-link w-100 mt-2" to="/login">Back to login</Link>
        </form>
      </div>
    </div>
  );
}
