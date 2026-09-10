import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [pgName, setPgName] = useState('');
  const [address, setAddress] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user.pgAccountId) {
      setIsUpdating(true);
      fetchPG();
    }
  }, [user]);

  const fetchPG = async () => {
    try {
      const res = await api.get('/pg');
      setPgName(res.data.pgAccount.pgName);
      setAddress(res.data.pgAccount.address);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      if (isUpdating) {
        await api.put('/pg', { pgName, address });
        setMessage({ text: 'PG Account updated successfully!', type: 'success' });
      } else {
        const res = await api.post('/pg', { pgName, address });
        setUser({ ...user, pgAccountId: res.data.pgAccount._id });
        setIsUpdating(true);
        setMessage({ text: 'PG Account created successfully!', type: 'success' });
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Error saving PG details', type: 'error' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">{isUpdating ? 'Update PG Details' : 'Create PG Account'}</h3>
        
        {message.text && (
          <div className={`p-3 rounded-xl mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PG Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
              value={pgName}
              onChange={(e) => setPgName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            {isUpdating ? 'Update details' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
