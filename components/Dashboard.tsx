import React from 'react';
import { TrendingUp, Users, Clock, Tag, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const metrics = [
    { label: 'Total Active Coupons', value: '24', change: '+12%', trend: 'up', icon: Tag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Coupons Expiring Soon', value: '5', change: '-2', trend: 'down', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Redemptions', value: '1,492', change: '+24%', trend: 'up', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Studio-Based Active', value: '12', change: '+5%', trend: 'up', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
          <p className="text-slate-500 text-sm">Welcome back, Admin. Here is what's happening today.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search coupons, studios, codes..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className={`flex items-center text-xs font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
                {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
              <p className="text-sm text-slate-500">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">Top Performing Coupons</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Coupon Code</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Redemptions</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { code: 'SKAWSH20', type: 'Order Based', used: 450, rev: '₹220,000', status: 'Active' },
                  { code: 'CLEAN50', type: 'Service Based', used: 230, rev: '₹45,000', status: 'Active' },
                  { code: 'NEWUSER100', type: 'First Login', used: 180, rev: '₹98,000', status: 'Expiring' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.code}</td>
                    <td className="px-4 py-3 text-slate-500">{row.type}</td>
                    <td className="px-4 py-3 text-slate-500">{row.used}</td>
                    <td className="px-4 py-3 text-slate-500">{row.rev}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Create New Offer</h3>
            <p className="text-brand-100 text-sm mb-6">Launch a new campaign in seconds. Choose from templates or build from scratch.</p>
          </div>
          <button className="bg-white text-brand-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-50 transition-colors self-start">
            Start Wizard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
