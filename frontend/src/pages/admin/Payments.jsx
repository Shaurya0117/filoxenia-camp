import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { CreditCard, Plus, Euro, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchRegistrations();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/registrations');
      setRegistrations(res.data || []);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);

    const payload = {
      registration_id: parseInt(formData.get('registration_id'), 10),
      amount: parseFloat(formData.get('amount')),
      payment_date: formData.get('payment_date'),
      method: formData.get('method'),
      note: formData.get('note') || undefined
    };

    try {
      await api.post('/payments', payload);
      toast.success('Payment recorded successfully!');
      setShowModal(false);
      fetchPayments();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const cashCollected = payments
    .filter((p) => p.method?.toLowerCase() === 'cash')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const bankCollected = payments
    .filter((p) => p.method?.toLowerCase() === 'bank' || p.method?.toLowerCase() === 'card')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments & Receipts</h2>
          <p className="text-muted-foreground">Manage cashbox, receipts, and camper registration balances.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" /> New Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Euro className="w-4 h-4" /> Total Receipts
          </h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            €{totalCollected.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Cash Payments</h3>
          <p className="text-3xl font-bold mt-2">
            €{cashCollected.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Bank & Card Transfers</h3>
          <p className="text-3xl font-bold mt-2">
            €{bankCollected.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="p-4 bg-muted/30 border-b">
          <h3 className="font-semibold">List of Receipts</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
            <tr>
              <th className="px-6 py-4">Camper</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Note</th>
              <th className="px-6 py-4">Recorded By</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading payments...
                  </div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">No payments recorded.</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-full text-green-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div>
                        {payment.registration?.camper
                          ? `${payment.registration.camper.first_name} ${payment.registration.camper.last_name}`
                          : 'Unknown Camper'}
                      </div>
                      <div className="text-xs text-muted-foreground font-normal">
                        {payment.registration?.period?.name || `Reg #${payment.registration_id}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    €{Number(payment.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 capitalize">
                    <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">{payment.method}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{payment.note || '-'}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{payment.recorder?.name || 'System'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Record New Payment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Camper Registration *</label>
                <select required name="registration_id" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Select camper registration</option>
                  {registrations.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.camper?.first_name} {reg.camper?.last_name} — {reg.period?.name || 'Session'} (Reg #{reg.id})
                    </option>
                  ))}
                </select>
                {registrations.length === 0 && (
                  <p className="text-xs text-amber-600">No active camper registrations found.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Amount (€) *</label>
                  <input
                    required
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="150.00"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Payment Date *</label>
                  <input
                    required
                    name="payment_date"
                    type="date"
                    defaultValue={todayStr}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Payment Method *</label>
                <select required name="method" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Notes / Reference</label>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="e.g., Bank transaction ref #12345 or Cash receipt signed"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
