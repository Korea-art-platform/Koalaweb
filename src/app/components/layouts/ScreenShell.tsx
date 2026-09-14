import { Outlet } from 'react-router';

export default function ScreenShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Outlet />
    </div>
  );
}
