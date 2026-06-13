import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/check-in', label: 'Check-In', icon: '📝' },
  { to: '/insights', label: 'Insights', icon: '✨' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/chat', label: 'Chat', icon: '💬' },
];

export default function SidebarNav() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-ss-border bg-black/20 px-4 py-6">
      <div className="mb-8 px-2">
        <p className="text-lg font-bold text-teal-300">StudySync</p>
        <p className="text-xs text-ss-muted">Balance studies & wellbeing</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `ss-nav-item ${isActive ? 'ss-nav-item-active' : ''}`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
