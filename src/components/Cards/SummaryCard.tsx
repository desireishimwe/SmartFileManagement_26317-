import { IconType } from 'react-icons';

export function SummaryCard({ title, value, note, icon: Icon, variant }: { title: string; value: string; note: string; icon: IconType; variant: string }) {
  return (
    <div className="card border-0 shadow-sm h-100 summary-card">
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`summary-icon text-${variant} bg-${variant}-subtle`}>
          <Icon />
        </div>
        <div>
          <p className="text-muted mb-1 small">{title}</p>
          <h3 className="mb-1">{value}</h3>
          <span className="text-muted x-small">{note}</span>
        </div>
      </div>
    </div>
  );
}
