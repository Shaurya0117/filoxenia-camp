import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, CheckCircle, AlertCircle, FilePlus } from 'lucide-react';
import api from '../../lib/api';

export default function FireProtection() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const res = await api.get('/safety');
        setChecks(res.data);
      } catch (err) {
        console.error('Failed to fetch safety checks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChecks();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-red-100">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <ShieldCheck className="text-red-500 w-8 h-8" /> 
            Fire Protection & Safety
          </h1>
          <p className="text-gray-500 mt-2">Manage safety checks, fire equipment status, and compliance logs.</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition flex items-center gap-2 font-medium shadow-sm">
          <FilePlus className="w-5 h-5" /> New Inspection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Extinguishers Checked</p>
            <h3 className="text-2xl font-bold text-gray-900">42 / 42</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Compliance Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">98%</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-amber-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium">Pending Actions</p>
            <h3 className="text-2xl font-bold text-gray-900">1</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Recent Safety Checks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Location</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Inspector</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {checks.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">No safety checks found</td></tr>
              ) : checks.map(chk => (
                <tr key={chk.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                    {new Date(chk.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{chk.area}</td>
                  <td className="px-6 py-4 text-gray-700">{chk.notes || 'General Inspection'}</td>
                  <td className="px-6 py-4 text-gray-600">{chk.inspector?.name || 'System'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      chk.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {chk.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
