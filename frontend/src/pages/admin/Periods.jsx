import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Calendar, Plus } from 'lucide-react';

export default function Periods() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Periods & Sessions</h2>
          <p className="text-muted-foreground">Manage camp periods, capacities, and pricing.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition">
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
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">Loading periods...</td>
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
                    {period.age_group || 'Any'} / {period.class_range || 'Any'}
                  </td>
                  <td className="px-6 py-4 font-medium">€{period.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      period.status === 'active' ? 'bg-green-500/15 text-green-700' :
                      period.status === 'waitlist' ? 'bg-yellow-500/15 text-yellow-700' :
                      'bg-red-500/15 text-red-700'
                    }`}>
                      {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
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
    </div>
  );
}
