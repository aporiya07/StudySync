import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/check-in', label: 'Check-In', icon: '📝' },
  { to: '/insights', label: 'Insights', icon: '✨' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/chat', label: 'Chat', icon: '💬' },
];

export default function SidebarNav() {
  return (
    <aside
      className="flex w-56 shrink-0 flex-col border-r border-ss-border bg-black/20 px-4 py-6"
      aria-label="Main navigation"
    >
      <div className="mb-8 px-2" aria-hidden="true">
        <p className="text-lg font-bold text-violet-300">StudySync</p>
        <p className="text-xs text-ss-muted">Balance studies &amp; wellbeing</p>
      </div>
      <nav aria-label="Site sections">
        <ul className="flex flex-col gap-1" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `ss-nav-item ${isActive ? 'ss-nav-item-active' : ''}`
                }
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
