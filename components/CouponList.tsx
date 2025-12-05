
import React, { useState } from 'react';
import { Edit2, Eye, MoreHorizontal, Filter, Download } from 'lucide-react';
import { Coupon, CouponStatus, CouponCategory, DiscountType } from '../types';

interface CouponListProps {
  coupons: Coupon[];
}

const CouponList: React.FC<CouponListProps> = ({ coupons }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const getStatusColor = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.ACTIVE: return 'bg-green-100 text-green-700';
      case CouponStatus.EXPIRED: return 'bg-red-100 text-red-700';
      case CouponStatus.DRAFT: return 'bg-slate-100 text-slate-700';
      case CouponStatus.INACTIVE: return 'bg-gray-100 text-gray-500';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Logic: Show coupons that are NOT in history status
  // History Statuses: EXPIRED, INACTIVE, or Usage Limit Reached
  const activeCoupons = coupons.filter(c => {
    const isHistory = 
      c.status === CouponStatus.EXPIRED || 
      c.status === CouponStatus.INACTIVE || 
      (c.usageLimit > 0 && c.usageCount >= c.usageLimit);
    
    return !isHistory;
  });

  const filteredCoupons = activeCoupons.filter(c => {
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Coupon Management</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Filters:</span>
          </div>
          <select 
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            {Object.values(CouponStatus)
              .filter(s => s !== CouponStatus.EXPIRED && s !== CouponStatus.INACTIVE)
              .map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.values(CouponCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredCoupons.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No active coupons found. Create a new one to get started.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Coupon Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Redemptions</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{coupon.code}</span>
                        <span className="text-xs text-slate-500">{coupon.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{coupon.category}</span>
                      {coupon.serviceName && <div className="text-xs text-slate-400 mt-1">{coupon.serviceName}</div>}
                      {coupon.studioName && <div className="text-xs text-slate-400 mt-1">{coupon.studioName}</div>}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {coupon.discountType === DiscountType.FLAT ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`} OFF
                      {coupon.maxDiscount && <div className="text-xs text-slate-400">Up to ₹{coupon.maxDiscount}</div>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="text-xs">
                        <div>Start: {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : 'N/A'}</div>
                        <div>End: {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-500" 
                            style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-600">{coupon.usageCount}/{coupon.usageLimit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 group">
                        <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <div className="relative group/menu">
                          <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponList;
