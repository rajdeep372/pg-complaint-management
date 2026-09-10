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
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">PG Admin</h1>
        <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role} Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
