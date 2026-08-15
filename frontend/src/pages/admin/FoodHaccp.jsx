import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { 
  Utensils, Thermometer, ShieldAlert, CheckCircle2, 
  AlertTriangle, Truck, ClipboardCheck, Plus, X, 
  Loader2, Search, Filter, RefreshCw
} from 'lucide-react';

export default function FoodHaccp() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const [formData, setFormData] = useState({
    type: 'temperature',
    description: '',
    status: 'ok',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchFoodLogs();
  }, []);

  const fetchFoodLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/food');
      setLogs(res.data || []);
    } catch (err) {
      console.error('Error fetching food logs:', err);
      toast.error('Failed to load food HACCP logs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        type: formData.type,
        description: formData.description.trim(),
        status: formData.status,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
      };

      await api.post('/food', payload);
      toast.success('Food HACCP log added successfully!');
      setShowModal(false);
      setFormData({
        type: 'temperature',
        description: '',
        status: 'ok',
        date: new Date().toISOString().split('T')[0]
      });
      fetchFoodLogs();
    } catch (err) {
      console.error('Error creating food log:', err);
      toast.error(err.response?.data?.error || 'Failed to create food log');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.recorder?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || log.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ok':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> OK / Compliant
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Warning
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Critical
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-emerald-500" />;
      case 'critical_point':
        return <ClipboardCheck className="w-4 h-4 text-blue-500" />;
      case 'cleanliness':
        return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
      case 'supplier_receipt':
      case 'supplier':
        return <Truck className="w-4 h-4 text-orange-500" />;
      default:
        return <Utensils className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTypeLabel = (type) => {
    switch (type) {
      case 'temperature':
        return 'Temperature Check';
      case 'critical_point':
        return 'Critical Control Point';
      case 'cleanliness':
        return 'Hygiene & Cleanliness';
      case 'supplier_receipt':
      case 'supplier':
        return 'Supplier Delivery';
      default:
        return type ? type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ') : 'General Log';
    }
  };

  const tempCount = logs.filter(l => l.type === 'temperature').length;
  const criticalCount = logs.filter(l => l.type === 'critical_point').length;
  const cleanlinessCount = logs.filter(l => l.type === 'cleanliness').length;
  const supplierCount = logs.filter(l => l.type === 'supplier_receipt' || l.type === 'supplier').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
              <Utensils className="w-7 h-7" />
            </div>
            Food Management - HACCP
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor kitchen temperatures, critical control points, cleanliness, and supplier logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchFoodLogs}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50 transition"
            title="Refresh logs"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 shadow-sm transition font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Add HACCP Log
          </button>
        </div>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div 
          onClick={() => setSelectedType(selectedType === 'temperature' ? 'all' : 'temperature')}
          className={`bg-white p-5 rounded-2xl border transition cursor-pointer shadow-sm ${
            selectedType === 'temperature' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <Thermometer className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{tempCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mt-3">Temperatures</h3>
          <p className="text-xs text-gray-500 mt-0.5">E03 Cooling & Heating Register</p>
        </div>

        <div 
          onClick={() => setSelectedType(selectedType === 'critical_point' ? 'all' : 'critical_point')}
          className={`bg-white p-5 rounded-2xl border transition cursor-pointer shadow-sm ${
            selectedType === 'critical_point' ? 'border-blue-500 ring-2 ring-blue-100' : 'hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{criticalCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mt-3">Critical Points</h3>
          <p className="text-xs text-gray-500 mt-0.5">Q03A Safety Checklist</p>
        </div>

        <div 
          onClick={() => setSelectedType(selectedType === 'cleanliness' ? 'all' : 'cleanliness')}
          className={`bg-white p-5 rounded-2xl border transition cursor-pointer shadow-sm ${
            selectedType === 'cleanliness' ? 'border-purple-500 ring-2 ring-purple-100' : 'hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-purple-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{cleanlinessCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mt-3">Cleanliness</h3>
          <p className="text-xs text-gray-500 mt-0.5">Q16 Sanitation Standard</p>
        </div>

        <div 
          onClick={() => setSelectedType(selectedType === 'supplier_receipt' ? 'all' : 'supplier_receipt')}
          className={`bg-white p-5 rounded-2xl border transition cursor-pointer shadow-sm ${
            selectedType === 'supplier_receipt' ? 'border-orange-500 ring-2 ring-orange-100' : 'hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-orange-50 rounded-xl">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{supplierCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mt-3">Suppliers</h3>
          <p className="text-xs text-gray-500 mt-0.5">Q8A Inbound Goods</p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search description, recorder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-sm border rounded-xl bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All HACCP Types</option>
              <option value="temperature">Temperatures</option>
              <option value="critical_point">Critical Points</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="supplier_receipt">Suppliers</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description / Findings</th>
                <th className="px-6 py-4">Recorded By</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span>Loading HACCP logs...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="font-medium text-gray-600">No HACCP logs found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {searchTerm || selectedType !== 'all' 
                          ? 'Try adjusting your filters' 
                          : 'Click "Add HACCP Log" above to record the first entry.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {log.date ? new Date(log.date).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          {getTypeIcon(log.type)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {formatTypeLabel(log.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-normal text-gray-800">
                      {log.description || log.desc || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {log.recorder?.name || 'Staff User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {getStatusBadge(log.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* State-controlled Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Utensils className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Record HACCP Food Log</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">HACCP Category</label>
                <select
                  required
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-sm"
                >
                  <option value="temperature">Temperature Control (Freezer / Fridge / Cooked Food)</option>
                  <option value="critical_point">Critical Control Point (CCP) Checklist</option>
                  <option value="cleanliness">Kitchen & Prep Sanitation / Cleanliness</option>
                  <option value="supplier_receipt">Supplier Delivery / Receipt Inspection</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Log Date</label>
                  <input
                    required
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Compliance Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-sm"
                  >
                    <option value="ok">OK / Compliant</option>
                    <option value="warning">Warning / Notice Required</option>
                    <option value="critical">Critical / Non-Compliant</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Description & Observations <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Freezer A measured at -18.5°C. All goods properly stored and labeled."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
                ></textarea>
              </div>

              {/* Modal Actions */}
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
                  {submitting ? 'Saving Log...' : 'Save Log Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
