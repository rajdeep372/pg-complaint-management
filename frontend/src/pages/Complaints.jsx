import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { PlusCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Complaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tenantId, setTenantId] = useState(''); // Only for owner/editor creating for tenant
  const [tenantsList, setTenantsList] = useState([]);

  useEffect(() => {
    fetchComplaints();
    if (user.role === 'Owner' || user.role === 'Editor') {
      fetchTenants();
    }
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.complaints);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await api.get('/users');
      setTenantsList(res.data.users.filter(u => u.role === 'Tenant'));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description };
      if (user.role !== 'Tenant') {
        payload.tenantId = tenantId;
      }
      await api.post('/complaints', payload);
      setShowForm(false);
      setTitle('');
      setDescription('');
      fetchComplaints();
    } catch (error) {
      alert('Error creating complaint');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, { status });
      fetchComplaints();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'In Progress': return <Clock className="text-yellow-500 w-5 h-5" />;
      default: return <AlertCircle className="text-red-500 w-5 h-5" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Complaints</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Complaint
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">Register New Complaint</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            {(user.role === 'Owner' || user.role === 'Editor') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                >
                  <option value="">-- Select Tenant --</option>
                  {tenantsList.map(t => (
                    <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">Submit</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No complaints found.</p>
        ) : (
          complaints.map(c => (
            <div key={c._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900">{c.title}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusClass(c.status)}`}>
                    {getStatusIcon(c.status)}
                    {c.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{c.description}</p>
                <div className="text-xs text-gray-400 flex space-x-4">
                  <span>Tenant: {c.tenantId?.name}</span>
                  <span>Created: {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {(user.role === 'Owner' || user.role === 'Editor') && (
                <div className="flex flex-col space-y-2 w-full md:w-auto">
                  <select
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                    value={c.status}
                    onChange={(e) => updateStatus(c._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Complaints;
