import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';
import { AnalyticsData } from '../types';

const DATA: AnalyticsData[] = [
  { date: 'Mon', redemptions: 40, revenue: 2400 },
  { date: 'Tue', redemptions: 30, revenue: 1398 },
  { date: 'Wed', redemptions: 55, revenue: 3800 },
  { date: 'Thu', redemptions: 80, revenue: 5908 },
  { date: 'Fri', redemptions: 65, revenue: 4800 },
  { date: 'Sat', redemptions: 110, revenue: 8500 },
  { date: 'Sun', redemptions: 95, revenue: 7300 },
];

const STUDIO_DATA = [
  { name: 'Studio A', redemptions: 400 },
  { name: 'Studio B', redemptions: 300 },
  { name: 'Studio C', redemptions: 300 },
  { name: 'Studio D', redemptions: 200 },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Coupon Performance Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="font-semibold text-slate-800 mb-4">Weekly Redemptions & Revenue</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line yAxisId="left" type="monotone" dataKey="redemptions" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Redemptions" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={false} name="Revenue Infl. (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Studio Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="font-semibold text-slate-800 mb-4">Top Studios by Coupon Usage</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={STUDIO_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="redemptions" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} name="Total Uses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Funnel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-6">Conversion Funnel (Last 30 Days)</h3>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          
          <div className="flex-1 text-center p-4 bg-slate-50 rounded-lg w-full">
            <div className="text-3xl font-bold text-slate-900 mb-1">12,500</div>
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Views</div>
          </div>
          
          <div className="hidden md:block w-8 h-1 bg-slate-300"></div>
          
          <div className="flex-1 text-center p-4 bg-blue-50 rounded-lg w-full">
            <div className="text-3xl font-bold text-blue-700 mb-1">4,200</div>
            <div className="text-sm text-blue-600 font-medium uppercase tracking-wide">Added to Cart</div>
            <div className="text-xs text-blue-400 mt-1">33.6% conv</div>
          </div>

          <div className="hidden md:block w-8 h-1 bg-slate-300"></div>

          <div className="flex-1 text-center p-4 bg-green-50 rounded-lg w-full">
            <div className="text-3xl font-bold text-green-700 mb-1">3,150</div>
            <div className="text-sm text-green-600 font-medium uppercase tracking-wide">Redeemed</div>
            <div className="text-xs text-green-400 mt-1">75% of cart</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
