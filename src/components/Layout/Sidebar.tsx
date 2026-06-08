import { NavLink, useLocation } from 'react-router-dom';
import {
  Database,
  FileText,
  ClipboardList,
  Key,
  Receipt,
  Star,
  Settings,
  BarChart3,
  CheckSquare,
  User,
  Building2,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/', label: '数据目录', icon: Database, roles: ['applicant', 'provider', 'admin'] },
  { path: '/authorizations', label: '授权管理', icon: Key, roles: ['applicant', 'provider', 'admin'] },
  { path: '/transactions', label: '交易记录', icon: Receipt, roles: ['applicant', 'provider', 'admin'] },
  { path: '/reviews', label: '评价中心', icon: Star, roles: ['applicant', 'provider', 'admin'] },
  { path: '/apply/0', label: '申请流程', icon: ClipboardList, roles: ['applicant', 'provider'], hidden: true },
  { path: '/product/0', label: '产品详情', icon: FileText, roles: ['applicant', 'provider', 'admin'], hidden: true },
];

const adminMenuItems = [
  { path: '/admin/review', label: '上架审核', icon: CheckSquare, roles: ['admin'] },
  { path: '/admin/statistics', label: '成交统计', icon: BarChart3, roles: ['admin'] },
];

const roleIcons = {
  applicant: User,
  provider: Building2,
  admin: Shield,
};

const roleLabels = {
  applicant: '数据需求方',
  provider: '数据提供方',
  admin: '平台运营方',
};

export default function Sidebar() {
  const location = useLocation();
  const { user, switchRole } = useAuthStore();

  const visibleMenuItems = menuItems.filter((item) => !item.hidden);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const RoleIcon = user ? roleIcons[user.role] : User;

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-950">数据要素流通平台</h1>
            <p className="text-xs text-neutral-500">Data Exchange Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <div className="space-y-1">
          {visibleMenuItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'sidebar-link group',
                    isActive(item.path) && 'sidebar-link-active'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
        </div>

        {user?.role === 'admin' && (
          <>
            <div className="divider" />
            <div className="space-y-1">
              <p className="px-4 text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                运营管理
              </p>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'sidebar-link',
                      location.pathname.startsWith(item.path) && 'sidebar-link-active'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-neutral-200">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full bg-neutral-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                <p className="text-xs text-neutral-500 truncate">{user.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg">
              <RoleIcon className="w-4 h-4 text-primary-950" />
              <span className="text-xs text-neutral-600 flex-1">{roleLabels[user.role]}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => switchRole('applicant')}
                  className={cn(
                    'w-6 h-6 rounded flex items-center justify-center text-xs transition-colors',
                    user.role === 'applicant'
                      ? 'bg-primary-950 text-white'
                      : 'bg-white text-neutral-500 hover:bg-neutral-200'
                  )}
                  title="需求方"
                >
                  需
                </button>
                <button
                  onClick={() => switchRole('provider')}
                  className={cn(
                    'w-6 h-6 rounded flex items-center justify-center text-xs transition-colors',
                    user.role === 'provider'
                      ? 'bg-primary-950 text-white'
                      : 'bg-white text-neutral-500 hover:bg-neutral-200'
                  )}
                  title="提供方"
                >
                  供
                </button>
                <button
                  onClick={() => switchRole('admin')}
                  className={cn(
                    'w-6 h-6 rounded flex items-center justify-center text-xs transition-colors',
                    user.role === 'admin'
                      ? 'bg-primary-950 text-white'
                      : 'bg-white text-neutral-500 hover:bg-neutral-200'
                  )}
                  title="运营方"
                >
                  运
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
