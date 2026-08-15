import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, Plus, CheckCircle2, XCircle, Loader2, 
  Search, X, RefreshCw, UserCheck, Phone, Shield
} from 'lucide-react';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    role_title: 'Camp Counselor',
    phone: '',
    background_check: false,
    ministry_statement: false,
    health_check: false,
    active: true
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff');
      setStaff(res.data || []);
    } catch (err) {
      console.error('Error fetching staff:', err);
      toast.error('Failed to load staff directory');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpenModal = () => {
    setFormData({
      name: '',
      role_title: 'Camp Counselor',
      phone: '',
      background_check: false,
      ministry_statement: false,
      health_check: false,
      active: true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Staff name is required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        role_title: formData.role_title.trim() || 'Staff',
        phone: formData.phone.trim() || null,
        background_check: Boolean(formData.background_check),
        ministry_statement: Boolean(formData.ministry_statement),
        health_check: Boolean(formData.health_check),
        active: Boolean(formData.active)
      };

      await api.post('/staff', payload);
      toast.success('Staff member registered successfully!');
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      console.error('Error creating staff:', err);
      toast.error(err.response?.data?.error || 'Failed to create staff member');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStaff = staff.filter(member => {
    const nameMatch = (member.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = (member.role_title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = (member.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || roleMatch || phoneMatch;
  });

  const totalStaff = staff.length;
  const backgroundCleared = staff.filter(s => s.background_check).length;
  const fullyCertified = staff.filter(s => s.background_check && s.ministry_statement && s.health_check).length;
  const activeCount = staff.filter(s => s.active).length;

  const StatusIcon = ({ status }) => (
    status ? (
      <div className="inline-flex items-center justify-center p-1 bg-emerald-500/10 text-emerald-600 rounded-full">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    ) : (
      <div className="inline-flex items-center justify-center p-1 bg-gray-100 text-gray-400 rounded-full">
        <XCircle className="w-4 h-4" />
      </div>
    )
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
              <ShieldCheck className="w-7 h-7" />
            </div>
            Staff Directory & Certifications
          </h1>
          <p className="text-gray-500 mt-1">
            Manage camp personnel, roles, legal declarations, and health clearances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStaff}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50 transition"
            title="Refresh Staff"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 shadow-sm transition font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Staff</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalStaff}</h3>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Background Checks</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{backgroundCleared} / {totalStaff}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">100% Certified</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">{fullyCertified}</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active On Duty</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{activeCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Staff Table Card */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, role, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-sm border rounded-xl bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Showing {filteredStaff.length} of {staff.length} staff members
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b text-xs uppercase tracking-wider text-center">
              <tr>
                <th className="px-6 py-4 text-left">Name & Role</th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4">Background Check</th>
                <th className="px-6 py-4">Ministry Statement</th>
                <th className="px-6 py-4">Health Check</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-center text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span>Loading staff members...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <ShieldCheck className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="font-medium text-gray-600">No staff members found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {searchTerm ? 'Try adjusting your search' : 'Click "Add Staff" above to register personnel.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-medium flex items-center gap-3 text-left">
                      <div className="bg-purple-500/10 p-2.5 rounded-full text-purple-600 font-bold text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold">{member.name}</div>
                        <div className="text-xs text-gray-500 font-normal">{member.role_title || 'General Staff'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left text-gray-600 text-xs">
                      {member.phone ? (
                        <span className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {member.phone}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center"><StatusIcon status={member.background_check} /></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center"><StatusIcon status={member.ministry_statement} /></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center"><StatusIcon status={member.health_check} /></div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        member.active !== false
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {member.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* State-Controlled Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Add Staff Member</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Maria Papadopoulou"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Role / Position</label>
                  <input
                    type="text"
                    name="role_title"
                    value={formData.role_title}
                    onChange={handleInputChange}
                    placeholder="e.g. Camp Counselor, Nurse"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +30 691 234 5678"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              {/* Compliance & Certifications Checkboxes */}
              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-700 block mb-2.5">
                  Compliance & Certifications
                </label>
                <div className="space-y-2.5 bg-gray-50 p-4 rounded-xl border">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="background_check"
                      checked={formData.background_check}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Criminal Record / Background Check Clearance
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="ministry_statement"
                      checked={formData.ministry_statement}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Ministry of Education Solemn Statement
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="health_check"
                      checked={formData.health_check}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Medical / Health Examination Certificate
                    </span>
                  </label>

                  <div className="pt-2 border-t mt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-900 font-semibold">
                        Active Staff Member (Assigned to Duty)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm transition flex items-center gap-2 text-sm disabled:opacity-70"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving Staff...' : 'Save Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
