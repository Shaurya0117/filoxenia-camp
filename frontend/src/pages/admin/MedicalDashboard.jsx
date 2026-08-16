import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { AlertCircle, FileText, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MedicalDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/medical');
      setRecords(res.data);
    } catch (err) {
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const markAsReviewed = async (id) => {
    try {
      await api.put(`/medical/${id}/review`, { status: 'doctor_reviewed' });
      toast.success('Record marked as reviewed');
      fetchRecords();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="p-8">Loading Medical Dashboard...</div>;

  const criticalRecords = records.filter(r => r.allergies && r.allergies.length > 0);
  const pendingRecords = records.filter(r => r.status === 'parent_submitted' || r.status === 'pending');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Medical Staff Dashboard</h1>
        <p className="text-gray-500 mt-1">Review camper medical forms and critical alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col items-center text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <h2 className="text-2xl font-black text-red-700">{criticalRecords.length}</h2>
          <p className="text-sm font-medium text-red-600 uppercase tracking-widest mt-1">Critical Allergies</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex flex-col items-center text-center">
          <Clock className="w-8 h-8 text-amber-500 mb-2" />
          <h2 className="text-2xl font-black text-amber-700">{pendingRecords.length}</h2>
          <p className="text-sm font-medium text-amber-600 uppercase tracking-widest mt-1">Pending Review</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center text-center">
          <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
          <h2 className="text-2xl font-black text-emerald-700">{records.length - pendingRecords.length}</h2>
          <p className="text-sm font-medium text-emerald-600 uppercase tracking-widest mt-1">Cleared</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Camper Medical Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Camper</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Allergies</th>
                <th className="p-4 font-semibold">Emergency Contact</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No records found.</td></tr>
              ) : (
                records.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{record.camper?.first_name} {record.camper?.last_name}</div>
                      <div className="text-xs text-gray-500">ID: #{record.camper_id}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                        record.status === 'doctor_reviewed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {record.status === 'doctor_reviewed' ? 'REVIEWED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4">
                      {record.allergies ? (
                        <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded">
                          <AlertCircle className="w-3 h-3" /> {record.allergies}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {record.emergency_contact} <br/> {record.emergency_phone}
                    </td>
                    <td className="p-4 text-right">
                      {record.status !== 'doctor_reviewed' && (
                        <button 
                          onClick={() => markAsReviewed(record.id)}
                          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Mark Reviewed
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
