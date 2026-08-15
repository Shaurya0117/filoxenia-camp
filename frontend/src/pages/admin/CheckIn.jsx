import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { CheckSquare, ScanLine } from 'lucide-react';

export default function CheckIn() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanCode, setScanCode] = useState('');
  const [scanType, setScanType] = useState('arrival');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/checkin');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!scanCode) return;
    try {
      await api.post('/checkin/scan', { registration_code: scanCode, event_type: scanType });
      setScanCode('');
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.error || 'Scan failed');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Check-In / Out</h2>
          <p className="text-muted-foreground">Scan camper QR codes for arrivals and departures.</p>
        </div>
      </div>

      <div className="bg-card p-6 border rounded-xl shadow-sm flex flex-col md:flex-row gap-6 items-end">
        <form onSubmit={handleScan} className="flex-1 flex gap-4 items-end">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Scan QR Code</label>
            <div className="relative">
              <ScanLine className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Registration Code..."
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Type</label>
            <select 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
            >
              <option value="arrival">Arrival</option>
              <option value="departure">Departure</option>
            </select>
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 font-medium transition h-[42px]">
            Submit Scan
          </button>
        </form>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">Event Type</th>
              <th className="px-6 py-4">Scanned At</th>
              <th className="px-6 py-4">Scanned By</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-muted-foreground">Loading logs...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-muted-foreground">No check-in logs.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-teal-500/10 p-2 rounded-full text-teal-500">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    {log.registration?.camper?.first_name} {log.registration?.camper?.last_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      log.event_type === 'arrival' ? 'bg-green-500/15 text-green-700' : 'bg-orange-500/15 text-orange-700'
                    }`}>
                      {log.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(log.scanned_at).toLocaleString()}</td>
                  <td className="px-6 py-4">{log.scanner?.name || 'Unknown'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
