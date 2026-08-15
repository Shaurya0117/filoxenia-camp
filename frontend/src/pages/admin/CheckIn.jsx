import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { CheckSquare, ScanLine, Plus, X, Loader2, Search, Filter, ArrowDownLeft, ArrowUpRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckIn() {
  const [logs, setLogs] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Quick bar scan
  const [scanCode, setScanCode] = useState('');
  const [scanType, setScanType] = useState('arrival');
  const [quickScanning, setQuickScanning] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/checkin');
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to fetch check-in logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/registrations');
      setRegistrations(res.data || []);
    } catch (err) {
      console.error('Failed to load registrations for modal dropdown:', err);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    fetchRegistrations();
  };

  const handleQuickScan = async (e) => {
    e.preventDefault();
    if (!scanCode.trim()) {
      toast.error('Please enter or scan a registration code');
      return;
    }
    try {
      setQuickScanning(true);
      const res = await api.post('/checkin/scan', { 
        registration_code: scanCode.trim(), 
        event_type: scanType 
      });
      toast.success(res.data.message || `Successfully logged ${scanType}!`);
      setScanCode('');
      fetchLogs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Scan failed');
    } finally {
      setQuickScanning(false);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const registration_code = formData.get('registration_code')?.trim();
    const event_type = formData.get('event_type');

    if (!registration_code) {
      toast.error('Registration code is required');
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post('/checkin/scan', {
        registration_code,
        event_type
      });
      toast.success(res.data.message || `Successfully logged ${event_type}!`);
      setShowModal(false);
      fetchLogs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to log check-in');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const camperName = `${log.registration?.camper?.first_name || ''} ${log.registration?.camper?.last_name || ''}`.toLowerCase();
    const periodName = (log.registration?.period?.name || '').toLowerCase();
    const scannerName = (log.scanner?.name || '').toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = camperName.includes(query) || periodName.includes(query) || scannerName.includes(query);
    const matchesType = filterType === 'all' || log.event_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Check-In / Out</h2>
          <p className="text-muted-foreground">Scan camper QR codes and manage attendance records.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition shadow-sm font-medium self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Check-In
        </button>
      </div>

      {/* Quick Scanner Box */}
      <div className="bg-card p-6 border rounded-xl shadow-sm">
        <form onSubmit={handleQuickScan} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1 w-full">
            <label className="text-sm font-medium flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-primary" /> Quick Scan / Code Input
            </label>
            <div className="relative">
              <input
                autoFocus
                className="w-full px-4 py-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                placeholder="Enter or scan QR registration code..."
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 w-full md:w-48">
            <label className="text-sm font-medium">Event Type</label>
            <select 
              className="w-full p-2.5 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm"
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
            >
              <option value="arrival">Arrival (Check-in)</option>
              <option value="departure">Departure (Check-out)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={quickScanning}
            className="w-full md:w-auto bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 font-medium transition shadow-sm flex items-center justify-center gap-2 h-[42px]"
          >
            {quickScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
            {quickScanning ? 'Processing...' : 'Submit Scan'}
          </button>
        </form>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 border rounded-xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by camper name, period, or staff scanner..."
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            className="p-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="arrival">Arrivals Only</option>
            <option value="departure">Departures Only</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Event Type</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Scanned By</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span>Loading check-in logs...</span>
                  </div>
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                  No check-in / check-out logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        log.event_type === 'arrival' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'
                      }`}>
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {log.registration?.camper?.first_name} {log.registration?.camper?.last_name}
                        </div>
                        {log.registration?.camper?.contact_phone && (
                          <div className="text-xs text-muted-foreground">{log.registration?.camper?.contact_phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {log.registration?.period?.name || `Period #${log.registration?.period_id || '-'}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      log.event_type === 'arrival' 
                        ? 'bg-green-500/15 text-green-700' 
                        : 'bg-orange-500/15 text-orange-700'
                    }`}>
                      {log.event_type === 'arrival' ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                      {log.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {new Date(log.scanned_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{log.scanner?.name || 'Staff User'}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Check-In Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Record Camper Check-In</h2>
                <p className="text-sm text-gray-500">Log an arrival or departure event for a camper.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              {/* Optional Registration Selector Helper */}
              {registrations.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Quick Select Enrolled Camper (Optional)</label>
                  <select 
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                    onChange={(e) => {
                      const input = document.getElementById('modal_registration_code');
                      if (input && e.target.value) {
                        input.value = e.target.value;
                      }
                    }}
                  >
                    <option value="">-- Choose Camper to Autofill Code --</option>
                    {registrations
                      .filter((r) => r.registration_code)
                      .map((r) => (
                        <option key={r.id} value={r.registration_code}>
                          {r.camper?.first_name} {r.camper?.last_name} — {r.period?.name} ({r.status})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Registration Code / QR Code Payload</label>
                <input 
                  id="modal_registration_code"
                  required 
                  name="registration_code" 
                  type="text"
                  placeholder="e.g. 3a51f8bc-b2b8-4c17-8e6f-..."
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm font-mono"
                />
                <p className="text-xs text-muted-foreground">Enter the UUID code from the camper's registration or QR pass.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Event Type</label>
                <select 
                  required 
                  name="event_type" 
                  defaultValue="arrival"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white text-sm"
                >
                  <option value="arrival">Arrival (Check-in)</option>
                  <option value="departure">Departure (Check-out)</option>
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
                  {submitting ? 'Recording...' : 'Log Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
