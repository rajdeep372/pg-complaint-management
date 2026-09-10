import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import InviteAcceptanceModal from '../components/InviteAcceptanceModal';

// Placeholder sub-pages
import Overview from './Overview';
import Complaints from './Complaints';
import Tenants from './Tenants';
import Staff from './Staff';
import Settings from './Settings';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleInviteAccepted = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        {/* Editor pending invite check */}
        {user?.role === 'Editor' && user?.inviteStatus === 'pending' ? (
          <div className="flex-1 relative">
            <InviteAcceptanceModal onAccept={handleInviteAccepted} />
          </div>
        ) : (
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/complaints" element={<Complaints />} />
              
              {(user?.role === 'Owner' || user?.role === 'Editor') && (
                <Route path="/tenants" element={<Tenants />} />
              )}
              
              {user?.role === 'Owner' && (
                <>
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/settings" element={<Settings />} />
                </>
              )}
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
