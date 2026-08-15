import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, Plus, Filter, User } from 'lucide-react';

export default function Campers() {
  const [campers, setCampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCampers();
  }, [search]);

  const fetchCampers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/campers?search=${search}`);
      setCampers(res.data.campers);
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
          <h2 className="text-3xl font-bold tracking-tight">Campers</h2>
          <p className="text-muted-foreground">Manage and view all registered campers.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition">
          <Plus className="w-4 h-4" /> Add Camper
        </button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 border rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by name, phone..."
            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-accent transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">DOB</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Parents</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">Loading campers...</td>
              </tr>
            ) : campers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">No campers found.</td>
              </tr>
            ) : (
              campers.map((camper) => (
                <tr key={camper.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    {camper.first_name} {camper.last_name}
                  </td>
                  <td className="px-6 py-4">{new Date(camper.dob).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{camper.contact_phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs">{camper.father_name || 'N/A'} (Father)</div>
                    <div className="text-xs">{camper.mother_name || 'N/A'} (Mother)</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">View</button>
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
