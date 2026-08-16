import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { User, Calendar, ClipboardList, Stethoscope, LogOut, Tent, Plus, X, Menu, Loader2 } from 'lucide-react';

import NotificationsTicker from '../../components/NotificationsTicker';

export default function ParentPortal() {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [selectedMedicalCamper, setSelectedMedicalCamper] = useState(null);
  const [medicalSubmitting, setMedicalSubmitting] = useState(false);

  const fetchChildren = async () => {
    try {
      // In a real app we would fetch children specific to this parent.
      // For now we'll just fetch all or filter by email if possible.
      const res = await api.get('/campers');
      // Just showing top 3 for demo if no parent filter
      setChildren(res.data.campers.slice(0, 3) || []);
    } catch (err) {
      toast.error('Failed to load campers');
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriods = async () => {
    try {
      const res = await api.get('/periods');
      setPeriods(res.data.periods || []);
    } catch (err) {
      console.error('Failed to fetch periods');
    }
  };

  useEffect(() => {
    // Forcefully remove stuck Vite error overlay if the user's browser cached it
    const viteOverlay = document.querySelector('vite-error-overlay');
    if (viteOverlay) viteOverlay.remove();

    fetchChildren();
    fetchPeriods();
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const payload = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      dob: formData.get('dob'),
      gender: formData.get('gender'),
      period_id: formData.get('period_id')
    };

    try {
      await api.post('/campers/enroll', payload);
      toast.success('Camper enrolled successfully!');
      setShowRegisterModal(false);
      fetchChildren(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to enroll camper');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMedicalSubmit = async (e) => {
    e.preventDefault();
    setMedicalSubmitting(true);
    const formData = new FormData(e.target);
    const payload = {
      camper_id: selectedMedicalCamper.id,
      allergies: formData.get('allergies'),
      medications: formData.get('medications'),
      emergency_contact: formData.get('emergency_contact'),
      emergency_phone: formData.get('emergency_phone')
    };

    try {
      await api.post('/medical', payload);
      toast.success('Medical record submitted securely!');
      setSelectedMedicalCamper(null);
    } catch (err) {
      toast.error('Failed to submit medical record');
    } finally {
      setMedicalSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#1a2b4c] text-white relative font-sans"
      style={{
        backgroundImage: "url('/parent-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/80 to-transparent pointer-events-none fixed"></div>

      {/* Transparent Navigation */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="font-serif italic text-2xl tracking-wider flex items-center gap-2">
            Filoxenia
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
            <span className="hover:text-amber-400 cursor-pointer transition">Home</span>
            <span className="hover:text-amber-400 cursor-pointer transition">Dashboard</span>
            <span className="hover:text-amber-400 cursor-pointer transition">Contact Us</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden md:block">Welcome, {user?.name || 'Parent'}</span>
            <button onClick={logout} className="text-white hover:text-amber-400 transition">
              <LogOut className="w-5 h-5" />
            </button>
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-12">
        <NotificationsTicker />
        
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Side: Hero Text */}
          <div className="lg:w-1/2 mt-10 opacity-0-start animate-fade-in-up delay-100">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest text-white mb-6" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}>
            TIME TO <br/> CAMP
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-md font-medium leading-relaxed italic" style={{ textShadow: '1px 2px 5px rgba(0,0,0,0.5)' }}>
            Welcome to the Parent Portal. Securely manage your children's registrations, view periods, and update medical forms all in one place.
          </p>
          <button 
            onClick={() => setShowRegisterModal(true)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-105 flex items-center gap-3"
          >
            <Plus className="w-5 h-5" /> Enroll Camper
          </button>
        </div>

        {/* Right Side: Glassmorphism Dashboard Cards */}
        <div className="lg:w-1/2 space-y-6 opacity-0-start animate-fade-in-up delay-300">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-amber-400" /> Your Campers
            </h2>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-6 text-white/70 flex justify-center items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading profiles...
                </div>
              ) : children.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/80 mb-4">You haven't registered any children yet.</p>
                </div>
              ) : (
                children.map(child => (
                  <div key={child.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-white">{child.first_name} {child.last_name}</h3>
                        <p className="text-xs text-white/70 mt-1">Born: {new Date(child.dob).toLocaleDateString()}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-green-500/20 text-green-300 border border-green-500/30">
                        ENROLLED
                      </span>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex gap-3">
                        <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
                          <ClipboardList className="w-4 h-4" /> Details
                        </button>
                        <button 
                          onClick={() => setSelectedMedicalCamper(child)}
                          className="flex-1 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-100 py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                          <Stethoscope className="w-4 h-4" /> Medical Form
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Easy Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-900">
            <div className="p-6 border-b sticky top-0 bg-white/95 backdrop-blur z-10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">New Camper Registration</h2>
                <p className="text-gray-500 text-sm">Enroll your child for Filoxenia</p>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">First Name</label>
                  <input required name="first_name" type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1a2b4c] outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Last Name</label>
                  <input required name="last_name" type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1a2b4c] outline-none transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                  <input required name="dob" type="date" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1a2b4c] outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Gender</label>
                  <select required name="gender" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1a2b4c] outline-none transition">
                    <option value="">Select gender...</option>
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Select Camp Period</label>
                <select required name="period_id" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1a2b4c] outline-none transition">
                  <option value="">Choose a period...</option>
                  {periods.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()})</option>
                  ))}
                </select>
              </div>
              <div className="pt-6 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setShowRegisterModal(false)} className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition" disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-8 py-3 bg-[#1a2b4c] hover:bg-[#0f1930] text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medical Form Modal */}
      {selectedMedicalCamper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-900">
            <div className="p-6 border-b sticky top-0 bg-white/95 backdrop-blur z-10 flex justify-between items-center bg-red-50">
              <div>
                <h2 className="text-2xl font-bold text-red-900 flex items-center gap-2">
                  <Stethoscope className="w-6 h-6" /> Medical Record
                </h2>
                <p className="text-red-700 text-sm font-medium mt-1">For {selectedMedicalCamper.first_name} {selectedMedicalCamper.last_name}</p>
              </div>
              <button onClick={() => setSelectedMedicalCamper(null)} className="p-2 hover:bg-red-100 rounded-full transition text-red-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleMedicalSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Allergies (if any)</label>
                <input name="allergies" type="text" placeholder="e.g. Peanuts, Penicillin, None" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Current Medications</label>
                <input name="medications" type="text" placeholder="e.g. Inhaler, None" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Emergency Contact Name</label>
                  <input required name="emergency_contact" type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Emergency Phone</label>
                  <input required name="emergency_phone" type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-400 outline-none transition" />
                </div>
              </div>
              <div className="pt-6 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedMedicalCamper(null)} className="px-6 py-3 font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition" disabled={medicalSubmitting}>
                  Cancel
                </button>
                <button type="submit" disabled={medicalSubmitting} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-2">
                  {medicalSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {medicalSubmitting ? 'Saving...' : 'Save Securely'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
