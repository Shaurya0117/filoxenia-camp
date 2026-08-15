import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, Plus, Filter, User, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Campers() {
  const [campers, setCampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCampers();
  }, [search]);

  const fetchCampers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/campers?search=${encodeURIComponent(search)}`);
      setCampers(res.data.campers || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to fetch campers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    
    const payload = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      dob: formData.get('dob'),
      gender: formData.get('gender') || undefined,
      address: formData.get('address') || undefined,
      father_name: formData.get('father_name') || undefined,
      father_profession: formData.get('father_profession') || undefined,
      mother_name: formData.get('mother_name') || undefined,
      mother_profession: formData.get('mother_profession') || undefined,
      contact_phone: formData.get('contact_phone') || undefined,
      contact_email: formData.get('contact_email') || undefined,
      is_large_family: formData.get('is_large_family') === 'on'
    };

    try {
      await api.post('/campers', payload);
      toast.success('Camper created successfully!');
      setShowModal(false);
      fetchCampers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create camper');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campers</h2>
          <p className="text-muted-foreground">Manage and view all registered campers.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" /> Add Camper
        </button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 border rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by name, phone..."
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">DOB</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Parents</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading campers...
                  </div>
                </td>
              </tr>
            ) : campers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No campers found.</td>
              </tr>
            ) : (
              campers.map((camper) => (
                <tr key={camper.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div>{camper.first_name} {camper.last_name}</div>
                      {camper.is_large_family && (
                        <span className="text-[10px] bg-amber-500/15 text-amber-700 font-semibold px-1.5 py-0.5 rounded">
                          Large Family
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{camper.gender || 'N/A'}</td>
                  <td className="px-6 py-4">{camper.dob ? new Date(camper.dob).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4">{camper.contact_phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs">{camper.father_name ? `${camper.father_name} (Father)` : 'Father: N/A'}</div>
                    <div className="text-xs text-muted-foreground">{camper.mother_name ? `${camper.mother_name} (Mother)` : 'Mother: N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Camper Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Add New Camper</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">First Name *</label>
                  <input required name="first_name" type="text" placeholder="John" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Last Name *</label>
                  <input required name="last_name" type="text" placeholder="Doe" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Date of Birth *</label>
                  <input required name="dob" type="date" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Gender</label>
                  <select name="gender" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Contact Phone</label>
                  <input name="contact_phone" type="tel" placeholder="+30 6912345678" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Contact Email</label>
                  <input name="contact_email" type="email" placeholder="parent@example.com" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Residential Address</label>
                <input name="address" type="text" placeholder="123 Olive Street, Athens" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Father's Name</label>
                  <input name="father_name" type="text" placeholder="George Doe" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Father's Profession</label>
                  <input name="father_profession" type="text" placeholder="Engineer" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Mother's Name</label>
                  <input name="mother_name" type="text" placeholder="Maria Doe" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Mother's Profession</label>
                  <input name="mother_profession" type="text" placeholder="Doctor" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input id="is_large_family" name="is_large_family" type="checkbox" className="w-4 h-4 text-primary rounded focus:ring-primary" />
                <label htmlFor="is_large_family" className="text-sm font-medium text-gray-700">Large Family (Politeknos / 3+ children)</label>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition" disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm transition flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : 'Add Camper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
