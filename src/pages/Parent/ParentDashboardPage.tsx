import { FormEvent, useState } from 'react';
import {
  FiAlertCircle, FiAward, FiBarChart2, FiCheckCircle,
  FiCreditCard, FiPhone, FiUser, FiX, FiXCircle,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { FeeRecord, PaymentMethod } from '../../types';

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Mobile Money'];

export function ParentDashboardPage() {
  const { user } = useAuth();
  const { students, attendance, results, fees, payments, recordPayment, addToast } = useApp();

  const child      = students.find((s) => s.id === user?.studentId);
  const myFee      = fees.find((f) => f.studentId === user?.studentId);
  const myAttend   = attendance.filter((a) => a.studentId === user?.studentId);
  const myResults  = results.filter((r) => r.studentId === user?.studentId);
  const myPayments = payments.filter((p) => p.feeId === myFee?.id);

  const presentDays = myAttend.filter((a) => a.status === 'Present').length;
  const absentDays  = myAttend.filter((a) => a.status === 'Absent').length;
  const balance     = myFee ? myFee.amount - myFee.paid : 0;
  const avgMarks    = myResults.length
    ? (myResults.reduce((s, r) => s + r.marks, 0) / myResults.length).toFixed(1)
    : '—';

  const [modal, setModal]         = useState<{ fee: FeeRecord; amount: string; method: PaymentMethod } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openPay() {
    if (!myFee) return;
    setModal({ fee: myFee, amount: String(balance), method: 'Cash' });
  }

  function closePay() { setModal(null); setSubmitting(false); }

  function handlePay(e: FormEvent) {
    e.preventDefault();
    if (!modal) return;
    const amt = parseFloat(modal.amount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    setTimeout(() => {
      recordPayment(modal.fee.id, amt, modal.method, user?.name ?? '');
      addToast({ title: 'Payment successful', message: `$${amt.toLocaleString()} paid via ${modal.method}.`, variant: 'success' });
      closePay();
    }, 500);
  }

  if (!child) {
    return (
      <div className="alert alert-warning mt-4">
        No student record linked to your account. Please contact the school office.
      </div>
    );
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Parent Portal</h1>
          <p>Monitoring {child.firstName} {child.lastName} — {child.className}</p>
        </div>
        {balance > 0 && (
          <button className="btn btn-primary" onClick={openPay}>
            <FiCreditCard className="me-2" /> Pay Fees Now
          </button>
        )}
      </div>

      {/* Outstanding fee alert banner */}
      {balance > 0 && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-4">
          <FiAlertCircle />
          <span>
            Your child has an outstanding fee balance of <strong>${balance.toLocaleString()}</strong> due by {myFee?.dueDate}.
            <button className="btn btn-sm btn-warning ms-3" onClick={openPay}>Pay Now</button>
          </span>
        </div>
      )}

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'DAYS PRESENT',   value: presentDays,    sub: `${absentDays} absent`,      icon: <FiCheckCircle />, color: '#20c997', bg: '#d1f5ec' },
          { label: 'AVERAGE MARKS',  value: avgMarks,       sub: `${myResults.length} subjects`, icon: <FiBarChart2 />,  color: '#0d6efd', bg: '#dce8ff' },
          { label: 'FEE BALANCE',    value: `$${balance.toLocaleString()}`, sub: balance <= 0 ? 'Fully paid ✓' : `Due ${myFee?.dueDate}`, icon: <FiCreditCard />, color: balance > 0 ? '#dc3545' : '#20c997', bg: balance > 0 ? '#fde8ea' : '#d1f5ec' },
          { label: 'TOP MARK',       value: myResults.length ? Math.max(...myResults.map(r => r.marks)) : '—', sub: myResults.find(r => r.marks === Math.max(...myResults.map(x => x.marks)))?.subject ?? '', icon: <FiAward />, color: '#fd7e14', bg: '#fdecd8' },
        ].map(({ label, value, sub, icon, color, bg }) => (
          <div className="col-6 col-lg-3" key={label}>
            <div className="card border-0 shadow-sm h-100" style={{ borderTop: `3px solid ${color}` }}>
              <div className="card-body px-3 py-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: '#6c757d' }}>{label}</span>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: bg, color, display: 'grid', placeItems: 'center', fontSize: '0.95rem' }}>{icon}</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, color: '#1a1f36' }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: 4 }}>{sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Child profile */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
              <FiUser className="text-primary" />
              <h6 className="mb-0 fw-bold">Child Profile</h6>
            </div>
            <div className="card-body text-center pt-4">
              <img src={child.profilePhoto} alt={child.firstName} className="avatar-lg mb-3" />
              <h5 className="fw-bold mb-1">{child.firstName} {child.lastName}</h5>
              <span className="badge bg-primary mb-3">{child.className}</span>
              <table className="table table-sm text-start mt-2">
                <tbody>
                  <tr><td className="text-muted">Student ID</td><td className="small fw-semibold">{child.id}</td></tr>
                  <tr><td className="text-muted">Email</td><td className="small">{child.email}</td></tr>
                  <tr><td className="text-muted">Date of Birth</td><td>{child.dateOfBirth}</td></tr>
                  <tr><td className="text-muted">Gender</td><td>{child.gender}</td></tr>
                  <tr><td className="text-muted">Address</td><td className="small">{child.address}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact the school */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
              <FiPhone className="text-success" />
              <h6 className="mb-0 fw-bold">School Contact</h6>
            </div>
            <div className="card-body small">
              <div className="mb-2"><strong>Main Office:</strong> +1 555 0100</div>
              <div className="mb-2"><strong>Email:</strong> office@nuvision.edu</div>
              <div><strong>Hours:</strong> Mon–Fri, 7:30am – 4:00pm</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          {/* Academic results */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
              <FiBarChart2 className="text-primary" />
              <h6 className="mb-0 fw-bold">Academic Results</h6>
            </div>
            {myResults.length === 0
              ? <div className="card-body text-muted">No results recorded yet.</div>
              : (
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr><th>Subject</th><th>Marks</th><th>GPA</th><th>Grade</th><th>Remarks</th></tr>
                    </thead>
                    <tbody>
                      {myResults.map((r) => (
                        <tr key={r.id}>
                          <td className="fw-semibold">{r.subject}</td>
                          <td><span className={r.marks >= 80 ? 'text-success fw-bold' : r.marks >= 60 ? 'text-warning fw-bold' : 'text-danger fw-bold'}>{r.marks}</span></td>
                          <td>{r.gpa.toFixed(1)}</td>
                          <td><span className={`badge ${r.marks >= 80 ? 'bg-success' : r.marks >= 60 ? 'bg-warning text-dark' : 'bg-danger'}`}>{r.marks >= 80 ? 'A' : r.marks >= 60 ? 'B' : 'C'}</span></td>
                          <td className="small text-muted">{r.marks >= 80 ? 'Excellent' : r.marks >= 60 ? 'Good' : 'Needs improvement'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>

          {/* Attendance */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
              <FiCheckCircle className="text-success" />
              <h6 className="mb-0 fw-bold">Attendance Record</h6>
            </div>
            {myAttend.length === 0
              ? <div className="card-body text-muted">No attendance records yet.</div>
              : (
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr><th>Date</th><th>Class</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {myAttend.map((a) => (
                        <tr key={a.id}>
                          <td>{a.date}</td>
                          <td>{a.className}</td>
                          <td>
                            {a.status === 'Present'
                              ? <span className="text-success d-flex align-items-center gap-1"><FiCheckCircle size={14} /> Present</span>
                              : <span className="text-danger d-flex align-items-center gap-1"><FiXCircle size={14} /> Absent</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>

          {/* Fee status + payment history */}
          {myFee && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <FiCreditCard className="text-primary" />
                  <h6 className="mb-0 fw-bold">Fee Statement</h6>
                </div>
                {balance > 0 && (
                  <button className="btn btn-sm btn-primary" onClick={openPay}>
                    <FiCreditCard className="me-1" /> Pay Now
                  </button>
                )}
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3 text-center">
                  <div className="col-4">
                    <div className="text-muted small">Total Fee</div>
                    <div className="fw-bold">${myFee.amount.toLocaleString()}</div>
                  </div>
                  <div className="col-4">
                    <div className="text-muted small">Paid</div>
                    <div className="fw-bold text-success">${myFee.paid.toLocaleString()}</div>
                  </div>
                  <div className="col-4">
                    <div className="text-muted small">Balance</div>
                    <div className={`fw-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>${balance.toLocaleString()}</div>
                  </div>
                </div>
                <div className="progress mb-2" style={{ height: 10, borderRadius: 6 }}>
                  <div className="progress-bar bg-success" style={{ width: `${Math.round((myFee.paid / myFee.amount) * 100)}%` }} />
                </div>
                <div className="text-muted small mb-3">{Math.round((myFee.paid / myFee.amount) * 100)}% paid — Due: {myFee.dueDate}</div>

                {myPayments.length > 0 && (
                  <>
                    <h6 className="fw-bold mt-3 mb-2">Payment History</h6>
                    <table className="table table-sm table-hover mb-0">
                      <thead className="table-light">
                        <tr><th>Ref</th><th>Amount</th><th>Method</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                        {myPayments.map((p) => (
                          <tr key={p.id}>
                            <td className="text-muted small">{p.id}</td>
                            <td className="text-success fw-semibold">${p.amount.toLocaleString()}</td>
                            <td>{p.method}</td>
                            <td>{p.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pay modal */}
      {modal && (
        <div className="pay-modal-backdrop" onClick={closePay}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pay-modal-header">
              <div>
                <h5 className="mb-0">Pay School Fees</h5>
                <p className="text-muted small mb-0">For {child.firstName} {child.lastName} — {child.className}</p>
              </div>
              <button className="pay-modal-close" type="button" onClick={closePay} aria-label="Close"><FiX /></button>
            </div>
            <div className="pay-modal-summary">
              <div className="pay-modal-summary-item"><span>Total Fee</span><strong>${modal.fee.amount.toLocaleString()}</strong></div>
              <div className="pay-modal-summary-item"><span>Already Paid</span><strong className="text-success">${modal.fee.paid.toLocaleString()}</strong></div>
              <div className="pay-modal-summary-item"><span>Outstanding</span><strong className="text-danger">${balance.toLocaleString()}</strong></div>
            </div>
            <form onSubmit={handlePay}>
              <div style={{ padding: '1.25rem 1.5rem 0' }}>
                {/* Parent info */}
                <div className="pay-modal-parent-row mb-3">
                  <FiUser className="text-muted" />
                  <span className="fw-semibold">{user?.name}</span>
                  <FiPhone className="text-muted ms-2" />
                  <span>{child.parentPhone}</span>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Payment Method</label>
                  <div className="pay-method-group">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m} type="button"
                        className={`pay-method-btn ${modal.method === m ? 'active' : ''}`}
                        onClick={() => setModal({ ...modal, method: m })}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Amount to Pay ($)</label>
                  <input className="form-control form-control-lg" type="number" min={1} max={balance}
                    value={modal.amount} onChange={(e) => setModal({ ...modal, amount: e.target.value })} required />
                  <div className="form-text">Outstanding balance: ${balance.toLocaleString()}</div>
                </div>
              </div>
              <div className="d-flex gap-2" style={{ padding: '0 1.5rem 1.5rem' }}>
                <button type="button" className="btn btn-outline-secondary flex-fill" onClick={closePay}>Cancel</button>
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
