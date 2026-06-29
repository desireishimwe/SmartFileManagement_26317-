import { useState } from 'react';
import {
  FiCheck, FiCamera, FiX, FiPackage, FiPlus, FiTrash2,
  FiCheckCircle, FiClock, FiAlertCircle, FiClipboard,
} from 'react-icons/fi';
import { SummaryCard } from '../../components/Cards/SummaryCard';
import { DataTable } from '../../components/Tables/DataTable';
import { useApp } from '../../context/AppContext';
import { StudentClearanceRecord } from '../../types';

export function AdminClearancePage() {
  const {
    clearances, requiredItems, approveClearance, rejectClearance,
    requestClearancePhoto, addRequiredItem, removeRequiredItem, addToast,
  } = useApp();

  const [selected, setSelected] = useState<StudentClearanceRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [filter, setFilter] = useState<string>('SUBMITTED');
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, description: '' });
  const [showItems, setShowItems] = useState(false);

  const filtered = filter === 'ALL'
    ? clearances
    : clearances.filter((c) => c.status === filter);

  const stats = {
    approved: clearances.filter((c) => c.status === 'APPROVED').length,
    pending: clearances.filter((c) => c.status === 'SUBMITTED').length,
    rejected: clearances.filter((c) => c.status === 'REJECTED').length,
  };

  function handleApprove(id: string) {
    approveClearance(id);
    addToast({ title: 'Clearance approved', message: 'QR pass generated for parent.', variant: 'success' });
    setSelected(null);
  }

  function handleReject(id: string) {
    rejectClearance(id, rejectReason || 'Rejected by admin');
    addToast({ title: 'Clearance rejected', message: 'Parent has been notified.', variant: 'info' });
    setSelected(null);
    setRejectReason('');
  }

  function handleRequestPhoto(id: string) {
    requestClearancePhoto(id);
    addToast({ title: 'Photo requested', message: 'Parent notified to retake photos.', variant: 'info' });
    setSelected(null);
  }

  return (
    <div className="clearance-page">
      <div className="page-heading">
        <div>
          <h1>Boarding Clearance</h1>
          <p>Review back-to-school item check-ups and manage required boarding lists.</p>
        </div>
        <button
          type="button"
          className={`btn btn-sm ${showItems ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setShowItems(!showItems)}
        >
          <FiPackage className="me-1" /> Required Items
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <SummaryCard title="Approved" value={String(stats.approved)} note="Ready for gate entry" icon={FiCheckCircle} variant="success" />
        </div>
        <div className="col-sm-4">
          <SummaryCard title="Pending Review" value={String(stats.pending)} note="Awaiting your action" icon={FiClock} variant="warning" />
        </div>
        <div className="col-sm-4">
          <SummaryCard title="Rejected" value={String(stats.rejected)} note="Sent back to parents" icon={FiAlertCircle} variant="danger" />
        </div>
      </div>

      {showItems && (
        <div className="card clearance-items-panel border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom d-flex align-items-center gap-2">
            <FiClipboard className="text-success" />
            <h6 className="mb-0 fw-bold">Required Items Checklist</h6>
          </div>
          <div className="card-body">
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <input className="form-control form-control-sm" placeholder="Item name" value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="col-md-2">
                <input type="number" className="form-control form-control-sm" min={1} value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) || 1 })} />
              </div>
              <div className="col-md-4">
                <input className="form-control form-control-sm" placeholder="Description (optional)" value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
              </div>
              <div className="col-md-2">
                <button type="button" className="btn btn-primary btn-sm w-100" disabled={!newItem.name}
                  onClick={() => {
                    const name = newItem.name;
                    addRequiredItem(newItem);
                    setNewItem({ name: '', quantity: 1, description: '' });
                    addToast({ title: 'Item added', message: `${name} added to checklist.`, variant: 'success' });
                  }}>
                  <FiPlus className="me-1" /> Add
                </button>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {requiredItems.map((item) => (
                <span key={item.id} className="clearance-item-chip">
                  {item.name} <span className="text-muted">×{item.quantity}</span>
                  <button type="button" className="btn btn-link btn-sm text-danger p-0 ms-1" onClick={() => removeRequiredItem(item.id)} aria-label="Remove">
                    <FiTrash2 size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="clearance-filter-pills">
        {['SUBMITTED', 'APPROVED', 'REJECTED', 'PHOTO_REQUESTED', 'ALL'].map((s) => (
          <button
            key={s}
            type="button"
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter(s)}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="clearance-empty-state">
          <div className="empty-icon"><FiClipboard /></div>
          <h6 className="fw-bold">No submissions yet</h6>
          <p className="text-muted small mb-0">Parents complete clearance from their portal. Submissions appear here for review.</p>
        </div>
      ) : (
        <DataTable
          rows={filtered}
          pageSize={8}
          emptyMessage="No clearance submissions."
          columns={[
            { key: 'clearanceNumber', title: 'Clearance ID', render: (row) => <span className="fw-semibold text-success">{row.clearanceNumber}</span> },
            { key: 'studentName', title: 'Student', render: (row) => row.studentName },
            { key: 'className', title: 'Class', render: (row) => <span className="badge bg-success-subtle text-success">{row.className}</span> },
            {
              key: 'status',
              title: 'Status',
              render: (row) => (
                <span className={`clearance-status-pill ${row.status.toLowerCase()}`}>
                  {row.status.replace('_', ' ')}
                </span>
              ),
            },
            {
              key: 'submittedAt',
              title: 'Submitted',
              render: (row) => row.submittedAt ? new Date(row.submittedAt).toLocaleDateString() : '—',
            },
            {
              key: 'actions',
              title: 'Action',
              render: (row) => (
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setSelected(row)}>
                  Review
                </button>
              ),
            },
          ]}
        />
      )}

      {selected && (
        <div className="modal show d-block clearance-review-modal" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title mb-0">{selected.studentName}</h5>
                  <small style={{ opacity: 0.85 }}>{selected.clearanceNumber} · {selected.className}</small>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelected(null)} aria-label="Close" />
              </div>
              <div className="modal-body p-4">
                <span className={`clearance-status-pill ${selected.status.toLowerCase()} mb-3`}>
                  {selected.status.replace('_', ' ')}
                </span>

                {selected.items.filter((i) => i.photoDataUrl).length > 0 ? (
                  <div className="row g-3 mb-4">
                    {selected.items.filter((i) => i.photoDataUrl).map((item) => (
                      <div className="col-6 col-md-4" key={item.id}>
                        <div className="photo-thumb">
                          <img src={item.photoDataUrl} alt={item.itemName} />
                        </div>
                        <small className="d-block text-muted mt-1 fw-semibold">{item.itemName}</small>
                        <small className="text-success">Code: {item.verificationCode}</small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small mb-4">No photos uploaded yet.</p>
                )}

                {selected.status === 'SUBMITTED' && (
                  <div className="d-grid gap-2">
                    <button type="button" className="btn btn-success btn-lg" onClick={() => handleApprove(selected.id)}>
                      <FiCheck className="me-2" /> Approve &amp; Generate QR Pass
                    </button>
                    <button type="button" className="btn btn-warning" onClick={() => handleRequestPhoto(selected.id)}>
                      <FiCamera className="me-1" /> Request New Photo
                    </button>
                    <input
                      className="form-control"
                      placeholder="Rejection reason (optional)…"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button type="button" className="btn btn-outline-danger" onClick={() => handleReject(selected.id)}>
                      <FiX className="me-1" /> Reject Submission
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
