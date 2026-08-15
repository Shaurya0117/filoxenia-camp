import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Stethoscope, Filter, Search } from 'lucide-react';

export default function Medical() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/medical');
      setRecords(res.data);
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
          <h2 className="text-3xl font-bold tracking-tight">Medical Records</h2>
          <p className="text-muted-foreground">Review camper health forms and indications.</p>
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Allergies</th>
              <th className="px-6 py-4">Indications</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">Loading medical records...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">No records found.</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-full text-red-500">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    {record.camper?.first_name} {record.camper?.last_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'doctor_reviewed' ? 'bg-green-500/15 text-green-700' :
                      record.status === 'parent_submitted' ? 'bg-yellow-500/15 text-yellow-700' :
                      'bg-slate-500/15 text-slate-700'
                    }`}>
                      {record.status === 'doctor_reviewed' ? 'Reviewed' : record.status === 'parent_submitted' ? 'Submitted' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{record.allergies || 'None'}</td>
                  <td className="px-6 py-4">
                    {record.conditions?.map((cond, i) => (
                      <span key={i} className="px-2 py-1 bg-pink-500/15 text-pink-700 rounded-full text-xs mr-1">{cond}</span>
                    ))}
                    {(!record.conditions || record.conditions.length === 0) && '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">File</button>
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
