import SidebarNav from './SidebarNav';
import Header from './Header';
import { clearAllData } from '../utils/storage';

export default function AppShell({ profile, children }) {
  const handleReset = () => {
    if (window.confirm('Reset profile and clear all data?')) {
      clearAllData();
      window.location.href = '/setup';
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main id="main-content" className="flex-1 overflow-y-auto px-10 py-8" aria-label="Main content">
        <Header profile={profile} onReset={handleReset} />
        {children}
      </main>
    </div>
  );
}
