import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { ClipboardList, Plus, X, Loader2, Search, Filter, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [campers, setCampers] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/registrations');
      setRegistrations(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [campersRes, periodsRes] = await Promise.all([
        api.get('/campers?limit=200'),
        api.get('/periods')
      ]);
      const camperList = Array.isArray(campersRes.data) 
        ? campersRes.data 
        : (campersRes.data?.campers || []);
      const periodList = Array.isArray(periodsRes.data)
        ? periodsRes.data
        : (periodsRes.data?.periods || []);
      setCampers(camperList);
      setPeriods(periodList);
    } catch (err) {
      console.error('Failed to load campers or periods for modal:', err);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    fetchDropdownData();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const camper_id = parseInt(formData.get('camper_id'), 10);
    const period_id = parseInt(formData.get('period_id'), 10);
    const overnight_type = formData.get('overnight_type');

    if (!camper_id || !period_id) {
      toast.error('Please select both a camper and a period');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/registrations', {
        camper_id,
        period_id,
        overnight_type
      });
      toast.success('Registration created successfully!');
      setShowModal(false);
      fetchRegistrations();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create registration');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/registrations/${id}/status`, { status: newStatus });
      toast.success(`Registration status updated to ${newStatus}`);
      fetchRegistrations();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const camperName = `${reg.camper?.first_name || ''} ${reg.camper?.last_name || ''}`.toLowerCase();
    const periodName = (reg.period?.name || '').toLowerCase();
    const regCode = (reg.registration_code || '').toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = camperName.includes(query) || periodName.includes(query) || regCode.includes(query);
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Registrations</h2>
          <p className="text-muted-foreground">Manage camper enrollments, waitlists, and session placements.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition shadow-sm font-medium self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Registration
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 border rounded-xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by camper name, period, or registration code..."
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            className="p-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="enrolled">Enrolled</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Registration Code</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span>Loading registrations...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                  No registrations found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {reg.camper?.first_name} {reg.camper?.last_name}
                        </div>
                        {reg.camper?.contact_phone && (
                          <div className="text-xs text-muted-foreground">{reg.camper.contact_phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{reg.period?.name || `Period #${reg.period_id}`}</div>
                    {reg.period?.age_group && (
                      <div className="text-xs text-muted-foreground">{reg.period.age_group} • {reg.period.gender || 'Any'}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 capitalize text-muted-foreground">
                    {reg.overnight_type || 'Standard'}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {reg.registration_code ? reg.registration_code.substring(0, 8) + '...' : '-'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {reg.submitted_at ? new Date(reg.submitted_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        reg.status === 'enrolled' ? 'bg-green-500/15 text-green-700' :
                        reg.status === 'waitlisted' ? 'bg-yellow-500/15 text-yellow-700' :
                        'bg-red-500/15 text-red-700'
                      }`}>
                        {reg.status === 'enrolled' && <CheckCircle2 className="w-3 h-3" />}
                        {reg.status === 'waitlisted' && <Clock className="w-3 h-3" />}
                        {reg.status ? (reg.status.charAt(0).toUpperCase() + reg.status.slice(1)) : 'Enrolled'}
                      </span>
                      {reg.has_mismatch_flag && (
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/15 text-red-700 rounded-full text-xs font-semibold"
                          title="Age or Gender mismatch detected with Period guidelines"
                        >
                          <AlertTriangle className="w-3 h-3" /> Mismatch
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={reg.status}
                      onChange={(e) => handleStatusUpdate(reg.id, e.target.value)}
                      className="text-xs bg-transparent border rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="enrolled">Set Enrolled</option>
                      <option value="waitlisted">Set Waitlisted</option>
                      <option value="cancelled">Set Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">New Camper Registration</h2>
                <p className="text-sm text-gray-500">Enroll a registered camper into a camp period.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Select Camper</label>
                <select 
                  required 
                  name="camper_id" 
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                >
                  <option value="">-- Select Camper --</option>
                  {campers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} {c.gender ? `(${c.gender})` : ''} {c.dob ? `- Born ${new Date(c.dob).toLocaleDateString()}` : ''}
                    </option>
                  ))}
                </select>
                {campers.length === 0 && (
                  <p className="text-xs text-muted-foreground">No campers found. Please ensure campers are registered first.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Select Camp Period</label>
                <select 
                  required 
                  name="period_id" 
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                >
                  <option value="">-- Select Period --</option>
                  {periods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()}) - Cap: {p.capacity}
                    </option>
                  ))}
                </select>
                {periods.length === 0 && (
                  <p className="text-xs text-muted-foreground">No periods available.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Overnight / Attendance Type</label>
                <select 
                  name="overnight_type" 
                  defaultValue="Day Camp"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                >
                  <option value="Day Camp">Day Camp</option>
                  <option value="Overnight">Overnight</option>
                  <option value="Full Session">Full Session</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition" 
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Creating Registration...' : 'Create Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
