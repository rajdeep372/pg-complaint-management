import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Home, Users, UserPlus, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const getNavItems = () => {
    switch (user?.role) {
      case 'Owner':
        return [
          { name: 'Overview', path: '/dashboard', icon: Home },
          { name: 'Complaints', path: '/dashboard/complaints', icon: FileText },
          { name: 'Tenants', path: '/dashboard/tenants', icon: Users },
          { name: 'Staff', path: '/dashboard/staff', icon: UserPlus },
          { name: 'Settings', path: '/dashboard/settings', icon: Settings },
        ];
      case 'Editor':
        return [
          { name: 'Overview', path: '/dashboard', icon: Home },
          { name: 'Complaints', path: '/dashboard/complaints', icon: FileText },
          { name: 'Tenants', path: '/dashboard/tenants', icon: Users },
        ];
      case 'Tenant':
        return [
          { name: 'My Dashboard', path: '/dashboard', icon: Home },
          { name: 'My Complaints', path: '/dashboard/complaints', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 w-full md:relative md:w-64 bg-white border-t md:border-t-0 md:border-r border-gray-200 flex flex-row md:flex-col h-16 md:h-screen z-50 transition-all">
      <div className="hidden md:block p-6">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">PG Admin</h1>
        <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role} Portal</p>
      </div>

      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start px-2 md:px-4 py-2 md:py-0 md:mt-4 md:space-y-2 overflow-x-auto md:overflow-y-auto hide-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col md:flex-row items-center justify-center px-2 py-1 md:px-4 md:py-3 text-[10px] md:text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1 md:mb-0 md:mr-3" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden md:block p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
      
      {/* Mobile Logout */}
      <button
        onClick={logout}
        className="md:hidden flex flex-col items-center justify-center px-4 py-1 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
      >
        <LogOut className="h-5 w-5 mb-1" />
        <span className="text-[10px] font-medium">Out</span>
      </button>
    </div>
  );
};

export default Sidebar;
