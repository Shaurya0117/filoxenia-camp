import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { ShieldCheck, Plus, CheckCircle2, XCircle } from 'lucide-react';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff');
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }) => (
    status ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-muted-foreground/30" />
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff Directory</h2>
          <p className="text-muted-foreground">Manage camp personnel and certifications.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b text-center">
            <tr>
              <th className="px-6 py-4 text-left">Name & Role</th>
              <th className="px-6 py-4">Background Check</th>
              <th className="px-6 py-4">Ministry Statement</th>
              <th className="px-6 py-4">Health Check</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-center">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-muted-foreground">Loading staff...</td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-muted-foreground">No staff members found.</td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3 text-left">
                    <div className="bg-purple-500/10 p-2 rounded-full text-purple-500">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div>{member.name}</div>
                      <div className="text-xs text-muted-foreground font-normal">{member.role_title || 'Staff'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center"><StatusIcon status={member.background_check} /></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center"><StatusIcon status={member.ministry_statement} /></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center"><StatusIcon status={member.health_check} /></div>
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
