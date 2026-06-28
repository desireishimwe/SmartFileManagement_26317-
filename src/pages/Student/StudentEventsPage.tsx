import { useState, useMemo } from 'react';
import {
  FiBookOpen, FiCalendar, FiChevronLeft, FiChevronRight,
  FiClock, FiGlobe, FiMapPin, FiMic, FiStar, FiSun, FiUsers,
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { EventCategory, SchoolEvent } from '../../types';

const CATEGORY_META: Record<EventCategory, { label: string; color: string; bg: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  academic:  { label: 'Academic',  color: '#2563eb', bg: '#eff6ff', Icon: FiBookOpen  },
  sports:    { label: 'Sports',    color: '#16a34a', bg: '#f0fdf4', Icon: FiStar      },
  cultural:  { label: 'Cultural',  color: '#7c3aed', bg: '#f5f3ff', Icon: FiMic       },
  meeting:   { label: 'Meeting',   color: '#d97706', bg: '#fffbeb', Icon: FiUsers     },
  holiday:   { label: 'Holiday',   color: '#dc2626', bg: '#fef2f2', Icon: FiSun       },
  general:   { label: 'General',   color: '#475569', bg: '#f8fafc', Icon: FiGlobe     },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function fmt12(time?: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function EventCard({ event, isToday }: { event: SchoolEvent; isToday: boolean }) {
  const [open, setOpen] = useState(false);
  const meta = CATEGORY_META[event.category];
  const Icon = meta.Icon;

  return (
    <div
      className={`event-card ${isToday ? 'event-card-today' : ''}`}
      style={{ borderLeft: `4px solid ${meta.color}`, background: meta.bg }}
      onClick={() => setOpen((v) => !v)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
      role="button"
      aria-expanded={open}
    >
      <div className="event-card-top">
        <div className="event-card-icon" style={{ background: meta.color + '22', color: meta.color }}>
          <Icon size={15} />
        </div>
        <div className="event-card-main">
          <div className="event-card-title">{event.title}</div>
          <div className="event-card-meta">
            {event.startTime && (
              <span><FiClock size={11} /> {fmt12(event.startTime)}{event.endTime ? ` – ${fmt12(event.endTime)}` : ''}</span>
            )}
            {event.location && (
              <span><FiMapPin size={11} /> {event.location}</span>
            )}
            <span className="event-cat-badge" style={{ background: meta.color + '22', color: meta.color }}>
              {meta.label}
            </span>
          </div>
        </div>
      </div>

      {open && (
        <div className="event-card-desc">{event.description}</div>
      )}
    </div>
  );
}

export function StudentEventsPage() {
  const { events } = useApp();
  const today = useMemo(() => new Date(), []);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today));
  const [activeFilter, setActiveFilter] = useState<EventCategory | 'all'>('all');

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const weekLabel = useMemo(() => {
    const from = weekDays[0];
    const to   = weekDays[6];
    if (from.getMonth() === to.getMonth()) {
      return `${from.getDate()} – ${to.getDate()} ${MONTH_NAMES[from.getMonth()]} ${from.getFullYear()}`;
    }
    return `${from.getDate()} ${MONTH_NAMES[from.getMonth()]} – ${to.getDate()} ${MONTH_NAMES[to.getMonth()]} ${to.getFullYear()}`;
  }, [weekDays]);

  const isCurrentWeek = toYMD(weekStart) === toYMD(startOfWeek(today));

  function prevWeek() { setWeekStart((d) => addDays(d, -7)); }
  function nextWeek() { setWeekStart((d) => addDays(d,  7)); }
  function goToday()  { setWeekStart(startOfWeek(today));    }

  const filtered = useMemo(() =>
    events.filter((e) =>
      (activeFilter === 'all' || e.category === activeFilter) &&
      e.audience.some((a) => a === 'all' || a === 'student')
    ),
    [events, activeFilter],
  );

  const eventsThisWeek = useMemo(() =>
    filtered.filter((e) => {
      const d = e.date;
      return d >= toYMD(weekDays[0]) && d <= toYMD(weekDays[6]);
    }),
    [filtered, weekDays],
  );

  const totalThisWeek = eventsThisWeek.length;

  // Count upcoming (from today onward in the displayed week)
  const todayYMD = toYMD(today);
  const upcomingCount = eventsThisWeek.filter((e) => e.date >= todayYMD).length;

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>School Events</h1>
          <p>Stay up to date with what's happening this week</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {!isCurrentWeek && (
            <button className="btn btn-outline-primary btn-sm" onClick={goToday}>
              <FiCalendar className="me-1" /> Today
            </button>
          )}
        </div>
      </div>

      {/* Summary strip */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-muted small mb-1">This Week</div>
            <div className="fw-bold fs-4 text-primary">{totalThisWeek}</div>
            <div className="text-muted x-small">events</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-muted small mb-1">Upcoming</div>
            <div className="fw-bold fs-4 text-success">{upcomingCount}</div>
            <div className="text-muted x-small">from today</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-muted small mb-1">Academic</div>
            <div className="fw-bold fs-4" style={{ color: '#2563eb' }}>
              {eventsThisWeek.filter((e) => e.category === 'academic').length}
            </div>
            <div className="text-muted x-small">events</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-muted small mb-1">Sports / Cultural</div>
            <div className="fw-bold fs-4" style={{ color: '#16a34a' }}>
              {eventsThisWeek.filter((e) => e.category === 'sports' || e.category === 'cultural').length}
            </div>
            <div className="text-muted x-small">events</div>
          </div>
        </div>
      </div>

      {/* Week navigator */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="events-week-nav">
            <button className="btn btn-light btn-sm" onClick={prevWeek} aria-label="Previous week">
              <FiChevronLeft />
            </button>
            <div className="events-week-label">
              <FiCalendar className="me-2 text-primary" />
              {isCurrentWeek && <span className="badge bg-primary me-2">Current Week</span>}
              <strong>{weekLabel}</strong>
            </div>
            <button className="btn btn-light btn-sm" onClick={nextWeek} aria-label="Next week">
              <FiChevronRight />
            </button>
          </div>

          {/* Day strip */}
          <div className="events-day-strip mt-3">
            {weekDays.map((day) => {
              const ymd       = toYMD(day);
              const isToday   = ymd === todayYMD;
              const hasEvents = eventsThisWeek.some((e) => e.date === ymd);
              return (
                <div key={ymd} className={`events-day-chip ${isToday ? 'events-day-chip-today' : ''} ${hasEvents ? 'events-day-chip-has' : ''}`}>
                  <div className="events-day-name">{SHORT_DAYS[day.getDay()]}</div>
                  <div className="events-day-num">{day.getDate()}</div>
                  {hasEvents && <div className="events-day-dot" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="events-filter-row mb-4">
        <button
          className={`events-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Events
        </button>
        {(Object.entries(CATEGORY_META) as [EventCategory, typeof CATEGORY_META[EventCategory]][]).map(([key, meta]) => (
          <button
            key={key}
            className={`events-filter-btn ${activeFilter === key ? 'active' : ''}`}
            style={activeFilter === key ? { background: meta.color, borderColor: meta.color, color: '#fff' } : {}}
            onClick={() => setActiveFilter(key)}
          >
            <meta.Icon size={13} className="me-1" />
            {meta.label}
          </button>
        ))}
      </div>

      {/* Day-by-day listing */}
      {weekDays.map((day) => {
        const ymd      = toYMD(day);
        const isToday  = ymd === todayYMD;
        const dayEvts  = eventsThisWeek.filter((e) => e.date === ymd)
          .sort((a, b) => (a.startTime ?? '00:00').localeCompare(b.startTime ?? '00:00'));

        if (dayEvts.length === 0) return null;

        return (
          <div key={ymd} className="events-day-section">
            <div className={`events-day-header ${isToday ? 'events-day-header-today' : ''}`}>
              <div className="events-day-header-left">
                <span className="events-day-header-name">{DAY_NAMES[day.getDay()]}</span>
                <span className="events-day-header-date">{day.getDate()} {MONTH_NAMES[day.getMonth()]}</span>
              </div>
              {isToday && <span className="badge bg-primary">Today</span>}
              <span className="events-day-count">{dayEvts.length} event{dayEvts.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="events-day-list">
              {dayEvts.map((evt) => (
                <EventCard key={evt.id} event={evt} isToday={isToday} />
              ))}
            </div>
          </div>
        );
      })}

      {eventsThisWeek.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5 text-muted">
            <FiCalendar size={40} className="mb-3 opacity-40" />
            <h5>No events this week</h5>
            <p className="mb-0">Check back later or browse another week using the navigation above.</p>
          </div>
        </div>
      )}
    </div>
  );
}
