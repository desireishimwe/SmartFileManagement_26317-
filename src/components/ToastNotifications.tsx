import { useEffect } from 'react';
import { FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const icons = {
  success: FiCheckCircle,
  danger: FiXCircle,
  info: FiInfo,
};

export function ToastNotifications() {
  const { toasts, dismissToast } = useApp();

  useEffect(() => {
    const timers = toasts.map((toast) => window.setTimeout(() => dismissToast(toast.id), 4000));
    return () => timers.forEach(window.clearTimeout);
  }, [dismissToast, toasts]);

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant];
        return (
          <div key={toast.id} className="toast show border-0 shadow-sm mb-2" role="alert">
            <div className={`toast-header text-${toast.variant}`}>
              <Icon className="me-2" />
              <strong className="me-auto">{toast.title}</strong>
              <button type="button" className="btn-close" onClick={() => dismissToast(toast.id)} aria-label="Close" />
            </div>
            <div className="toast-body">{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
}
