import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an /api/analytics endpoint
    // For now, we simulate data aggregation
    setTimeout(() => {
      setData({
        enrollments: [
          { name: 'Jan', count: 10 },
          { name: 'Feb', count: 25 },
          { name: 'Mar', count: 40 },
          { name: 'Apr', count: 85 },
          { name: 'May', count: 150 },
          { name: 'Jun', count: 320 },
        ],
        revenue: [
          { name: 'Jan', amount: 1500 },
          { name: 'Feb', amount: 3200 },
          { name: 'Mar', amount: 8000 },
          { name: 'Apr', amount: 14000 },
          { name: 'May', amount: 35000 },
          { name: 'Jun', amount: 62000 },
        ],
        occupancy: [
          { name: 'Boys 15+', value: 89 },
          { name: 'Boys 12-14', value: 93 },
          { name: 'Girls 15+', value: 79 },
          { name: 'Girls 12-14', value: 87 },
          { name: 'Boys 7-9', value: 141 },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Overview of enrollments, revenue, and occupancy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Enrollment Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.enrollments}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 border rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Revenue Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 border rounded-xl shadow-sm md:col-span-2">
          <h3 className="font-semibold mb-4">Occupancy by Period</h3>
          <div className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.occupancy}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {data.occupancy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
