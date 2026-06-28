import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer/Footer';
import { TopNavbar } from '../components/Navbar/TopNavbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ToastNotifications } from '../components/ToastNotifications';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pinned, setPinned] = useState(
    () => localStorage.getItem('sidebar-pinned') !== 'false'
  );

  const togglePin = () => {
    setPinned(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-pinned', String(next));
      return next;
    });
  };

  return (
    <div className={`app-shell ${pinned ? 'sidebar-pinned' : 'sidebar-collapsed'}`}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pinned={pinned}
        onTogglePin={togglePin}
      />
      <div className="main-shell">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} pinned={pinned} onTogglePin={togglePin} />
        <main className="container-fluid pb-3 pb-lg-4" style={{ paddingTop: '3rem', paddingLeft: '4rem', paddingRight: '4rem' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <ToastNotifications />
    </div>
  );
}
