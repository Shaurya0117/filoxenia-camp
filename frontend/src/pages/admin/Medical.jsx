import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Stethoscope, Plus, X, Loader2, Search, Filter, Phone, UserCheck, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Medical() {
  const [records, setRecords] = useState([]);
  const [campers, setCampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/medical');
      setRecords(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to fetch medical records');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampers = async () => {
    try {
      const res = await api.get('/campers?limit=200');
      const camperList = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.campers || []);
      setCampers(camperList);
    } catch (err) {
      console.error('Failed to load campers for modal:', err);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    fetchCampers();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const camper_id = parseInt(formData.get('camper_id'), 10);
    const allergies = formData.get('allergies')?.trim();
    const conditionsRaw = formData.get('conditions')?.trim();
    const medications = formData.get('medications')?.trim();
    const emergency_contact = formData.get('emergency_contact')?.trim();
    const emergency_phone = formData.get('emergency_phone')?.trim();

    if (!camper_id) {
      toast.error('Please select a camper');
      setSubmitting(false);
      return;
    }

    // Parse comma-separated conditions into an array
    const conditions = conditionsRaw 
      ? conditionsRaw.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    try {
      await api.post('/medical', {
        camper_id,
        allergies: allergies || null,
        conditions,
        medications: medications || null,
        emergency_contact: emergency_contact || null,
        emergency_phone: emergency_phone || null
      });
      toast.success('Medical record saved successfully!');
      setShowModal(false);
      fetchRecords();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to save medical record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDoctorReview = async (id) => {
    try {
      await api.put(`/medical/${id}/review`, { status: 'doctor_reviewed' });
      toast.success('Record marked as Doctor Reviewed!');
      fetchRecords();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to update review status');
    }
  };

  const parseConditions = (conditions) => {
    if (!conditions) return [];
    if (Array.isArray(conditions)) return conditions;
    try {
      const parsed = JSON.parse(conditions);
      if (Array.isArray(parsed)) return parsed;
      return [String(parsed)];
    } catch {
      return typeof conditions === 'string' 
        ? conditions.split(',').map((s) => s.trim()).filter(Boolean) 
        : [];
    }
  };

  const filteredRecords = records.filter((rec) => {
    const camperName = `${rec.camper?.first_name || ''} ${rec.camper?.last_name || ''}`.toLowerCase();
    const allergies = (rec.allergies || '').toLowerCase();
    const parsedConds = parseConditions(rec.conditions).join(' ').toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = camperName.includes(query) || allergies.includes(query) || parsedConds.includes(query);
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medical Records</h2>
          <p className="text-muted-foreground">Review health histories, allergies, indications, and medical clearances.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition shadow-sm font-medium self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Medical Record
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 border rounded-xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by camper name, allergy, condition..."
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
            <option value="all">All Records</option>
            <option value="doctor_reviewed">Doctor Reviewed</option>
            <option value="parent_submitted">Submitted</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Allergies</th>
              <th className="px-6 py-4">Conditions / Indications</th>
              <th className="px-6 py-4">Medications</th>
              <th className="px-6 py-4">Emergency Contact</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span>Loading medical records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                  No medical records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const conditionsList = parseConditions(record.conditions);
                return (
                  <tr key={record.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-500/10 p-2 rounded-full text-red-500">
                          <Stethoscope className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {record.camper?.first_name} {record.camper?.last_name}
                          </div>
                          {record.camper?.dob && (
                            <div className="text-xs text-muted-foreground">
                              DOB: {new Date(record.camper.dob).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'doctor_reviewed' ? 'bg-green-500/15 text-green-700' :
                        record.status === 'parent_submitted' ? 'bg-yellow-500/15 text-yellow-700' :
                        'bg-slate-500/15 text-slate-700'
                      }`}>
                        {record.status === 'doctor_reviewed' && <CheckCircle2 className="w-3 h-3" />}
                        {record.status === 'parent_submitted' && <Clock className="w-3 h-3" />}
                        {record.status === 'doctor_reviewed' ? 'Reviewed' : record.status === 'parent_submitted' ? 'Submitted' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.allergies ? (
                        <span className="text-red-700 bg-red-500/10 px-2 py-0.5 rounded text-xs font-medium">
                          {record.allergies}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {conditionsList.length > 0 ? (
                          conditionsList.map((cond, i) => (
                            <span key={i} className="px-2 py-0.5 bg-pink-500/15 text-pink-700 rounded-full text-xs font-medium">
                              {cond}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {record.medications || 'None'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-foreground">
                        {record.emergency_contact || 'N/A'}
                      </div>
                      {record.emergency_phone && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {record.emergency_phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {record.status !== 'doctor_reviewed' ? (
                        <button 
                          onClick={() => handleDoctorReview(record.id)}
                          className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 font-medium px-2.5 py-1 rounded transition"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Mark Reviewed
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Done
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* New Medical Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Medical Record / Health Form</h2>
                <p className="text-sm text-gray-500">Record health history, emergency info, and medical directives.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
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
                      {c.first_name} {c.last_name} {c.dob ? `(DOB: ${new Date(c.dob).toLocaleDateString()})` : ''}
                    </option>
                  ))}
                </select>
                {campers.length === 0 && (
                  <p className="text-xs text-muted-foreground">No campers available.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Allergies</label>
                <input 
                  name="allergies" 
                  type="text"
                  placeholder="e.g. Peanuts, Penicillin, Bee stings"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Conditions / Diagnoses (comma separated)</label>
                <input 
                  name="conditions" 
                  type="text"
                  placeholder="e.g. Asthma, Type 1 Diabetes, Epilepsy"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Medications & Instructions</label>
                <textarea 
                  name="medications" 
                  rows="2"
                  placeholder="e.g. Albuterol inhaler 2 puffs prior to physical exertion"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Emergency Contact Name</label>
                  <input 
                    name="emergency_contact" 
                    type="text"
                    placeholder="e.g. Sarah Jenkins (Mother)"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Emergency Phone</label>
                  <input 
                    name="emergency_phone" 
                    type="tel"
                    placeholder="e.g. +1 (555) 234-5678"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                  />
                </div>
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
                  {submitting ? 'Saving...' : 'Save Medical Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
