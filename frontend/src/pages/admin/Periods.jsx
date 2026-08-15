import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Calendar, Plus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Periods() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const res = await api.get('/periods');
      setPeriods(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch periods');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      capacity: parseInt(formData.get('capacity'), 10),
      price: parseFloat(formData.get('price')),
      age_group: formData.get('age_group'),
      gender: formData.get('gender')
    };

    try {
      await api.post('/periods', payload);
      toast.success('Period created successfully!');
      setShowModal(false);
      fetchPeriods(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create period');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Periods & Sessions</h2>
          <p className="text-muted-foreground">Manage camp periods, capacities, and pricing.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" /> New Period
        </button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Period Name</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">Age / Class</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground flex justify-center items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading periods...
                </td>
              </tr>
            ) : periods.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No periods found.</td>
              </tr>
            ) : (
              periods.map((period) => (
                <tr key={period.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-full text-blue-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    {period.name}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {period.age_group || 'Any'} / {period.gender || 'Any'}
                  </td>
                  <td className="px-6 py-4 font-medium">€{period.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      period.status === 'active' ? 'bg-green-500/15 text-green-700' :
                      period.status === 'waitlist' ? 'bg-yellow-500/15 text-yellow-700' :
                      'bg-red-500/15 text-red-700'
                    }`}>
                      {period.status ? (period.status.charAt(0).toUpperCase() + period.status.slice(1)) : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Period Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Create New Period</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Period Name</label>
                <input required name="name" type="text" placeholder="e.g., Boys 15+ years old" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Start Date</label>
                  <input required name="start_date" type="date" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">End Date</label>
                  <input required name="end_date" type="date" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Capacity</label>
                  <input required name="capacity" type="number" min="1" placeholder="100" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Price (€)</label>
                  <input required name="price" type="number" min="0" step="0.01" placeholder="500.00" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Age Group</label>
                  <input required name="age_group" type="text" placeholder="e.g., 12-14" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Gender</label>
                  <select required name="gender" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition" disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm transition flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : 'Create Period'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
