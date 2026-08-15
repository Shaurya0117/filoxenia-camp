import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Tent, Plus } from 'lucide-react';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups');
      setGroups(res.data);
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
          <h2 className="text-3xl font-bold tracking-tight">Groups & Cabins</h2>
          <p className="text-muted-foreground">Manage camper groups and assigned leaders.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition">
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Group #</th>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Leader</th>
              <th className="px-6 py-4">Members</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">Loading groups...</td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">No groups found.</td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr key={group.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2 rounded-full text-orange-500">
                      <Tent className="w-4 h-4" />
                    </div>
                    Group {group.group_number}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{group.period?.name}</td>
                  <td className="px-6 py-4">{group.leader_name || 'Unassigned'}</td>
                  <td className="px-6 py-4">{group.members?.length || 0} Campers</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">Manage</button>
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
