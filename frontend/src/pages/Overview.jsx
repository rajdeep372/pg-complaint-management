import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';

const Overview = () => {
  const { user } = useContext(AuthContext);
  const [pgAccount, setPgAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        if (user.pgAccountId) {
          const res = await api.get('/pg');
          setPgAccount(res.data.pgAccount);
        }
      } catch (error) {
        console.error('Error fetching PG', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [user]);

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {!user.pgAccountId && user.role === 'Owner' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You haven't set up a PG Account yet. Please go to <span className="font-semibold">Settings</span> to create one.
              </p>
            </div>
          </div>
        </div>
      )}

      {pgAccount && (
        <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">PG Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{pgAccount.pgName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-900">{pgAccount.address}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <h4 className="text-indigo-100 mb-1">Your Role</h4>
          <p className="text-2xl font-bold">{user.role}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-gray-500 mb-1">Status</h4>
          <p className="text-2xl font-bold text-gray-900">Active</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
