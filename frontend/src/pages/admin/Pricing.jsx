import React from 'react';
import { CreditCard, FileText, CheckCircle2, Search } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-blue-600" />
          Calandra Campers Pricing (APY)
        </h1>
        <p className="text-gray-500 mt-2">Manage invoices, subsidies, and camper account balances.</p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Search campers..." className="pl-10 pr-4 py-2 w-full border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium">Issue Bulk APY</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Full Name</th>
              <th className="p-4 font-semibold">Period</th>
              <th className="p-4 font-semibold">Amount of APY</th>
              <th className="p-4 font-semibold">Collected</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {[
              { id: 1, name: 'Antoniadis Angelos', period: 'Boys 12-14', amount: '180.00 €', collected: '180.00 €', status: 'Published - MARK', issued: true },
              { id: 2, name: 'Vassiliadis Efthymios', period: 'Boys 12-14', amount: '200.00 €', collected: '200.00 €', status: 'Not issued', issued: false },
            ].map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-4">Regular pricing</td>
                <td className="p-4 font-medium text-gray-900">{row.name}</td>
                <td className="p-4 text-gray-500">{row.period}</td>
                <td className="p-4 font-medium">{row.amount}</td>
                <td className="p-4 text-green-600">{row.collected}</td>
                <td className="p-4">
                  {row.issued ? (
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {row.status}</span>
                  ) : (
                    <span className="text-gray-500">{row.status}</span>
                  )}
                </td>
                <td className="p-4">
                  {row.issued ? (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-xs font-medium">View</button>
                      <button className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium">Cancellation</button>
                    </div>
                  ) : (
                    <button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium">Issuance of APY</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
