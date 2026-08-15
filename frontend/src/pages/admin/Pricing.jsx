import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { 
  CreditCard, FileText, CheckCircle2, Search, Plus, 
  X, Loader2, RefreshCw, Clock, XCircle, Filter
} from 'lucide-react';

export default function Pricing() {
  const [invoices, setInvoices] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    registration_id: '',
    amount: '',
    status: 'not_issued',
    due_date: '',
    apy_number: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchRegistrations();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/invoices');
      setInvoices(res.data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      toast.error('Failed to load invoices (APY)');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/registrations');
      setRegistrations(res.data || []);
    } catch (err) {
      console.error('Error fetching registrations for invoice picker:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill amount from selected registration if amount not already modified
    if (name === 'registration_id' && value) {
      const selectedReg = registrations.find(r => r.id === parseInt(value, 10));
      if (selectedReg && selectedReg.period?.price) {
        setFormData(prev => ({
          ...prev,
          amount: selectedReg.period.price.toString()
        }));
      }
    }
  };

  const handleOpenModal = () => {
    const defaultApy = `APY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      registration_id: registrations.length > 0 ? registrations[0].id.toString() : '',
      amount: registrations.length > 0 && registrations[0].period?.price ? registrations[0].period.price.toString() : '',
      status: 'not_issued',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      apy_number: defaultApy
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.registration_id) {
      toast.error('Please select a registration');
      return;
    }
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        registration_id: parseInt(formData.registration_id, 10),
        amount: parseFloat(formData.amount),
        status: formData.status || 'not_issued',
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        apy_number: formData.apy_number?.trim() || null
      };

      await api.post('/invoices', payload);
      toast.success('Invoice (APY) created successfully!');
      setShowModal(false);
      fetchInvoices();
    } catch (err) {
      console.error('Error creating invoice:', err);
      toast.error(err.response?.data?.error || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickIssue = async (invoiceId) => {
    try {
      await api.put(`/invoices/${invoiceId}`, { status: 'issued' });
      toast.success('Invoice issued successfully!');
      fetchInvoices();
    } catch (err) {
      console.error('Error updating invoice status:', err);
      toast.error(err.response?.data?.error || 'Failed to update invoice');
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const camperName = inv.registration?.camper 
      ? `${inv.registration.camper.first_name} ${inv.registration.camper.last_name}`.toLowerCase()
      : '';
    const periodName = (inv.registration?.period?.name || '').toLowerCase();
    const apyNum = (inv.apy_number || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = camperName.includes(query) || periodName.includes(query) || apyNum.includes(query);
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);
  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);
  const pendingCount = invoices.filter(inv => inv.status === 'not_issued').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid / Settled
          </span>
        );
      case 'issued':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <FileText className="w-3.5 h-3.5" /> Published - APY
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      case 'not_issued':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Not Issued
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
              <CreditCard className="w-7 h-7" />
            </div>
            Calandra Campers Pricing (APY / Invoices)
          </h1>
          <p className="text-gray-500 mt-1">
            Manage camper invoice receipts (APY), subsidies, and billing records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchInvoices(); fetchRegistrations(); }}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50 transition"
            title="Refresh Invoices"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 shadow-sm transition font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Issue New APY
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Invoiced</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              €{totalInvoiced.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collected / Paid</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              €{totalPaid.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Issuance</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">
              {pendingCount} <span className="text-sm font-normal text-gray-500">records</span>
            </h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search camper name, APY #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-sm border rounded-xl bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Invoices</option>
              <option value="not_issued">Not Issued</option>
              <option value="issued">Issued / Published</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">APY Number</th>
                <th className="px-6 py-4">Camper Name</th>
                <th className="px-6 py-4">Camp Period</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span>Loading invoices...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <CreditCard className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="font-medium text-gray-600">No invoices or APY records found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Click "Issue New APY" above to generate a new invoice.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((row) => {
                  const camper = row.registration?.camper;
                  const period = row.registration?.period;
                  const fullName = camper 
                    ? `${camper.first_name} ${camper.last_name}` 
                    : `Registration #${row.registration_id}`;

                  return (
                    <tr key={row.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900 text-xs">
                        {row.apy_number || `APY-GEN-${row.id}`}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {fullName}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {period?.name || 'Standard Camp Session'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        €{parseFloat(row.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {row.status === 'not_issued' ? (
                          <button
                            onClick={() => handleQuickIssue(row.id)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> Issue APY
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">
                            {row.issued_at ? new Date(row.issued_at).toLocaleDateString() : 'Issued'}
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
      </div>

      {/* State-Controlled Modal for New Invoice / APY */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Issue New Invoice (APY)</h2>
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
                  Camper Registration <span className="text-red-500">*</span>
                </label>
                {registrations.length > 0 ? (
                  <select
                    required
                    name="registration_id"
                    value={formData.registration_id}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-sm"
                  >
                    <option value="">-- Select Camper Registration --</option>
                    {registrations.map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        #{reg.id} - {reg.camper?.first_name} {reg.camper?.last_name} ({reg.period?.name || 'Session'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    type="number"
                    name="registration_id"
                    value={formData.registration_id}
                    onChange={handleInputChange}
                    placeholder="Enter Registration ID (e.g. 1)"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Amount (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g. 180.00"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">APY / Invoice Number</label>
                  <input
                    name="apy_number"
                    type="text"
                    value={formData.apy_number}
                    onChange={handleInputChange}
                    placeholder="e.g. APY-2026-001"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-sm"
                  >
                    <option value="not_issued">Not Issued (Draft)</option>
                    <option value="issued">Issued / Published</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Due Date</label>
                  <input
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
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
                  {submitting ? 'Creating APY...' : 'Create Invoice (APY)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
