
import React from 'react';
import { Archive, RefreshCcw, AlertCircle } from 'lucide-react';
import { Coupon, CouponStatus, DiscountType } from '../types';

interface HistoryProps {
  coupons: Coupon[];
}

const History: React.FC<HistoryProps> = ({ coupons }) => {
  // Filter for history items: Expired, Inactive, or Fully Redeemed
  const historyCoupons = coupons.filter(c => 
    c.status === CouponStatus.EXPIRED || 
    c.status === CouponStatus.INACTIVE || 
    (c.usageLimit > 0 && c.usageCount >= c.usageLimit)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Coupon History</h2>
           <p className="text-sm text-slate-500">Archives of expired, cancelled, and fully redeemed coupons.</p>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Coupon</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Final Stats</th>
                <th className="px-6 py-4">Validity Range</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyCoupons.map(coupon => {
                let reason = 'Unknown';
                if (coupon.status === CouponStatus.EXPIRED) reason = 'Expired';
                else if (coupon.status === CouponStatus.INACTIVE) reason = 'Deactivated';
                else if (coupon.usageCount >= coupon.usageLimit) reason = 'Limit Reached';

                return (
                  <tr key={coupon.id} className="hover:bg-slate-50 opacity-80">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded text-slate-500">
                          <Archive className="w-4 h-4" />
                        </div>
                        <div>
                          <div>{coupon.code}</div>
                          <div className="text-xs text-slate-500">{coupon.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded text-xs font-medium ${
                         reason === 'Limit Reached' ? 'bg-blue-50 text-blue-700' :
                         reason === 'Expired' ? 'bg-orange-50 text-orange-700' :
                         'bg-gray-100 text-gray-700'
                       }`}>
                         {reason}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                       <div className="text-xs">
                         <div>Used: {coupon.usageCount}/{coupon.usageLimit}</div>
                         <div>Value: {coupon.discountType === DiscountType.FLAT ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}</div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                       <div className="text-xs flex flex-col gap-1">
                          <span>From: {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : 'N/A'}</span>
                          <span>To: {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'N/A'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-xs font-medium transition-colors">
                        <RefreshCcw className="w-3 h-3" /> Reactivate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {historyCoupons.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-slate-400" />
              </div>
              <p>No history found.</p>
              <p className="text-xs mt-1">Expired and inactive coupons will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
