import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut, Heart, ChevronDown } from 'lucide-react';
import { useAuthStore, useProductStore } from '@/store';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { setFilters } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pageTitles: Record<string, string> = {
    '/': '数据目录',
    '/catalog': '数据目录',
    '/applications': '申请流程',
    '/authorizations': '授权管理',
    '/transactions': '交易记录',
    '/reviews': '评价中心',
    '/admin': '运营后台',
    '/admin/review': '上架审核',
    '/admin/statistics': '成交统计',
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/product/')) {
      return '产品详情';
    }
    if (location.pathname.startsWith('/applications')) {
      return '申请流程';
    }
    if (location.pathname.startsWith('/admin/review')) {
      return '上架审核';
    }
    if (location.pathname.startsWith('/admin/statistics')) {
      return '成交统计';
    }
    if (location.pathname.startsWith('/admin')) {
      return '运营后台';
    }
    return pageTitles[location.pathname] || '数据要素流通平台';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
    setFilters({ search: searchQuery });
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const notifications = [
    { id: 1, title: '申请已通过', message: '您申请的"全国居民消费行为分析数据集"已通过审核', time: '5分钟前', unread: true },
    { id: 2, title: '新消息', message: '数据提供方向您发送了一条消息', time: '1小时前', unread: true },
    { id: 3, title: '授权即将到期', message: '您的"电商用户画像标签体系"授权将在7天后到期', time: '1天前', unread: false },
  ];

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-neutral-950">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索数据产品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </form>

        <button
          onClick={() => navigate('/?tab=favorites')}
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors relative"
          title="我的收藏"
        >
          <Heart className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-card-hover border border-neutral-200 overflow-hidden animate-slide-down">
              <div className="p-4 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-900">通知中心</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors ${
                      notif.unread ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notif.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{notif.title}</p>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-neutral-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-neutral-200">
                <button className="w-full text-sm text-primary-950 hover:text-primary-800 font-medium">
                  查看全部通知
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full bg-neutral-200"
            />
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-neutral-200 overflow-hidden animate-slide-down">
              <div className="p-3 border-b border-neutral-200">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  账户设置
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
