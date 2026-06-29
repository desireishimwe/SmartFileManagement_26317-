import { useEffect, useState } from 'react';
import {
  FiCamera, FiCheckCircle, FiPackage, FiAlertCircle,
  FiShield, FiCalendar, FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ClearanceCameraModal } from '../../components/Clearance/ClearanceCameraModal';
import { ClearanceItemRecord, StudentClearanceRecord } from '../../types';

function statusPillClass(status: string) {
  return status.toLowerCase();
}

export function ParentClearancePage() {
  const { user } = useAuth();
  const {
    students, clearances, getOrCreateClearance, updateClearanceItemQty,
    uploadClearancePhoto, submitClearance, addToast,
  } = useApp();

  const child = students.find((s) => s.id === user?.studentId);
  const [cameraItem, setCameraItem] = useState<ClearanceItemRecord | null>(null);
  const [declaration, setDeclaration] = useState(false);
  const [aiModal, setAiModal] = useState<{ loading: boolean; result: ReturnType<typeof uploadClearancePhoto> | null } | null>(null);

  useEffect(() => {
    if (!user?.studentId) return;
    if (clearances.some((c) => c.studentId === user.studentId)) return;
    getOrCreateClearance(user.studentId, user.id);
  }, [user?.studentId, user?.id, clearances, getOrCreateClearance]);

  const clearance: StudentClearanceRecord | undefined = clearances.find(
    (c) => c.studentId === user?.studentId,
  );

  if (!child) {
    return <div className="alert alert-warning mt-4 border-0 shadow-sm">No student linked to your account.</div>;
  }

  if (!clearance) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p className="text-muted small">Preparing your clearance checklist…</p>
      </div>
    );
  }

  const itemsDone = clearance.items.filter((i) => i.completedQuantity >= i.requiredQuantity).length;
  const progress = clearance.items.length ? Math.round((itemsDone / clearance.items.length) * 100) : 0;
  const canEdit = clearance.status === 'PENDING' || clearance.status === 'PHOTO_REQUESTED';

  function handleCapture(photoDataUrl: string, verificationCode: string) {
    if (!cameraItem || !clearance) return;
    setCameraItem(null);
    setAiModal({ loading: true, result: null });
    setTimeout(() => {
      const result = uploadClearancePhoto(clearance.id, cameraItem.id, photoDataUrl, verificationCode);
      setAiModal({ loading: false, result });
      addToast({ title: 'Photo captured', message: `AI confidence: ${result.confidence}%`, variant: 'success' });
    }, 1200);
  }

  function handleSubmit() {
    if (!clearance) return;
    if (!declaration) {
      addToast({ title: 'Declaration required', message: 'Please accept the declaration.', variant: 'danger' });
      return;
    }
    const ok = submitClearance(clearance.id);
    if (ok) {
      addToast({ title: 'Clearance submitted', message: 'Awaiting school review.', variant: 'success' });
    } else {
      addToast({ title: 'Cannot submit', message: 'Complete all item quantities first.', variant: 'danger' });
    }
  }

  return (
    <div className="clearance-page">
      <div className="page-heading">
        <div>
          <h1>Back to School Clearance</h1>
          <p>Complete boarding items verification before admission day.</p>
        </div>
        <span className={`clearance-status-pill ${statusPillClass(clearance.status)}`}>
          <FiShield aria-hidden="true" />
          {clearance.status.replace('_', ' ')}
        </span>
      </div>

      {/* Hero: student + progress */}
      <div className="clearance-hero">
        <div className="row g-4 align-items-center">
          <div className="col-lg-5">
            <div className="clearance-student-chip">
              <img src={child.profilePhoto} alt={child.firstName} />
              <div>
                <h5 className="fw-bold mb-1">{child.firstName} {child.lastName}</h5>
                <span className="badge-class">{child.className}</span>
                <p className="small text-muted mb-0 mt-2 d-flex align-items-center gap-1">
                  <FiCalendar size={14} /> Admission: {clearance.admissionDate}
                </p>
                <p className="small text-muted mb-0 d-flex align-items-center gap-1">
                  <FiUser size={14} /> {clearance.clearanceNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="clearance-progress-panel">
              <div className="d-flex justify-content-between align-items-end mb-2">
                <div>
                  <span className="text-muted small text-uppercase fw-bold" style={{ letterSpacing: '0.08em' }}>Clearance Progress</span>
                  <div className="clearance-progress-stat mt-1">{progress}%</div>
                </div>
                <div className="text-end">
                  <span className="fw-bold text-success">{itemsDone}</span>
                  <span className="text-muted"> / {clearance.items.length} items</span>
                </div>
              </div>
              <div className="progress mb-2">
                <div className="progress-bar" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
              </div>
              <small className="text-muted">Complete all items and live photos before submitting for review.</small>
            </div>
          </div>
        </div>
      </div>

      {clearance.status === 'REJECTED' && clearance.rejectionReason && (
        <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-2 mb-4">
          <FiAlertCircle /> {clearance.rejectionReason}
        </div>
      )}

      {clearance.status === 'PHOTO_REQUESTED' && (
        <div className="alert alert-warning border-0 shadow-sm mb-4">
          <FiCamera className="me-2" /> Please retake live photos for the required items.
        </div>
      )}

      {/* Digital pass */}
      {clearance.status === 'APPROVED' && clearance.qrToken && (
        <div className="card clearance-pass-card">
          <div className="pass-header">
            <FiCheckCircle size={36} className="mb-2" style={{ opacity: 0.95 }} />
            <h3>READY TO ENTER</h3>
            <span className="pass-approved-badge">APPROVED</span>
          </div>
          <div className="pass-body">
            {clearance.randomInspection && (
              <div className="alert alert-warning py-2 small border-0 mb-3">Manual inspection required at the gate</div>
            )}
            <p className="fw-bold mb-0 fs-5">{clearance.studentName}</p>
            <p className="text-muted mb-2">{clearance.className} · Nu Vision High School</p>
            <p className="pass-id mb-3">{clearance.clearanceNumber}</p>
            <div className="pass-qr-wrap">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(clearance.qrToken)}`}
                alt="Entry QR code"
                width={180}
                height={180}
              />
            </div>
            <p className="small text-muted mb-0">Present this QR code at the school gate on admission day</p>
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="clearance-section-title">
        <span className="icon-wrap"><FiPackage /></span>
        Required Items Checklist
      </div>
      <div className="row g-3 mb-4">
        {clearance.items.map((item) => (
          <div className="col-12 col-md-6 col-xl-4" key={item.id}>
            <div className={`card clearance-item-card h-100 ${item.photoVerified ? 'verified' : ''}`}>
              <div className="card-body">
                <div className="item-header">
                  <h6 className="item-name">{item.itemName}</h6>
                  {item.photoVerified && <FiCheckCircle className="text-success fs-5" />}
                </div>
                <span className="qty-badge">Required: {item.requiredQuantity}</span>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <label className="small text-muted mb-0 fw-semibold">Completed:</label>
                  <input
                    type="number"
                    min={0}
                    className="form-control form-control-sm"
                    style={{ width: 72, borderColor: 'var(--school-border)' }}
                    value={item.completedQuantity}
                    disabled={!canEdit}
                    onChange={(e) => updateClearanceItemQty(clearance.id, item.id, parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                {canEdit && (
                  <button type="button" className="btn btn-primary btn-sm w-100" onClick={() => setCameraItem(item)}>
                    <FiCamera className="me-1" /> Take Live Photo
                  </button>
                )}
                {item.photoDataUrl && (
                  <img src={item.photoDataUrl} alt="" className="item-photo" />
                )}
                {item.aiConfidence != null && (
                  <span className="verified-tag">
                    <FiCheckCircle size={14} /> Verified — {item.aiConfidence}% confidence
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {canEdit && (
        <>
          <div className="card clearance-declaration-card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FiShield className="text-success" /> Declaration
              </h6>
              <p className="small text-muted mb-2">I confirm that all information submitted is true.</p>
              <p className="small text-muted mb-3">I understand that providing false information may result in rejection during school admission.</p>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="decl" checked={declaration} onChange={(e) => setDeclaration(e.target.checked)} />
                <label className="form-check-label fw-semibold" htmlFor="decl">I Agree</label>
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-primary clearance-submit-btn w-100" disabled={!declaration} onClick={handleSubmit}>
            Submit Clearance for Review
          </button>
        </>
      )}

      <ClearanceCameraModal
        show={!!cameraItem}
        itemName={cameraItem?.itemName ?? ''}
        onClose={() => setCameraItem(null)}
        onCapture={handleCapture}
      />

      {aiModal && (
        <div className="modal show d-block clearance-ai-modal" style={{ background: 'rgba(15, 23, 42, 0.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg text-center p-4">
              {aiModal.loading ? (
                <>
                  <div className="spinner-border text-success mb-3" role="status" />
                  <p className="fw-bold mb-1">Analyzing Image…</p>
                  <p className="small text-muted">AI verification in progress</p>
                </>
              ) : aiModal.result ? (
                <>
                  <div className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
                    <FiCheckCircle size={28} />
                  </div>
                  <ul className="list-unstyled ai-check-list text-start mb-3">
                    <li><span className="check-icon">✓</span> Student detected</li>
                    <li><span className="check-icon">✓</span> Verification code detected</li>
                    <li><span className="check-icon">✓</span> Required items detected</li>
                  </ul>
                  <p className="mb-2">Confidence: <strong className="text-success">{aiModal.result.confidence}%</strong></p>
                  <span className={`badge ${aiModal.result.approved ? 'bg-success' : 'bg-warning'} mb-3 px-3 py-2`}>
                    {aiModal.result.approved ? 'Approved' : 'Manual Review'}
                  </span>
                  <button type="button" className="btn btn-primary w-100" onClick={() => setAiModal(null)}>Continue</button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
