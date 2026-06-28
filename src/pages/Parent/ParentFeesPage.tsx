import { FormEvent, useEffect, useState } from 'react';
import {
  FiAlertCircle, FiCheck, FiCheckCircle, FiCreditCard,
  FiDownload, FiMessageSquare, FiPhone, FiSmartphone, FiUser, FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { FeeRecord, PaymentMethod } from '../../types';

type PayStep = 'method' | 'details' | 'sms' | 'done';

interface ModalState {
  fee: FeeRecord;
  amount: string;
  method: PaymentMethod;
  provider: 'urubuto' | 'bank';
  studentId: string;
  phone: string;
  step: PayStep;
  code: string;
  enteredCode: string;
  codeError: string;
}

function validateAmount(value: string, max: number): string {
  if (!value.trim()) return 'Amount is required.';
  const num = parseFloat(value);
  if (isNaN(num)) return 'Please enter a valid number.';
  if (num <= 0)   return 'Amount must be greater than 0.';
  if (num > max)  return `Cannot exceed $${max.toLocaleString()}.`;
  return '';
}

export function ParentFeesPage() {
  const { user } = useAuth();
  const { students, fees, payments, recordPayment, addToast } = useApp();

  const child      = students.find((s) => s.id === user?.studentId);
  const myFee      = fees.find((f) => f.studentId === user?.studentId);
  const myPayments = payments.filter((p) => p.feeId === myFee?.id);

  const balance = myFee ? myFee.amount - myFee.paid : 0;
  const paidPct = myFee ? Math.round((myFee.paid / myFee.amount) * 100) : 0;

  const [modal, setModal]           = useState<ModalState | null>(null);
  const [amtError, setAmtError]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (modal?.step === 'details') {
      setAmtError(validateAmount(modal.amount, balance));
    }
  }, [modal?.amount, modal?.step, balance]);

  function openPay(provider: 'urubuto' | 'bank') {
    if (!myFee || balance <= 0) return;
    setModal({
      fee: myFee,
      amount: String(balance),
      method: provider === 'urubuto' ? 'Mobile Money' : 'Bank Transfer',
      provider,
      studentId: child?.id ?? '',
      phone: child?.parentPhone ?? '0786341041',
      step: 'details',
      code: '',
      enteredCode: '',
      codeError: '',
    });
  }

  function closeModal() {
    setModal(null);
    setSubmitting(false);
    setAmtError('');
  }

  function sendSms() {
    if (!modal) return;
    const err = validateAmount(modal.amount, balance);
    setAmtError(err);
    if (err) return;
    if (!modal.studentId.trim()) return;

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setModal({ ...modal, step: 'sms', code: otp, enteredCode: '', codeError: '' });
    addToast({
      title: 'SMS Sent',
      message: `Confirmation code sent to ${modal.phone}`,
      variant: 'info',
    });
  }

  function confirmCode() {
    if (!modal) return;
    if (modal.enteredCode !== modal.code) {
      setModal({ ...modal, codeError: 'Incorrect code. Please check your SMS and try again.' });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const amt = parseFloat(modal.amount);
      recordPayment(modal.fee.id, amt, modal.method, user?.name ?? '');
      addToast({
        title: 'Payment Confirmed',
        message: `$${amt.toLocaleString()} paid successfully via ${modal.provider === 'urubuto' ? 'UrubutoPay' : 'Bank Transfer'}.`,
        variant: 'success',
      });
      setModal({ ...modal, step: 'done' });
      setSubmitting(false);
    }, 800);
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Fee &amp; Payments</h1>
          <p>{child ? `${child.firstName} ${child.lastName} — ${child.className}` : 'Your child'}</p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => addToast({ title: 'Receipt ready', message: 'Payment receipt downloaded.', variant: 'info' })}
        >
          <FiDownload className="me-1" /> Receipt
        </button>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Fee', value: `$${myFee?.amount.toLocaleString() ?? '—'}`, color: '#1a1f36' },
          { label: 'Paid',      value: `$${myFee?.paid.toLocaleString() ?? '—'}`,   color: '#20c997' },
          { label: 'Balance',   value: `$${balance.toLocaleString()}`,               color: balance > 0 ? '#dc3545' : '#20c997' },
          { label: 'Due Date',  value: myFee?.dueDate ?? '—',                        color: '#1a1f36' },
        ].map((c) => (
          <div className="col-6 col-md-3" key={c.label}>
            <div className="card shadow-sm text-center" style={{ padding: '1.25rem 1rem' }}>
              <div className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>{c.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      {balance > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header py-3">
            <h6 className="mb-0 fw-bold">Payment Methods</h6>
            <div className="text-muted small">Choose how you want to pay the outstanding balance</div>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* UrubutoPay */}
              <div className="col-md-6">
                <div
                  className="card h-100"
                  style={{ cursor: 'pointer', border: '2px solid #eef0f5', transition: 'border 0.2s' }}
                  onClick={() => openPay('urubuto')}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--school-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#eef0f5')}
                >
                  <div className="card-body d-flex align-items-start gap-3">
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#e8f5e9', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <FiSmartphone size={22} color="var(--school-primary)" />
                    </div>
                    <div>
                      <div className="fw-bold mb-1">UrubutoPay</div>
                      <div className="text-muted small">Fast Mobile Payment. Pay quickly and securely using your mobile phone. An SMS confirmation will be sent to your registered number.</div>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end" style={{ background: 'transparent' }}>
                    <button className="btn btn-primary btn-sm px-3" onClick={(e) => { e.stopPropagation(); openPay('urubuto'); }}>
                      Pay with UrubutoPay
                    </button>
                  </div>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="col-md-6">
                <div
                  className="card h-100"
                  style={{ cursor: 'pointer', border: '2px solid #eef0f5', transition: 'border 0.2s' }}
                  onClick={() => openPay('bank')}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--school-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#eef0f5')}
                >
                  <div className="card-body d-flex align-items-start gap-3">
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#e3f2fd', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <FiCreditCard size={22} color="#1976d2" />
                    </div>
                    <div>
                      <div className="fw-bold mb-1">Bank of Kigali</div>
                      <div className="text-muted small">Bank Transfer. Transfer directly from your bank account. Enter your student details and confirm via SMS to complete the payment.</div>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-end" style={{ background: 'transparent' }}>
                    <button className="btn btn-outline-primary btn-sm px-3" onClick={(e) => { e.stopPropagation(); openPay('bank'); }}>
                      Pay via Bank Transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">Payment Progress</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: paidPct === 100 ? '#20c997' : '#f2c14e' }}>{paidPct}%</span>
          </div>
          <div className="progress mb-3" style={{ height: 16, borderRadius: 10, background: '#e9ecef' }}>
            <div style={{
              width: `${Math.max(paidPct, 3)}%`,
              background: paidPct === 100 ? '#20c997' : 'linear-gradient(90deg,#f2c14e,#e0a800)',
              borderRadius: 10,
              transition: 'width 0.8s ease',
            }} />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="small text-muted">${myFee?.paid.toLocaleString()} paid of ${myFee?.amount.toLocaleString()}</span>
            {paidPct === 100
              ? <span className="badge bg-success px-3 py-2"><FiCheckCircle className="me-1" />Fully Paid</span>
              : <span className="badge bg-danger px-3 py-2">${balance.toLocaleString()} remaining</span>}
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="card shadow-sm mb-4">
        <div className="card-header py-3">
          <h6 className="mb-0 fw-bold">Payment History</h6>
        </div>
        {myPayments.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">
            <FiCreditCard size={36} className="mb-3 opacity-25" />
            <p className="mb-0">No payments recorded yet.</p>
          </div>
        ) : (
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th>Ref</th><th>Amount</th><th>Method</th><th>Paid By</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {myPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="text-muted small">{p.id}</td>
                    <td className="text-success fw-semibold">${p.amount.toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td>{p.paidBy}</td>
                    <td>{p.date}</td>
                    <td><span className="badge bg-success"><FiCheckCircle className="me-1" />Confirmed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Multi-step Payment Modal ── */}
      {modal && (
        <div className="pay-modal-backdrop" onClick={closeModal}>
          <div className="pay-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="pay-modal-header">
              <div>
                <h5 className="mb-0">
                  {modal.provider === 'urubuto' ? '📱 UrubutoPay' : '🏦 Bank of Kigali'}
                </h5>
                <p className="text-muted small mb-0">
                  {modal.step === 'details' && 'Enter your details to proceed'}
                  {modal.step === 'sms'     && 'SMS confirmation sent'}
                  {modal.step === 'done'    && 'Payment successful'}
                </p>
              </div>
              <button className="pay-modal-close" type="button" onClick={closeModal} aria-label="Close"><FiX /></button>
            </div>

            {/* Step indicator */}
            <div className="d-flex align-items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid #eef0f5' }}>
              {['details', 'sms', 'done'].map((s, i) => (
                <div key={s} className="d-flex align-items-center gap-2">
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center',
                    background: modal.step === s ? 'var(--school-primary)' : ['details','sms','done'].indexOf(modal.step) > i ? 'var(--school-primary)' : '#e9ecef',
                    color: ['details','sms','done'].indexOf(modal.step) >= i ? '#fff' : '#6c757d',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {['details','sms','done'].indexOf(modal.step) > i ? <FiCheck size={12} /> : i + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: modal.step === s ? 'var(--school-primary)' : '#6c757d', fontWeight: modal.step === s ? 700 : 400 }}>
                    {s === 'details' ? 'Details' : s === 'sms' ? 'Verify' : 'Done'}
                  </span>
                  {i < 2 && <div style={{ width: 24, height: 2, background: '#e9ecef', borderRadius: 2 }} />}
                </div>
              ))}
            </div>

            {/* ── Step 1: Details ── */}
            {modal.step === 'details' && (
              <div style={{ padding: '1.5rem' }}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Student ID</label>
                  <div className="input-group">
                    <span className="input-group-text"><FiUser size={14} /></span>
                    <input
                      className="form-control"
                      value={modal.studentId}
                      onChange={e => setModal({ ...modal, studentId: e.target.value })}
                      placeholder="e.g. STU-1001"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Phone Number (receives SMS)</label>
                  <div className="input-group">
                    <span className="input-group-text"><FiPhone size={14} /></span>
                    <input
                      className="form-control"
                      value={modal.phone}
                      onChange={e => setModal({ ...modal, phone: e.target.value })}
                      placeholder="e.g. 0786341041"
                    />
                  </div>
                  <div className="form-text">An SMS confirmation code will be sent to this number.</div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Amount to Pay ($)</label>
                  <input
                    className={`form-control form-control-lg ${amtError ? 'is-invalid' : ''}`}
                    type="number"
                    value={modal.amount}
                    onChange={e => setModal({ ...modal, amount: e.target.value })}
                    min={1}
                    max={balance}
                  />
                  {amtError && <div className="invalid-feedback"><FiAlertCircle size={12} className="me-1" />{amtError}</div>}
                  <div className="form-text">Outstanding: ${balance.toLocaleString()}</div>
                </div>

                <div className="pay-modal-summary mb-4">
                  <div className="pay-modal-summary-item"><span>Method</span><strong>{modal.provider === 'urubuto' ? 'UrubutoPay' : 'Bank of Kigali'}</strong></div>
                  <div className="pay-modal-summary-item"><span>Amount</span><strong className="text-primary">${parseFloat(modal.amount || '0').toLocaleString()}</strong></div>
                  <div className="pay-modal-summary-item"><span>Student</span><strong>{child?.firstName} {child?.lastName}</strong></div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary flex-fill" onClick={closeModal}>Cancel</button>
                  <button className="btn btn-primary flex-fill" onClick={sendSms} disabled={!!amtError || !modal.studentId.trim()}>
                    <FiMessageSquare className="me-2" /> Send SMS Code
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: SMS Verification ── */}
            {modal.step === 'sms' && (
              <div style={{ padding: '1.5rem' }}>
                <div className="text-center mb-4">
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5e9', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}>
                    <FiMessageSquare size={28} color="var(--school-primary)" />
                  </div>
                  <h6 className="fw-bold">Check your phone</h6>
                  <p className="text-muted small mb-0">
                    A 6-digit confirmation code was sent to<br />
                    <strong>{modal.phone}</strong>
                  </p>
                </div>

                {/* Show simulated code in dev */}
                <div className="alert alert-info small text-center py-2 mb-3">
                  <strong>Demo code:</strong> {modal.code}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Enter 6-digit code</label>
                  <input
                    className={`form-control form-control-lg text-center fw-bold ${modal.codeError ? 'is-invalid' : ''}`}
                    style={{ letterSpacing: '0.4em', fontSize: '1.5rem' }}
                    maxLength={6}
                    value={modal.enteredCode}
                    onChange={e => setModal({ ...modal, enteredCode: e.target.value.replace(/\D/g, ''), codeError: '' })}
                    placeholder="------"
                  />
                  {modal.codeError && <div className="invalid-feedback text-center">{modal.codeError}</div>}
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary flex-fill" onClick={() => setModal({ ...modal, step: 'details' })}>Back</button>
                  <button
                    className="btn btn-primary flex-fill"
                    onClick={confirmCode}
                    disabled={modal.enteredCode.length !== 6 || submitting}
                  >
                    {submitting
                      ? <><span className="spinner-border spinner-border-sm me-2" />Processing…</>
                      : <><FiCheckCircle className="me-2" />Confirm Payment</>}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Done ── */}
            {modal.step === 'done' && (
              <div style={{ padding: '2rem 1.5rem' }} className="text-center">
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e8f5e9', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}>
                  <FiCheckCircle size={36} color="var(--school-primary)" />
                </div>
                <h5 className="fw-bold mb-1">Payment Successful!</h5>
                <p className="text-muted mb-1">
                  <strong>${parseFloat(modal.amount).toLocaleString()}</strong> paid via {modal.provider === 'urubuto' ? 'UrubutoPay' : 'Bank of Kigali'}
                </p>
                <p className="text-muted small mb-4">A receipt has been sent to {modal.phone}</p>
                <button className="btn btn-primary px-5" onClick={closeModal}>
                  <FiCheck className="me-2" /> Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
