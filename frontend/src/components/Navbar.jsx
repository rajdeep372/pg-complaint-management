import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Title can go here, or left blank if sidebar is present */}
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-3 bg-gray-50 py-2 px-4 rounded-full border border-gray-100">
              <UserCircle className="h-6 w-6 text-indigo-600" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 leading-tight">{user?.name}</span>
                <span className="text-xs text-gray-500 leading-tight">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
