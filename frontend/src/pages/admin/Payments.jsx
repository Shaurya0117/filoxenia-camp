import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { CreditCard, Plus, Euro } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments & Receipts</h2>
          <p className="text-muted-foreground">Manage cashbox, receipts, and balances.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition">
          <Plus className="w-4 h-4" /> New Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Euro className="w-4 h-4" /> Total Receipts</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">€{totalCollected.toLocaleString('en-EU', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Cash Payments</h3>
          <p className="text-3xl font-bold mt-2">
            €{payments.filter(p => p.method === 'cash').reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString('en-EU', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Bank Transfers</h3>
          <p className="text-3xl font-bold mt-2">
            €{payments.filter(p => p.method === 'bank').reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString('en-EU', { minimumFractionDigits: 2 })}
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
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">Loading payments...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">No payments recorded.</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted/50 transition">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-full text-green-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div>{payment.registration?.camper?.first_name} {payment.registration?.camper?.last_name}</div>
                      <div className="text-xs text-muted-foreground font-normal">{payment.registration?.period?.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">€{Number(payment.amount).toFixed(2)}</td>
                  <td className="px-6 py-4">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 capitalize">
                    <span className="px-2 py-1 bg-muted rounded-md text-xs">{payment.method}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{payment.note || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
