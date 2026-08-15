import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { ClipboardList, Filter } from 'lucide-react';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/registrations');
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Registrations</h2>
          <p className="text-muted-foreground">Manage camper enrollments and waitlists.</p>
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">Loading registrations...</td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No registrations found.</td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    {reg.camper?.first_name} {reg.camper?.last_name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{reg.period?.name}</td>
                  <td className="px-6 py-4 capitalize">{reg.overnight_type || 'Camp'}</td>
                  <td className="px-6 py-4">{new Date(reg.submitted_at).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reg.status === 'enrolled' ? 'bg-green-500/15 text-green-700' :
                      reg.status === 'waitlisted' ? 'bg-yellow-500/15 text-yellow-700' :
                      'bg-red-500/15 text-red-700'
                    }`}>
                      {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                    </span>
                    {reg.has_mismatch_flag && (
                      <span className="ml-2 px-2 py-1 bg-red-500/15 text-red-700 rounded-full text-xs" title="Age/Gender mismatch">⚠️ Mismatch</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">Review</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
