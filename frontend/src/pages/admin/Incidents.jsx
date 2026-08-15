import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await api.get('/incidents');
        setIncidents(res.data);
      } catch (err) {
        console.error('Failed to fetch incidents', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <AlertTriangle className="text-amber-500 w-8 h-8" /> 
            Incidents Archive
          </h1>
          <p className="text-gray-500 mt-2">Track camper incidents, medical events, and actions taken.</p>
        </div>
        <button className="bg-[#1a2b4c] hover:bg-[#0f1930] text-white px-6 py-3 rounded-xl transition flex items-center gap-2 font-medium shadow-sm">
          <Plus className="w-5 h-5" /> Log Incident
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Recent Logs</h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a2b4c] outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Camper</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Description</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {incidents.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">No incidents found</td></tr>
              ) : incidents.map(inc => (
                <tr key={inc.id} className="hover:bg-gray-50 transition cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                    {new Date(inc.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {inc.camper ? `${inc.camper.first_name} ${inc.camper.last_name}` : 'General'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inc.type === 'Medical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {inc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{inc.description}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Resolved
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
