import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  const location = useLocation();
  
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6 min-h-[calc(100vh-4rem)] animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
