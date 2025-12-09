
import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Eye, MoreHorizontal, Filter, Download, Trash2, X, Ban, CheckCircle2 } from 'lucide-react';
import { Coupon, CouponStatus, CouponCategory, DiscountType } from '../types';

interface CouponListProps {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

const CouponList: React.FC<CouponListProps> = ({ coupons, onEdit, onDelete }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Action Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // View Modal State
  const [viewCoupon, setViewCoupon] = useState<Coupon | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.ACTIVE: return 'bg-green-100 text-green-700';
      case CouponStatus.EXPIRED: return 'bg-red-100 text-red-700';
      case CouponStatus.DRAFT: return 'bg-slate-100 text-slate-700';
      case CouponStatus.INACTIVE: return 'bg-gray-100 text-gray-500';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

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

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to move this coupon to history (deactivate)?')) {
      onDelete(id);
      setActiveMenuId(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Coupon Management</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
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
        <div className="overflow-visible">
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
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setViewCoupon(coupon)}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onEdit(coupon)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === coupon.id ? null : coupon.id);
                            }}
                            className={`p-1.5 rounded transition-colors ${activeMenuId === coupon.id ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-700'}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeMenuId === coupon.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200"
                            >
                              <div className="py-1">
                                <button 
                                  onClick={() => handleDelete(coupon.id)}
                                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" /> Deactivate / Delete
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                  onClick={() => setActiveMenuId(null)}
                                >
                                  <Ban className="w-3 h-3" /> Cancel
                                </button>
                              </div>
                            </div>
                          )}
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

      {/* View Modal */}
      {viewCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {viewCoupon.code}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewCoupon.status)}`}>
                    {viewCoupon.status}
                  </span>
                </h3>
                <p className="text-slate-500 text-sm mt-1">{viewCoupon.title}</p>
              </div>
              <button 
                onClick={() => setViewCoupon(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Discount</div>
                  <div className="font-semibold text-slate-800">
                    {viewCoupon.discountType === DiscountType.FLAT ? `₹${viewCoupon.discountValue}` : `${viewCoupon.discountValue}%`} OFF
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Category</div>
                  <div className="font-semibold text-slate-800">{viewCoupon.category}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Usage</div>
                  <div className="font-semibold text-slate-800">{viewCoupon.usageCount} / {viewCoupon.usageLimit}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Validity</div>
                  <div className="font-semibold text-slate-800 text-xs">
                    {new Date(viewCoupon.startDate).toLocaleDateString()} - {new Date(viewCoupon.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</div>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{viewCoupon.description}</p>
              </div>
              
              {viewCoupon.terms && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms</div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap border-l-2 border-slate-200 pl-3">{viewCoupon.terms}</p>
                </div>
              )}

              {viewCoupon.bannerUrl && (
                 <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Banner</div>
                    <img src={viewCoupon.bannerUrl} alt="Coupon Banner" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                 </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewCoupon(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponList;
