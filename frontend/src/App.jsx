import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { getProfile } from './utils/storage';
import AppShell from './components/AppShell';
import ProfileSetup from './pages/ProfileSetup';
import CheckIn from './pages/CheckIn';
import Insights from './pages/Insights';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

function ShellLayout() {
  const profile = getProfile();
  return (
    <AppShell profile={profile}>
      <Outlet context={{ profile }} />
    </AppShell>
  );
}

export default function App() {
  const profile = getProfile();

  if (!profile) {
    return (
      <Routes>
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route index element={<Navigate to="/check-in" replace />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Route>
      <Route path="/setup" element={<Navigate to="/check-in" replace />} />
      <Route path="*" element={<Navigate to="/check-in" replace />} />
    </Routes>
  );
}
