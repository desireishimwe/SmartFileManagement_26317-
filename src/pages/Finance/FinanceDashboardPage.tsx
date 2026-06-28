import { FormEvent, useState } from 'react';
import {
  FiAlertCircle, FiCheckCircle, FiCreditCard, FiDollarSign,
  FiDownload, FiTrendingUp, FiX,
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FeeRecord, PaymentMethod } from '../../types';

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Mobile Money'];

interface PayModalState {
  fee: FeeRecord;
  amount: string;
  method: PaymentMethod;
  paidBy: string;
}

export function FinanceDashboardPage() {
  const { user } = useAuth();
  const { fees, payments, recordPayment, addToast } = useApp();

  const [modal, setModal]       = useState<PayModalState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter]     = useState<'all' | 'unpaid' | 'partial' | 'paid'>('all');

  // Summary figures
  const totalExpected  = fees.reduce((s, f) => s + f.amount, 0);
  const totalCollected = fees.reduce((s, f) => s + f.paid, 0);
  const totalBalance   = totalExpected - totalCollected;
  const collectionRate = totalExpected ? Math.round((totalCollected / totalExpected) * 100) : 0;

  const paidCount    = fees.filter((f) => f.amount - f.paid <= 0).length;
  const partialCount = fees.filter((f) => f.paid > 0 && f.amount - f.paid > 0).length;
  const unpaidCount  = fees.filter((f) => f.paid === 0).length;

  const filtered = fees.filter((f) => {
    const bal = f.amount - f.paid;
    if (filter === 'paid')    return bal <= 0;
    if (filter === 'partial') return f.paid > 0 && bal > 0;
    if (filter === 'unpaid')  return f.paid === 0;
    return true;
  });

  function openModal(fee: FeeRecord) {
    setModal({ fee, amount: String(fee.amount - fee.paid), method: 'Cash', paidBy: fee.parentName });
  }

  function closeModal() { setModal(null); setSubmitting(false); }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!modal) return;
    const amt = parseFloat(modal.amount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    setTimeout(() => {
      recordPayment(modal.fee.id, amt, modal.method, modal.paidBy);
      addToast({ title: 'Payment recorded', message: `$${amt.toLocaleString()} for ${modal.fee.studentName} via ${modal.method}.`, variant: 'success' });
      closeModal();
    }, 500);
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Finance Dashboard</h1>
          <p>Welcome, {user?.name} — Finance Officer</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={() => addToast({ title: 'Report ready', message: 'Financial report exported.', variant: 'info' })}>
          <FiDownload className="me-1" /> Export Report
        </button>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-primary bg-opacity-10 text-primary"><FiDollarSign /></div>
              <div>
                <div className="text-muted small">Total Expected</div>
                <div className="fw-bold fs-5">${totalExpected.toLocaleString()}</div>
                <div className="text-muted x-small">{fees.length} students</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-success bg-opacity-10 text-success"><FiTrendingUp /></div>
              <div>
                <div className="text-muted small">Collected</div>
                <div className="fw-bold fs-5 text-success">${totalCollected.toLocaleString()}</div>
                <div className="text-muted x-small">{collectionRate}% of target</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-danger bg-opacity-10 text-danger"><FiAlertCircle /></div>
              <div>
                <div className="text-muted small">Outstanding</div>
                <div className="fw-bold fs-5 text-danger">${totalBalance.toLocaleString()}</div>
                <div className="text-muted x-small">{unpaidCount + partialCount} students owe</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-success bg-opacity-10 text-success"><FiCheckCircle /></div>
              <div>
                <div className="text-muted small">Fully Paid</div>
                <div className="fw-bold fs-5">{paidCount}</div>
                <div className="text-muted x-small">of {fees.length} students</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection progress */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">Fee Collection Progress</span>
            <span className="fw-bold text-success">{collectionRate}%</span>
          </div>
          <div className="progress mb-3" style={{ height: 14, borderRadius: 8 }}>
            <div className="progress-bar bg-success" style={{ width: `${collectionRate}%` }} />
          </div>
          <div className="d-flex gap-4 flex-wrap">
            <span className="small"><span className="badge bg-success me-1">{paidCount}</span> Fully paid</span>
            <span className="small"><span className="badge bg-warning text-dark me-1">{partialCount}</span> Partial</span>
            <span className="small"><span className="badge bg-danger me-1">{unpaidCount}</span> Unpaid</span>
          </div>
        </div>
      </div>

      {/* Fee records table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h6 className="mb-0 fw-bold">Student Fee Records</h6>
          <div className="btn-group btn-group-sm">
            {(['all', 'unpaid', 'partial', 'paid'] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Parent / Guardian</th>
                <th>Phone</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Due Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={9} className="text-center text-muted py-4">No records match this filter.</td></tr>
                : filtered.map((f) => {
                    const bal = f.amount - f.paid;
                    return (
                      <tr key={f.id}>
                        <td>
                          <div className="fw-semibold">{f.studentName}</div>
                          <div className="text-muted x-small">{f.className}</div>
                        </td>
                        <td>{f.parentName}</td>
                        <td className="text-muted small">{f.parentPhone}</td>
                        <td>${f.amount.toLocaleString()}</td>
                        <td className="text-success fw-semibold">${f.paid.toLocaleString()}</td>
                        <td className={bal > 0 ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>${bal.toLocaleString()}</td>
                        <td className="small">{f.dueDate}</td>
                        <td>
                          {bal <= 0
                            ? <span className="badge bg-success">Paid</span>
                            : f.paid > 0
                              ? <span className="badge bg-warning text-dark">Partial</span>
                              : <span className="badge bg-danger">Unpaid</span>}
                        </td>
                        <td>
                          {bal > 0
                            ? <button className="btn btn-sm btn-primary" onClick={() => openModal(f)}><FiCreditCard className="me-1" />Pay</button>
                            : <FiCheckCircle className="text-success" />}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom py-3">
            <h6 className="mb-0 fw-bold">Payment History</h6>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th>Ref</th><th>Student</th><th>Amount</th><th>Method</th><th>Paid By</th><th>Date</th></tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="text-muted small">{p.id}</td>
                    <td className="fw-semibold">{p.studentName}</td>
                    <td className="text-success fw-semibold">${p.amount.toLocaleString()}</td>
                    <td>{p.method}</td>
                    <td>{p.paidBy}</td>
                    <td>{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {modal && (
        <div className="pay-modal-backdrop" onClick={closeModal}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pay-modal-header">
              <div>
                <h5 className="mb-0">Record Payment</h5>
                <p className="text-muted small mb-0">{modal.fee.studentName} — {modal.fee.className}</p>
              </div>
              <button className="pay-modal-close" type="button" onClick={closeModal} aria-label="Close"><FiX /></button>
            </div>
            <div className="pay-modal-summary">
              <div className="pay-modal-summary-item"><span>Total Fee</span><strong>${modal.fee.amount.toLocaleString()}</strong></div>
              <div className="pay-modal-summary-item"><span>Paid</span><strong className="text-success">${modal.fee.paid.toLocaleString()}</strong></div>
              <div className="pay-modal-summary-item"><span>Outstanding</span><strong className="text-danger">${(modal.fee.amount - modal.fee.paid).toLocaleString()}</strong></div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-3 px-0" style={{ padding: '0 1.5rem' }}>
                <label className="form-label fw-semibold">Paid By (Parent / Guardian)</label>
                <input className="form-control" value={modal.paidBy} onChange={(e) => setModal({ ...modal, paidBy: e.target.value })} required />
              </div>
              <div className="mb-3" style={{ padding: '0 1.5rem' }}>
                <label className="form-label fw-semibold">Payment Method</label>
                <div className="pay-method-group">
                  {PAYMENT_METHODS.map((m) => (
                    <button key={m} type="button" className={`pay-method-btn ${modal.method === m ? 'active' : ''}`} onClick={() => setModal({ ...modal, method: m })}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="mb-4" style={{ padding: '0 1.5rem' }}>
                <label className="form-label fw-semibold">Amount ($)</label>
                <input className="form-control form-control-lg" type="number" min={1} max={modal.fee.amount - modal.fee.paid} value={modal.amount} onChange={(e) => setModal({ ...modal, amount: e.target.value })} required />
                <div className="form-text">Max: ${(modal.fee.amount - modal.fee.paid).toLocaleString()}</div>
              </div>
              <div className="d-flex gap-2" style={{ padding: '0 1.5rem 1.5rem' }}>
                <button type="button" className="btn btn-outline-secondary flex-fill" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-fill" disabled={submitting}>
                  {submitting ? 'Processing…' : <><FiCreditCard className="me-2" />Confirm Payment</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
