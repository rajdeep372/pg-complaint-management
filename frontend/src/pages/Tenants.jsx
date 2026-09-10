import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Tenants = () => {
  const { user } = useContext(AuthContext);
  const [tenants, setTenants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await api.get('/users');
      setTenants(res.data.users.filter(u => u.role === 'Tenant'));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/tenant', { name, email, password });
      setShowForm(false);
      setName(''); setEmail(''); setPassword('');
      fetchTenants();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding tenant');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tenants Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Tenant
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Tenant</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input required type="text" placeholder="Name" className="px-4 py-2 border rounded-xl outline-none focus:border-indigo-500" value={name} onChange={e => setName(e.target.value)} />
              <input required type="email" placeholder="Email" className="px-4 py-2 border rounded-xl outline-none focus:border-indigo-500" value={email} onChange={e => setEmail(e.target.value)} />
              <input required type="password" placeholder="Password" className="px-4 py-2 border rounded-xl outline-none focus:border-indigo-500" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Add</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Added On</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                <td className="px-6 py-4 text-gray-600">{t.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No tenants added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tenants;
