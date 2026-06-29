import { useEffect, useRef, useState } from 'react';
import { FiCamera, FiX, FiShield } from 'react-icons/fi';
import { generateVerificationCode } from '../../services/clearanceUtils';

interface ClearanceCameraModalProps {
  show: boolean;
  itemName: string;
  onClose: () => void;
  onCapture: (photoDataUrl: string, verificationCode: string) => void;
}

export function ClearanceCameraModal({ show, itemName, onClose, onCapture }: ClearanceCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [code] = useState(() => generateVerificationCode());
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!show) return;
    let active = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (!active) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch {
        setError('Camera access denied. Please allow camera permissions in your browser.');
      }
    })();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setReady(false);
      setError('');
    };
  }, [show]);

  if (!show) return null;

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl, code);
  }

  return (
    <div className="modal show d-block clearance-camera-modal" style={{ background: 'rgba(15, 23, 42, 0.55)' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header">
            <div className="d-flex align-items-center gap-2">
              <span className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <FiCamera />
              </span>
              <div>
                <h5 className="modal-title mb-0">Live Photo Verification</h5>
                <small className="text-muted">{itemName}</small>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <div className="modal-body p-4">
            <div className="clearance-code-banner">
              <div className="code-label d-flex align-items-center justify-content-center gap-1">
                <FiShield size={14} /> Today&apos;s Verification Code
              </div>
              <div className="code-value">{code}</div>
              <p className="small text-muted mb-0 mt-2">Write this code on paper, place it beside the items, and include the student in the photo.</p>
            </div>
            {error ? (
              <div className="alert alert-danger border-0">{error}</div>
            ) : (
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden border" style={{ borderColor: 'var(--school-border) !important' }}>
                <video ref={videoRef} className="object-fit-cover bg-dark" playsInline muted />
              </div>
            )}
            <canvas ref={canvasRef} className="d-none" />
          </div>
          <div className="modal-footer border-top bg-light">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              <FiX className="me-1" /> Cancel
            </button>
            <button type="button" className="btn btn-primary px-4" disabled={!ready || !!error} onClick={capture}>
              <FiCamera className="me-1" /> Capture Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
