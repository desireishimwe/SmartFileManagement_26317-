import { NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';
import {
  FiAward, FiBarChart2, FiBookOpen, FiCalendar, FiClipboard,
  FiCreditCard, FiGrid, FiHome, FiMapPin, FiPieChart, FiUsers,
} from 'react-icons/fi';
import nuVisionLogo from '../../assets/nu-vision-logo.svg';
import { useAuth } from '../../context/AuthContext';

const adminNav: { path: string; label: string; icon: IconType }[] = [
  { path: '/dashboard',  label: 'Dashboard',  icon: FiHome       },
  { path: '/students',   label: 'Students',   icon: FiUsers      },
  { path: '/teachers',   label: 'Teachers',   icon: FiBookOpen   },
  { path: '/classes',    label: 'Classes',    icon: FiGrid       },
  { path: '/attendance', label: 'Attendance', icon: FiClipboard  },
  { path: '/results',    label: 'Results',    icon: FiBarChart2  },
  { path: '/fees',       label: 'Fees',       icon: FiCreditCard },
  { path: '/timetable',  label: 'Timetable',  icon: FiCalendar   },
  { path: '/reports',    label: 'Reports',    icon: FiPieChart   },
];

const teacherNav: { path: string; label: string; icon: IconType }[] = [
  { path: '/teacher/dashboard', label: 'Dashboard',  icon: FiHome      },
  { path: '/attendance',        label: 'Attendance', icon: FiClipboard },
  { path: '/results',           label: 'Results',    icon: FiBarChart2 },
  { path: '/timetable',         label: 'Timetable',  icon: FiCalendar  },
];

const parentNav: { path: string; label: string; icon: IconType }[] = [
  { path: '/parent/dashboard', label: 'My Child',     icon: FiHome      },
  { path: '/parent/report',    label: 'Report Card',  icon: FiAward     },
  { path: '/results',          label: 'Results',      icon: FiBarChart2 },
  { path: '/attendance',       label: 'Attendance',   icon: FiClipboard },
  { path: '/parent/fees',      label: 'Payments',     icon: FiCreditCard },
  { path: '/timetable',        label: 'Timetable',    icon: FiCalendar  },
];

const financeNav: { path: string; label: string; icon: IconType }[] = [
  { path: '/finance/dashboard', label: 'Finance Overview', icon: FiHome       },
  { path: '/fees',              label: 'Fee Records',      icon: FiCreditCard },
  { path: '/reports',           label: 'Reports',          icon: FiPieChart   },
];

const academicNav: { path: string; label: string; icon: IconType }[] = [
  { path: '/academic/dashboard', label: 'Overview',   icon: FiHome      },
  { path: '/students',           label: 'Students',   icon: FiUsers     },
  { path: '/classes',            label: 'Classes',    icon: FiGrid      },
  { path: '/attendance',         label: 'Attendance', icon: FiClipboard },
  { path: '/results',            label: 'Results',    icon: FiBarChart2 },
  { path: '/timetable',          label: 'Timetable',  icon: FiCalendar  },
  { path: '/reports',            label: 'Reports',    icon: FiPieChart  },
];

const studentNav: { path: string; label: string; icon: IconType }[] = [
  { path: '/student/dashboard',    label: 'My Dashboard', icon: FiHome      },
  { path: '/results',              label: 'My Results',   icon: FiBarChart2 },
  { path: '/student/report-card',  label: 'Report Card',  icon: FiAward     },
  { path: '/student/events',       label: 'Events',       icon: FiCalendar  },
  { path: '/timetable',            label: 'Timetable',    icon: FiBookOpen  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  pinned: boolean;
  onTogglePin: () => void;
}

export function Sidebar({ open, onClose, pinned, onTogglePin }: SidebarProps) {
  const { user } = useAuth();
  const navItems =
    user?.role === 'parent'   ? parentNav   :
    user?.role === 'finance'  ? financeNav  :
    user?.role === 'academic' ? academicNav :
    user?.role === 'teacher'  ? teacherNav  :
    user?.role === 'student'  ? studentNav  :
    adminNav;

  return (
    <>
      <aside className={`sidebar ${open ? 'show' : ''} ${pinned ? '' : 'sidebar-icon-only'}`}>
        <div className="sidebar-brand">
          <div className="school-logo">
            <img src={nuVisionLogo} alt="Nu Vision High School logo" />
          </div>
          <div className="sidebar-brand-text">
            <div className="fw-bold">Nu Vision High School</div>
            <div className="text-white-50 small">
              {user?.role === 'parent'   ? 'Parent Portal'    :
             user?.role === 'finance'  ? 'Finance Office'   :
             user?.role === 'academic' ? 'Academic Office'  :
             user?.role === 'teacher'  ? 'Teacher Portal'   :
             user?.role === 'student'  ? 'Student Portal'   :
             'Management System'}
            </div>
          </div>
          <button
            className={`sidebar-pin-btn ${pinned ? 'is-pinned' : ''}`}
            type="button"
            onClick={onTogglePin}
            aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
            title={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
          >
            <FiMapPin aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="sidebar-link"
                onClick={onClose}
                title={!pinned ? item.label : undefined}
              >
                <Icon aria-hidden="true" />
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {open && (
        <button
          className="sidebar-backdrop d-lg-none"
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
    </>
  );
}
