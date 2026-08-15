import React, { useState, useEffect } from 'react';
import { Utensils, Thermometer, ShieldAlert, CheckCircle2, Truck, ClipboardCheck } from 'lucide-react';

export default function FoodHaccp() {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    // Mock data for Food/HACCP
    setLogs([
      { id: 1, type: 'temperature', desc: 'Freezer A', status: 'ok', date: new Date().toISOString() },
      { id: 2, type: 'cleanliness', desc: 'Kitchen Prep Area', status: 'warning', date: new Date().toISOString() },
      { id: 3, type: 'supplier', desc: 'Meat Delivery (Mart)', status: 'ok', date: new Date().toISOString() }
    ]);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Utensils className="w-8 h-8 text-blue-600" />
          Food Management - HACCP
        </h1>
        <p className="text-gray-500 mt-2">Monitor temperatures, critical control points, and hygiene standards.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-300 transition cursor-pointer">
          <Thermometer className="w-10 h-10 text-green-500 mb-3" />
          <h3 className="font-bold text-gray-900">Temperatures</h3>
          <p className="text-sm text-gray-500 mt-1">E03 Register</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-300 transition cursor-pointer">
          <ClipboardCheck className="w-10 h-10 text-blue-500 mb-3" />
          <h3 className="font-bold text-gray-900">Critical Points</h3>
          <p className="text-sm text-gray-500 mt-1">Q03A Checklist</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-300 transition cursor-pointer">
          <CheckCircle2 className="w-10 h-10 text-purple-500 mb-3" />
          <h3 className="font-bold text-gray-900">Cleanliness</h3>
          <p className="text-sm text-gray-500 mt-1">Q16 Standard</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-300 transition cursor-pointer">
          <Truck className="w-10 h-10 text-orange-500 mb-3" />
          <h3 className="font-bold text-gray-900">Suppliers</h3>
          <p className="text-sm text-gray-500 mt-1">Q8A Receipts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="bg-gray-800 text-white p-4 font-semibold flex justify-between items-center">
            <span>Recent Logs</span>
            <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">View All</button>
          </div>
          <div className="divide-y">
            {logs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {log.status === 'ok' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <ShieldAlert className="w-5 h-5 text-amber-500" />}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{log.type}</p>
                    <p className="text-sm text-gray-500">{log.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{new Date(log.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="bg-gray-800 text-white p-4 font-semibold flex justify-between items-center">
            <span>Expiring Soon (Inventory)</span>
          </div>
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <p className="font-medium">All clear</p>
            <p className="text-sm mt-1">No products expiring soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
