import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiChevronsLeft, FiChevronsRight, FiLogOut, FiMenu, FiSearch, FiSettings, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface TopNavbarProps {
  onMenuClick: () => void;
  pinned: boolean;
  onTogglePin: () => void;
}

export function TopNavbar({ onMenuClick, pinned, onTogglePin }: TopNavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleSignOut() {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  }

  const roleLabel =
    user?.role === 'parent'   ? `Parent — ${user.className}` :
    user?.role === 'finance'  ? 'Finance Officer'             :
    user?.role === 'academic' ? 'Head of Academics'           :
    user?.role === 'teacher'  ? `${user.subject} Teacher`     :
    user?.role === 'student'  ? `Student — ${user.className}` :
    'Principal Portal';

  return (
    <nav className="topbar navbar navbar-expand bg-white border-bottom sticky-top">
      <div className="container-fluid gap-3">
        {/* Mobile: open overlay sidebar */}
        <button className="btn btn-link text-primary d-lg-none p-0" type="button" onClick={onMenuClick} aria-label="Open navigation">
          <FiMenu size={24} />
        </button>

        {/* Desktop: pin/unpin sidebar toggle */}
        <button
          className="topbar-sidebar-toggle d-none d-lg-grid"
          type="button"
          onClick={onTogglePin}
          aria-label={pinned ? 'Collapse sidebar' : 'Expand sidebar'}
          title={pinned ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {pinned ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}
        </button>

        <div className="input-group topbar-search">
          <span className="input-group-text bg-light border-0"><FiSearch /></span>
          <input className="form-control bg-light border-0" placeholder="Search students, teachers, classes..." />
        </div>

        <button className="btn btn-light rounded-circle" type="button" aria-label="Notifications">
          <FiBell />
        </button>

        {/* User profile + dropdown */}
        <div className="topbar-user-menu" ref={dropdownRef}>
          <button
            className="topbar-user-btn"
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
            aria-label="Account menu"
          >
            <img
              className="avatar-sm"
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80"
              alt={user?.name ?? 'User'}
            />
            <div className="d-none d-sm-block text-start">
              <div className="fw-semibold small">{user?.name ?? 'User'}</div>
              <div className="text-muted x-small">{roleLabel}</div>
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div className="topbar-dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
              <div className="topbar-dropdown">
                <div className="topbar-dropdown-header">
                  <img
                    className="avatar-sm"
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80"
                    alt=""
                  />
                  <div>
                    <div className="fw-semibold">{user?.name}</div>
                    <div className="text-muted x-small">{user?.email}</div>
                  </div>
                </div>
                <hr className="my-1" />
                <button className="topbar-dropdown-item" type="button" onClick={() => setDropdownOpen(false)}>
                  <FiUser size={15} /> My Profile
                </button>
                <button className="topbar-dropdown-item" type="button" onClick={() => setDropdownOpen(false)}>
                  <FiSettings size={15} /> Settings
                </button>
                <hr className="my-1" />
                <button className="topbar-dropdown-item text-danger" type="button" onClick={handleSignOut}>
                  <FiLogOut size={15} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
