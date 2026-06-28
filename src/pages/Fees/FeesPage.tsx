import { FormEvent, useState } from 'react';
import { FiCheckCircle, FiCreditCard, FiDownload, FiPhone, FiUser, FiX } from 'react-icons/fi';
import { DataTable } from '../../components/Tables/DataTable';
import { useApp } from '../../context/AppContext';
import { FeeRecord, PaymentMethod } from '../../types';

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Mobile Money'];

interface PayModalState {
  fee: FeeRecord;
  amount: string;
  method: PaymentMethod;
  paidBy: string;
}

export function FeesPage() {
  const { fees, payments, recordPayment, addToast } = useApp();
  const [modal, setModal] = useState<PayModalState | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const outstanding = fees.reduce((sum, f) => sum + (f.amount - f.paid), 0);

  function openModal(fee: FeeRecord) {
    setModal({
      fee,
      amount: String(fee.amount - fee.paid),
      method: 'Cash',
      paidBy: fee.parentName,
    });
  }

  function closeModal() {
    setModal(null);
    setSubmitting(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!modal) return;
    const amt = parseFloat(modal.amount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    setTimeout(() => {
      recordPayment(modal.fee.id, amt, modal.method, modal.paidBy);
      addToast({
        title: 'Payment recorded',
        message: `$${amt.toLocaleString()} paid for ${modal.fee.studentName} via ${modal.method}.`,
        variant: 'success',
      });
      closeModal();
    }, 600);
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Fee Management</h1>
          <p>Record payments, review balances, and track payment history.</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={() => addToast({ title: 'Report ready', message: 'Fee report exported.', variant: 'info' })}>
          <FiDownload className="me-1" /> Fee Report
        </button>
      </div>

      {/* Summary bar */}
      <div className="alert alert-warning d-flex justify-content-between align-items-center mb-4">
        <span>Total Outstanding Balances: <strong>${outstanding.toLocaleString()}</strong></span>
        <span className="text-muted small">{fees.filter(f => f.amount - f.paid > 0).length} student(s) with unpaid balance</span>
      </div>

      {/* Fees table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom py-3">
          <h6 className="mb-0 fw-bold">Student Fee Records</h6>
        </div>
        <div className="card-body p-0">
          <DataTable
            rows={fees}
            columns={[
              {
                key: 'student', title: 'Student',
                render: (f) => (
                  <div>
                    <div className="fw-semibold">{f.studentName}</div>
                    <div className="text-muted x-small">{f.className}</div>
                  </div>
                ),
              },
              {
                key: 'parent', title: 'Parent / Guardian',
                render: (f) => (
                  <div>
                    <div className="small">{f.parentName}</div>
                    <div className="text-muted x-small">{f.parentPhone}</div>
                  </div>
                ),
              },
              { key: 'amount', title: 'Total Fee', render: (f) => `$${f.amount.toLocaleString()}` },
              { key: 'paid',   title: 'Paid',      render: (f) => <span className="text-success fw-semibold">${f.paid.toLocaleString()}</span> },
              {
                key: 'balance', title: 'Balance',
                render: (f) => {
                  const bal = f.amount - f.paid;
                  return <span className={bal > 0 ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>${bal.toLocaleString()}</span>;
                },
              },
              { key: 'due',    title: 'Due Date',  render: (f) => f.dueDate },
              {
                key: 'status', title: 'Status',
                render: (f) => {
                  const bal = f.amount - f.paid;
                  if (bal <= 0) return <span className="badge bg-success">Paid</span>;
                  if (f.paid > 0) return <span className="badge bg-warning text-dark">Partial</span>;
                  return <span className="badge bg-danger">Unpaid</span>;
                },
              },
              {
                key: 'action', title: '',
                render: (f) => {
                  const bal = f.amount - f.paid;
                  return bal > 0
                    ? <button className="btn btn-sm btn-primary" onClick={() => openModal(f)}><FiCreditCard className="me-1" />Pay</button>
                    : <span className="text-success small"><FiCheckCircle className="me-1" />Cleared</span>;
                },
              },
            ]}
          />
        </div>
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom py-3">
            <h6 className="mb-0 fw-bold">Payment History</h6>
          </div>
          <div className="card-body p-0">
            <DataTable
              rows={payments}
              columns={[
                { key: 'id',          title: 'Ref',       render: (p) => <span className="text-muted small">{p.id}</span> },
                { key: 'student',     title: 'Student',   render: (p) => <span className="fw-semibold">{p.studentName}</span> },
                { key: 'amount',      title: 'Amount',    render: (p) => <span className="text-success fw-semibold">${p.amount.toLocaleString()}</span> },
                { key: 'method',      title: 'Method',    render: (p) => p.method },
                { key: 'paidBy',      title: 'Paid By',   render: (p) => p.paidBy },
                { key: 'date',        title: 'Date',      render: (p) => p.date },
              ]}
            />
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

            {/* Balance summary */}
            <div className="pay-modal-summary">
              <div className="pay-modal-summary-item">
                <span>Total Fee</span>
                <strong>${modal.fee.amount.toLocaleString()}</strong>
              </div>
              <div className="pay-modal-summary-item">
                <span>Already Paid</span>
                <strong className="text-success">${modal.fee.paid.toLocaleString()}</strong>
              </div>
              <div className="pay-modal-summary-item">
                <span>Outstanding</span>
                <strong className="text-danger">${(modal.fee.amount - modal.fee.paid).toLocaleString()}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Parent info (read-only display) */}
              <div className="pay-modal-parent-row">
                <FiUser className="text-muted" />
                <span>{modal.fee.parentName}</span>
                <FiPhone className="text-muted ms-3" />
                <span>{modal.fee.parentPhone}</span>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Paid By (Parent / Guardian)</label>
                <input
                  className="form-control"
                  value={modal.paidBy}
                  onChange={(e) => setModal({ ...modal, paidBy: e.target.value })}
                  placeholder="Parent name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Payment Method</label>
                <div className="pay-method-group">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`pay-method-btn ${modal.method === m ? 'active' : ''}`}
                      onClick={() => setModal({ ...modal, method: m })}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Amount to Pay ($)</label>
                <input
                  className="form-control form-control-lg"
                  type="number"
                  min={1}
                  max={modal.fee.amount - modal.fee.paid}
                  value={modal.amount}
                  onChange={(e) => setModal({ ...modal, amount: e.target.value })}
                  required
                />
                <div className="form-text">Maximum: ${(modal.fee.amount - modal.fee.paid).toLocaleString()}</div>
              </div>

              <div className="d-flex gap-2">
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
