import { FormEvent, useEffect, useState } from 'react';
import {
  FiAlertCircle, FiCheck, FiCheckCircle, FiCreditCard,
  FiDownload, FiPhone, FiUser, FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { FeeRecord, PaymentMethod } from '../../types';

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Mobile Money'];

interface ModalState {
  fee: FeeRecord;
  amount: string;
  method: PaymentMethod;
}

interface FieldErrors {
  amount?: string;
  method?: string;
}

function validateAmount(value: string, max: number): string {
  if (!value.trim()) return 'Amount is required.';
  const num = parseFloat(value);
  if (isNaN(num))  return 'Please enter a valid number.';
  if (num <= 0)    return 'Amount must be greater than $0.';
  if (num > max)   return `Amount cannot exceed $${max.toLocaleString()}.`;
  return '';
}

export function ParentFeesPage() {
  const { user }  = useAuth();
  const { students, fees, payments, recordPayment, addToast } = useApp();

  const child      = students.find((s) => s.id === user?.studentId);
  const myFee      = fees.find((f) => f.studentId === user?.studentId);
  const myPayments = payments.filter((p) => p.feeId === myFee?.id);

  const balance = myFee ? myFee.amount - myFee.paid : 0;
  const paidPct = myFee ? Math.round((myFee.paid / myFee.amount) * 100) : 0;

  // ── Modal state ──
  const [modal, setModal]             = useState<ModalState | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);   // tracks first submit attempt
  const [touched, setTouched]         = useState(false);   // amount field touched
  const [errors, setErrors]           = useState<FieldErrors>({});
  const [amountValid, setAmountValid] = useState(false);

  // Automatic (real-time) validation — runs whenever amount changes after first touch
  useEffect(() => {
    if (!modal) return;
    if (!touched && !submitted) { setErrors({}); setAmountValid(false); return; }
    const err = validateAmount(modal.amount, balance);
    setErrors((prev) => ({ ...prev, amount: err }));
    setAmountValid(err === '');
  }, [modal?.amount, touched, submitted, balance]);

  function openPay() {
    if (!myFee || balance <= 0) return;
    setModal({ fee: myFee, amount: String(balance), method: 'Cash' });
    setSubmitted(false);
    setTouched(false);
    setErrors({});
    setAmountValid(true); // pre-filled value is valid
  }

  function closeModal() {
    setModal(null);
    setSubmitting(false);
    setSubmitted(false);
    setTouched(false);
    setErrors({});
  }

  function handleAmountChange(value: string) {
    setModal((m) => m ? { ...m, amount: value } : m);
    setTouched(true);
  }

  // Manual validation on submit
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setSubmitted(true);

    const amtErr = validateAmount(modal.amount, balance);
    setErrors({ amount: amtErr });
    setAmountValid(amtErr === '');

    if (amtErr) return; // block submission if invalid

    const amt = parseFloat(modal.amount);
    setSubmitting(true);
    setTimeout(() => {
      recordPayment(modal.fee.id, amt, modal.method, user?.name ?? '');
      addToast({
        title: 'Payment successful',
        message: `$${amt.toLocaleString()} paid via ${modal.method}.`,
        variant: 'success',
      });
      closeModal();
    }, 600);
  }

  const showAmountError = (touched || submitted) && !!errors.amount;
  const showAmountOk    = (touched || submitted) && amountValid;

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Fee & Payments</h1>
          <p>{child ? `${child.firstName} ${child.lastName} — ${child.className}` : 'Your child'}</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => addToast({ title: 'Receipt ready', message: 'Payment receipt downloaded.', variant: 'info' })}
          >
            <FiDownload className="me-1" /> Receipt
          </button>
          {balance > 0 && (
            <button className="btn btn-primary" onClick={openPay}>
              <FiCreditCard className="me-2" /> Pay Now
            </button>
          )}
        </div>
      </div>

      {/* Fee summary cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Fee',  value: `$${myFee?.amount.toLocaleString() ?? '—'}`, cls: '' },
          { label: 'Paid',       value: `$${myFee?.paid.toLocaleString() ?? '—'}`,   cls: 'text-success' },
          { label: 'Balance',    value: `$${balance.toLocaleString()}`,               cls: balance > 0 ? 'text-danger' : 'text-success' },
          { label: 'Due Date',   value: myFee?.dueDate ?? '—',                        cls: '' },
        ].map((c) => (
          <div className="col-6 col-md-3" key={c.label}>
            <div className="card border-0 shadow-sm text-center p-3">
              <div className="text-muted small mb-1">{c.label}</div>
              <div className={`fw-bold fs-5 ${c.cls}`}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">Payment Progress</span>
            <span className={`fw-bold ${paidPct === 100 ? 'text-success' : 'text-warning'}`}>{paidPct}%</span>
          </div>
          <div className="progress mb-2" style={{ height: 14, borderRadius: 8 }}>
            <div
              className={`progress-bar ${paidPct === 100 ? 'bg-success' : paidPct > 0 ? 'bg-warning' : 'bg-danger'}`}
              style={{ width: `${Math.max(paidPct, 3)}%`, transition: 'width 0.6s ease' }}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <span className="small text-muted">${myFee?.paid.toLocaleString()} paid of ${myFee?.amount.toLocaleString()}</span>
            {paidPct === 100
              ? <span className="badge bg-success"><FiCheckCircle className="me-1" />Fully Paid</span>
              : <span className="badge bg-danger">${balance.toLocaleString()} remaining</span>}
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom py-3">
          <h6 className="mb-0 fw-bold">Payment History</h6>
        </div>
        {myPayments.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">
            <FiCreditCard size={32} className="mb-2 opacity-50" />
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

      {balance > 0 && (
        <div className="text-center">
          <button className="btn btn-primary btn-lg px-5" onClick={openPay}>
            <FiCreditCard className="me-2" /> Pay ${balance.toLocaleString()} Now
          </button>
        </div>
      )}

      {/* ── Payment Modal ── */}
      {modal && (
        <div className="pay-modal-backdrop" onClick={closeModal}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pay-modal-header">
              <div>
                <h5 className="mb-0">Pay School Fees</h5>
                <p className="text-muted small mb-0">{child?.firstName} {child?.lastName} — {child?.className}</p>
              </div>
              <button className="pay-modal-close" type="button" onClick={closeModal} aria-label="Close"><FiX /></button>
            </div>

            <div className="pay-modal-summary">
              <div className="pay-modal-summary-item"><span>Total Fee</span><strong>${modal.fee.amount.toLocaleString()}</strong></div>
              <div className="pay-modal-summary-item"><span>Already Paid</span><strong className="text-success">${modal.fee.paid.toLocaleString()}</strong></div>
              <div className="pay-modal-summary-item"><span>Outstanding</span><strong className="text-danger">${balance.toLocaleString()}</strong></div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ padding: '1.25rem 1.5rem 0' }}>

                {/* Parent info row */}
                <div className="pay-modal-parent-row mb-3">
                  <FiUser className="text-muted" />
                  <span className="fw-semibold">{user?.name}</span>
                  <FiPhone className="text-muted ms-2" />
                  <span>{child?.parentPhone}</span>
                </div>

                {/* Payment method — always valid once selected */}
                <div className="mb-3">
                  <label className="form-label fw-semibold d-flex align-items-center gap-2">
                    Payment Method
                    <FiCheck size={14} className="text-success" />
                  </label>
                  <div className="pay-method-group">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m} type="button"
                        className={`pay-method-btn ${modal.method === m ? 'active' : ''}`}
                        onClick={() => setModal({ ...modal, method: m })}
                      >
                        {modal.method === m && <FiCheck className="me-1" size={13} />}
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="pv-field-ok mt-1">
                    <FiCheckCircle size={13} /> {modal.method} selected
                  </div>
                </div>

                {/* Amount — full real-time + manual validation */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Amount to Pay ($)
                    {showAmountOk && <FiCheck size={14} className="text-success ms-2" />}
                  </label>
                  <div className="pv-input-wrap">
                    <input
                      className={`form-control form-control-lg ${showAmountError ? 'is-invalid' : showAmountOk ? 'is-valid' : ''}`}
                      type="number"
                      min={1}
                      max={balance}
                      value={modal.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      onBlur={() => setTouched(true)}
                      placeholder="0"
                      required
                    />
                    {showAmountOk && (
                      <span className="pv-icon-ok"><FiCheckCircle /></span>
                    )}
                    {showAmountError && (
                      <span className="pv-icon-err"><FiAlertCircle /></span>
                    )}
                  </div>

                  {/* Automatic validation message (live) */}
                  {showAmountError && (
                    <div className="pv-error-msg">
                      <FiAlertCircle size={13} /> {errors.amount}
                    </div>
                  )}

                  {/* Success hint */}
                  {showAmountOk && (
                    <div className="pv-ok-msg">
                      <FiCheckCircle size={13} /> Valid amount — ${parseFloat(modal.amount).toLocaleString()} will be charged.
                    </div>
                  )}

                  {/* Always-visible range hint */}
                  {!showAmountError && !showAmountOk && (
                    <div className="form-text">Enter between $1 and ${balance.toLocaleString()}</div>
                  )}
                </div>
              </div>

              {/* Submit row */}
              <div className="d-flex gap-2" style={{ padding: '0 1.5rem 1.5rem' }}>
                <button type="button" className="btn btn-outline-secondary flex-fill" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-fill" disabled={submitting}>
                  {submitting
                    ? <><span className="spinner-border spinner-border-sm me-2" />Processing…</>
                    : <><FiCreditCard className="me-2" />Confirm Payment</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
