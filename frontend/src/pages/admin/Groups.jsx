import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Tent, Plus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchPeriods();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups');
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriods = async () => {
    try {
      const res = await api.get('/periods');
      setPeriods(res.data || []);
    } catch (err) {
      console.error('Failed to load periods for groups:', err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    
    const assistantsRaw = formData.get('assistants') || '';
    const assistants = assistantsRaw
      ? assistantsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      period_id: parseInt(formData.get('period_id'), 10),
      group_number: parseInt(formData.get('group_number'), 10),
      leader_name: formData.get('leader_name') || undefined,
      assistants
    };

    try {
      await api.post('/groups', payload);
      toast.success('Group created successfully!');
      setShowModal(false);
      fetchGroups();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  const formatAssistants = (assistants) => {
    if (!assistants) return null;
    try {
      const parsed = typeof assistants === 'string' ? JSON.parse(assistants) : assistants;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.join(', ');
      }
    } catch {
      return typeof assistants === 'string' ? assistants : null;
    }
    return null;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Groups & Cabins</h2>
          <p className="text-muted-foreground">Manage camper groups, sessions, and assigned leaders.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
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
              <th className="px-6 py-4">Assistants</th>
              <th className="px-6 py-4">Members</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading groups...
                  </div>
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No groups found.</td>
              </tr>
            ) : (
              groups.map((group) => {
                const assistantsStr = formatAssistants(group.assistants);
                return (
                  <tr key={group.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="bg-orange-500/10 p-2 rounded-full text-orange-500">
                        <Tent className="w-4 h-4" />
                      </div>
                      Group {group.group_number}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{group.period?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium">{group.leader_name || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{assistantsStr || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-muted rounded-full text-xs font-medium">
                        {group.members?.length || 0} Campers
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline font-medium">Manage</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* New Group Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Create New Group</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Period / Session *</label>
                <select required name="period_id" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Select a period</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name} ({new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                {periods.length === 0 && (
                  <p className="text-xs text-amber-600">No periods found. Please create a period first.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Group Number *</label>
                <input required name="group_number" type="number" min="1" placeholder="e.g. 1, 2, 3..." className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Leader Name</label>
                <input name="leader_name" type="text" placeholder="e.g. John Smith" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Assistants (comma-separated)</label>
                <input name="assistants" type="text" placeholder="e.g. Anna Doe, Mark Evans" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition" disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm transition flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
