
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Check, Wand2, AlertCircle, Phone, ArrowLeft, Plus, Trash2, CheckCircle2, RotateCcw, MapPin, ShoppingBag, Lock, Ticket, Tag, Info, X
} from 'lucide-react';
import { CouponFormData, CouponCategory, AudienceType, DiscountType, CouponStatus, Coupon } from '../types';

// --- SHARED TYPES & CONSTANTS ---

const INITIAL_DATA: CouponFormData = {
  title: '',
  description: '',
  category: CouponCategory.ORDER_BASED,
  audience: AudienceType.ALL,
  code: '',
  discountType: DiscountType.FLAT,
  discountValue: 0,
  maxDiscount: 0,
  minOrderValue: 0,
  applyOn: 'ORDER',
  selectedServices: [],
  selectedStudio: '',
  isFirstLogin: false,
  terms: '',
  maxUsesPerUser: 1,
  globalRedemptionLimit: 1000,
  allowStacking: false,
  startDate: '',
  endDate: '',
  status: CouponStatus.DRAFT
};

const STEPS = ['Basic Details', 'Code', 'Discount', 'Terms & Conditions', 'Limits', 'Schedule'];

const ACTIVE_SERVICES = [
  "Dry Cleaning",
  "Premium Laundry",
  "Shoe Cleaning",
  "Steam Ironing",
  "Carpet Cleaning",
  "Sofa Cleaning",
  "Leather Care"
];

interface StepProps {
  formData: CouponFormData;
  updateField: (field: keyof CouponFormData, value: any) => void;
}

// --- SUB-COMPONENTS ---

const StepBasic: React.FC<StepProps> = ({ formData, updateField }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Title <span className="text-red-500">*</span></label>
      <input 
        type="text" 
        value={formData.title}
        onChange={(e) => updateField('title', e.target.value)}
        placeholder="e.g. Summer Laundry Sale"
        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
      <textarea 
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
        placeholder="Short description for the user"
        className="w-full p-2 border border-slate-300 rounded-md h-24 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <select 
          value={formData.category}
          onChange={(e) => updateField('category', e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md bg-white"
        >
          {Object.values(CouponCategory).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
        <select 
          value={formData.audience}
          onChange={(e) => updateField('audience', e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md bg-white"
        >
          {Object.values(AudienceType).map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
    </div>
    
    {formData.category === CouponCategory.STUDIO_BASED && (
      <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
        <label className="block text-sm font-medium text-purple-900 mb-1">Select Studio</label>
        <input 
          type="text" 
          placeholder="Search Studio Name..."
          value={formData.selectedStudio}
          onChange={(e) => updateField('selectedStudio', e.target.value)}
          className="w-full p-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500"
        />
      </div>
    )}

    {formData.category === CouponCategory.SERVICE_BASED && (
      <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
        <label className="block text-sm font-medium text-indigo-900 mb-1">Select Active Service</label>
        <select 
          value={formData.selectedServices[0] || ''}
          onChange={(e) => updateField('selectedServices', [e.target.value])}
          className="w-full p-2 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">-- Choose a Service --</option>
          {ACTIVE_SERVICES.map(service => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
        <p className="text-xs text-indigo-600 mt-1">Discount will be applied to this service.</p>
      </div>
    )}
  </div>
);

const StepCode: React.FC<StepProps> = ({ formData, updateField }) => {
  const generateCode = () => {
    let prefix = 'SKA';
    if (formData.category === CouponCategory.STUDIO_BASED) prefix = 'STU';
    if (formData.category === CouponCategory.SERVICE_BASED) prefix = 'SRV';
    
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    updateField('code', `${prefix}-${random}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <p className="text-sm text-blue-800">Coupon codes must be unique, max 15 characters, containing A-Z, 0-9 and hyphens.</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={formData.code}
            onChange={(e) => updateField('code', e.target.value.toUpperCase())}
            placeholder="e.g. SKAWSH20"
            maxLength={15}
            className="flex-1 p-2 text-lg font-mono tracking-wider uppercase border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500"
          />
          <button 
            onClick={generateCode}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors"
          >
            <Wand2 className="w-4 h-4" /> Auto Generate
          </button>
        </div>
        {formData.code.length > 0 && !/^[A-Z0-9-]+$/.test(formData.code) && (
          <p className="text-red-500 text-xs mt-1">Invalid characters used.</p>
        )}
      </div>
    </div>
  );
};

const StepDiscount: React.FC<StepProps> = ({ formData, updateField }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Discount Type</label>
      <div className="flex gap-4">
        <button 
          onClick={() => updateField('discountType', DiscountType.PERCENTAGE)}
          className={`flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${formData.discountType === DiscountType.PERCENTAGE ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <span className="text-2xl font-bold">%</span>
          <span className="font-medium">Percentage</span>
        </button>
        <button 
          onClick={() => updateField('discountType', DiscountType.FLAT)}
          className={`flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${formData.discountType === DiscountType.FLAT ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <span className="text-2xl font-bold">₹</span>
          <span className="font-medium">Flat Amount</span>
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {formData.discountType === DiscountType.PERCENTAGE ? 'Percentage Value' : 'Flat Amount (₹)'}
        </label>
        <input 
          type="number" 
          value={formData.discountValue}
          onChange={(e) => updateField('discountValue', parseFloat(e.target.value))}
          className="w-full p-2 border border-slate-300 rounded-md"
        />
      </div>
      {formData.discountType === DiscountType.PERCENTAGE && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Max Discount Amount (₹)</label>
          <input 
            type="number" 
            value={formData.maxDiscount}
            onChange={(e) => updateField('maxDiscount', parseFloat(e.target.value))}
            placeholder="e.g. 200"
            className="w-full p-2 border border-slate-300 rounded-md"
          />
        </div>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {formData.category === CouponCategory.SERVICE_BASED 
          ? 'Minimum Service Value (Optional)' 
          : 'Minimum Order Value (Optional)'}
      </label>
      <input 
        type="number" 
        value={formData.minOrderValue}
        onChange={(e) => updateField('minOrderValue', parseFloat(e.target.value))}
        placeholder="Leave 0 for no minimum"
        className="w-full p-2 border border-slate-300 rounded-md"
      />
    </div>
  </div>
);

const StepTerms: React.FC<StepProps> = ({ formData, updateField }) => (
  <div className="space-y-4">
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-semibold text-slate-800">
          Terms and Conditions <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Enter the specific terms that apply to this coupon. These will be visible to the user in the mobile app popup.
        </p>
        <textarea
          value={formData.terms}
          onChange={(e) => updateField('terms', e.target.value)}
          placeholder="• Valid only on Dry Cleaning services&#10;• Cannot be clubbed with other offers&#10;• Valid for one-time use only"
          className="w-full p-3 border border-slate-300 rounded-md h-48 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm leading-relaxed"
        />
      </div>
    </div>
  </div>
);

const StepLimits: React.FC<StepProps> = ({ formData, updateField }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Max Uses Per User</label>
      <input 
        type="number" 
        value={formData.maxUsesPerUser}
        onChange={(e) => updateField('maxUsesPerUser', parseInt(e.target.value))}
        className="w-full p-2 border border-slate-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Global Redemption Limit</label>
      <input 
        type="number" 
        value={formData.globalRedemptionLimit}
        onChange={(e) => updateField('globalRedemptionLimit', parseInt(e.target.value))}
        className="w-full p-2 border border-slate-300 rounded-md"
      />
    </div>
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 mt-4">
      <input 
        type="checkbox" 
        id="stacking"
        checked={formData.allowStacking}
        onChange={(e) => updateField('allowStacking', e.target.checked)}
        className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
      />
      <label htmlFor="stacking" className="text-sm font-medium text-slate-700">Allow stacking with other offers?</label>
    </div>
  </div>
);

const StepSchedule: React.FC<StepProps> = ({ formData, updateField }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
        <input 
          type="datetime-local" 
          value={formData.startDate}
          onChange={(e) => updateField('startDate', e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
        <input 
          type="datetime-local" 
          value={formData.endDate}
          onChange={(e) => updateField('endDate', e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md"
        />
      </div>
    </div>
    <div className="pt-4 border-t border-slate-200 mt-6">
      <label className="block text-sm font-medium text-slate-700 mb-2">Initial Status</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="status" 
            checked={formData.status === CouponStatus.ACTIVE}
            onChange={() => updateField('status', CouponStatus.ACTIVE)}
            className="text-brand-600 focus:ring-brand-500"
          />
          <span className="text-slate-700">Active (Publish Immediately)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="status" 
            checked={formData.status === CouponStatus.DRAFT}
            onChange={() => updateField('status', CouponStatus.DRAFT)}
            className="text-brand-600 focus:ring-brand-500"
          />
          <span className="text-slate-700">Save as Draft</span>
        </label>
      </div>
    </div>
  </div>
);

interface PreviewCouponCardProps {
  code: string;
  title: string;
  desc: string;
  discountText: string;
  isGenerated?: boolean;
  terms?: string;
  onApply?: () => void;
}

const PreviewCouponCard: React.FC<PreviewCouponCardProps> = ({ 
  code, title, desc, discountText, isGenerated, terms, onApply 
}) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative mb-4 mx-4">
      <div className="flex relative">
        {/* Left Strip with Scalloped Edge */}
        <div className="w-12 bg-slate-500 relative flex items-center justify-center shrink-0 min-h-[120px]">
          <div className="absolute inset-0 flex items-center justify-center -rotate-90 whitespace-nowrap text-white font-bold text-[10px] tracking-wider uppercase">
            {discountText}
          </div>
          {/* Scallops */}
          <div className="absolute -right-1.5 top-0 bottom-0 flex flex-col justify-between py-1 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-white rounded-full mb-1"></div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-3 pl-5 relative">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{code}</h3>
              {isGenerated && (
                <span className="bg-pink-100 text-pink-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">FOR YOU</span>
              )}
            </div>
            <button 
              onClick={() => onApply && onApply()}
              className="text-brand-600 hover:text-brand-700 font-bold text-xs transition-colors px-2 py-1 hover:bg-brand-50 rounded"
            >
              APPLY
            </button>
          </div>
          
          <p className="text-green-600 text-[10px] font-semibold mb-2">
            {isGenerated ? 'Instant discount on this order' : 'Add ₹51 more to avail this offer'}
          </p>
          
          <div className="text-[10px] text-slate-500 leading-relaxed border-b border-dashed border-slate-200 pb-2 mb-2">
            <div className="font-semibold mb-0.5 text-slate-700">{title}</div>
            <div className="truncate opacity-70">{desc}</div>
          </div>
          
          <button 
            onClick={() => setShowTerms(!showTerms)}
            className="text-[10px] font-bold text-slate-700 hover:text-slate-900 focus:outline-none flex items-center gap-1"
          >
            {showTerms ? '- LESS' : '+ MORE'}
          </button>
        </div>
      </div>
      
      {/* Expandable Terms Section */}
      {showTerms && terms && (
        <div className="px-5 py-3 bg-slate-50 border-t border-dashed border-slate-200 animate-in slide-in-from-top-2 duration-200">
          <h5 className="text-[10px] font-bold text-slate-600 mb-1">Terms & Conditions</h5>
          <p className="text-[10px] text-slate-500 whitespace-pre-wrap leading-relaxed">
            {terms}
          </p>
        </div>
      )}
    </div>
  );
};

interface AppliedCoupon {
  code: string;
  discountAmount: number;
}

const MobilePreview: React.FC<{ data: CouponFormData }> = ({ data }) => {
  const [view, setView] = useState<'cart' | 'list'>('cart');
  const [cartTotal] = useState(377); // Fixed mock total based on screenshot
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleApplyCoupon = (couponData: CouponFormData) => {
    // 1. Minimum Order Value Check
    if (couponData.minOrderValue > 0 && cartTotal < couponData.minOrderValue) {
      const label = couponData.category === CouponCategory.SERVICE_BASED ? 'Service' : 'Order';
      showToast(`Min ${label} value of ₹${couponData.minOrderValue} required`, 'error');
      return;
    }

    // 2. Expiry Check
    if (couponData.endDate) {
      const expiryDate = new Date(couponData.endDate);
      const now = new Date();
      if (expiryDate < now) {
        showToast('This coupon has expired', 'error');
        return;
      }
    }

    // 3. Status Check (Optional)
    if (couponData.status === CouponStatus.EXPIRED || couponData.status === CouponStatus.INACTIVE) {
        showToast('This coupon is currently inactive', 'error');
        return;
    }

    // 4. Calculate Discount
    let discount = 0;
    if (couponData.discountType === DiscountType.PERCENTAGE) {
      discount = (cartTotal * couponData.discountValue) / 100;
      if (couponData.maxDiscount > 0) {
        discount = Math.min(discount, couponData.maxDiscount);
      }
    } else {
      discount = couponData.discountValue;
    }

    // Apply
    setAppliedCoupon({
      code: couponData.code,
      discountAmount: Math.floor(discount)
    });
    
    showToast('Coupon Applied Successfully', 'success');
    
    // Navigate back to cart
    setTimeout(() => {
      setView('cart');
    }, 1000);
  };

  const removeCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAppliedCoupon(null);
    showToast('Coupon removed', 'success');
  };

  const finalPayable = appliedCoupon ? cartTotal - appliedCoupon.discountAmount : cartTotal;

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-slate-100/50 rounded-xl relative">
      <div className="w-[320px] h-[640px] bg-white rounded-[2rem] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col font-sans">
        
        {/* Toast Overlay */}
        {toast && (
          <div className={`absolute top-12 left-1/2 -translate-x-1/2 z-50 w-[90%] px-4 py-3 rounded-lg text-xs font-bold shadow-lg animate-in slide-in-from-top-2 fade-in duration-300 flex items-center gap-2 ${toast.type === 'success' ? 'bg-slate-800 text-white' : 'bg-red-500 text-white'}`}>
             {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
             {toast.message}
          </div>
        )}

        {/* Status Bar */}
        <div className="h-6 bg-white flex justify-between items-center px-4 text-[10px] font-bold text-gray-800 z-10 shrink-0">
           <span>12:25</span>
           <div className="flex gap-1"><span>5G</span><span>52%</span></div>
        </div>

        {view === 'cart' ? (
           <>
              {/* Header */}
              <div className="h-14 bg-white flex items-center justify-between px-4 border-b border-gray-100 relative z-10 shadow-sm shrink-0">
                 <ArrowLeft className="w-5 h-5 text-gray-700" />
                 <span className="font-serif text-lg text-gray-800">Your Sack</span>
                 <Trash2 className="w-5 h-5 text-red-400" />
              </div>

              {/* Scroll Content */}
              <div className="flex-1 overflow-y-auto bg-blue-50/30 pb-20">
                 {/* Address */}
                 <div className="bg-white m-3 p-3 rounded-xl shadow-sm border border-blue-50">
                    <div className="flex items-start gap-3">
                       <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                       <div className="flex-1">
                          <div className="flex justify-between">
                             <h4 className="font-semibold text-gray-900 text-sm">Delivery Address</h4>
                             <Lock className="w-3 h-3 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">ORR, 1st floor, Rajendranagar mandal, Hyderabad, 500030</p>
                       </div>
                    </div>
                 </div>

                 {/* Items List (Static Mock) */}
                 <h3 className="px-4 py-2 text-sm font-bold text-gray-800">Review your order</h3>
                 <div className="text-center py-1"><span className="text-blue-500 font-semibold text-sm">Standard Wash</span></div>
                 <div className="px-4 py-2 flex items-center gap-2"><span className="text-gray-600"><ShoppingBag className="w-4 h-4 inline" /></span><span className="font-bold text-gray-800 text-sm">Dry Cleaning Services</span></div>
                 <div className="px-4 text-xs font-semibold text-gray-500 mb-2">Upper Wear</div>
                 {/* Item 1 */}
                 <div className="mx-3 mb-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                       <div><div className="font-bold text-gray-800 text-sm">T-shirt</div><div className="text-xs text-gray-500 mt-0.5">1 Item × ₹115.50</div></div>
                       <Trash2 className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                       <div className="flex items-center border border-gray-200 rounded px-2 py-0.5 bg-gray-50"><span className="px-1 text-gray-500">-</span><span className="px-2 font-medium text-xs">1</span><span className="px-1 text-gray-500">+</span></div>
                       <div className="font-bold text-gray-900 text-sm">₹115.50</div>
                    </div>
                 </div>
                 {/* Item 2 */}
                 <div className="mx-3 mb-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="flex justify-between items-start">
                        <div><div className="font-bold text-gray-800 text-sm">Special Shirt</div><div className="text-xs text-gray-500 mt-0.5">1 Item × ₹115.50</div></div>
                        <Trash2 className="w-4 h-4 text-red-400" />
                     </div>
                     <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center border border-gray-200 rounded px-2 py-0.5 bg-gray-50"><span className="px-1 text-gray-500">-</span><span className="px-2 font-medium text-xs">1</span><span className="px-1 text-gray-500">+</span></div>
                        <div className="font-bold text-gray-900 text-sm">₹115.50</div>
                     </div>
                 </div>

                 {/* Coupon Section */}
                 {appliedCoupon ? (
                   <div className="mx-3 mt-4 mb-3 bg-white p-4 rounded-xl shadow-sm border border-green-200 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-green-200">
                           <Check className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="font-bold text-gray-800 text-sm uppercase tracking-wider">{appliedCoupon.code}</div>
                           <div className="text-xs text-green-600 font-bold mt-0.5">You saved ₹{appliedCoupon.discountAmount}</div>
                        </div>
                     </div>
                     <button onClick={removeCoupon} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors">
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 ) : (
                   <button onClick={() => setView('list')} className="w-[calc(100%-24px)] mx-3 mt-4 mb-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-orange-200">
                            <Tag className="w-4 h-4 fill-current transform -scale-x-100" />
                         </div>
                         <span className="font-bold text-gray-800 text-sm">Apply Coupon</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                   </button>
                 )}

                 {/* Bill Details */}
                 <div className="mx-3 mt-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-xs text-gray-800 uppercase mb-3 tracking-wide border-b border-gray-100 pb-2">Bill Details</h4>
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                       <span>Item Total</span>
                       <span>₹{cartTotal}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-xs text-green-600 mb-2 font-medium">
                         <span>Coupon Discount</span>
                         <span>- ₹{appliedCoupon.discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-600 mb-3">
                       <span>Taxes & Charges</span>
                       <span>₹18.50</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-800 pt-3 border-t border-dashed border-gray-200">
                       <span>To Pay</span>
                       <span>₹{(finalPayable + 18.50).toFixed(2)}</span>
                    </div>
                 </div>
              </div>

               {/* Bottom Bar */}
              <div className="h-20 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] relative z-20 shrink-0">
                 <button className="w-full h-full bg-blue-100 text-white rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 relative overflow-hidden">
                   <div className="absolute inset-0 bg-slate-300"></div>
                   <span className="relative z-10 flex items-center gap-2">
                     <Lock className="w-4 h-4" /> 
                     Pay ₹{(finalPayable + 18.50).toFixed(0)}
                   </span>
                 </button>
              </div>
           </>
        ) : (
           <>
              {/* Header List */}
              <div className="h-16 bg-white px-4 flex items-center gap-3 border-b border-slate-50 shrink-0">
                 <button onClick={() => setView('cart')} className="p-1 -ml-2"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
                 <div><div className="font-bold text-sm text-slate-800 uppercase tracking-wide">APPLY COUPON</div><div className="text-xs text-slate-500">Your cart: ₹{cartTotal}</div></div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
                 <div className="p-4 bg-white mb-2">
                    <div className="relative">
                       <input type="text" placeholder="Enter Coupon Code" className="w-full pl-4 pr-20 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-400 placeholder:text-slate-400" />
                       <button className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs tracking-wider">APPLY</button>
                    </div>
                 </div>

                 {/* Info Box */}
                 <div className="px-4 mb-6">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex gap-3 shadow-sm items-start">
                       <div className="mt-0.5 bg-orange-100 rounded-full p-0.5"><AlertCircle className="w-3 h-3 text-orange-500" /></div>
                       <p className="text-[10px] text-slate-600 leading-snug">1 discounted item worth ₹179 is not eligible for any coupons</p>
                    </div>
                 </div>

                 <h4 className="px-4 mb-3 font-bold text-slate-800 text-sm">Great deal you're missing out on!</h4>
                 <PreviewCouponCard 
                    code={data.code || 'CODE'} 
                    discountText={data.discountType === DiscountType.PERCENTAGE ? `${data.discountValue}% OFF` : `₹${data.discountValue} OFF`}
                    title={data.title}
                    desc={data.description}
                    terms={data.terms}
                    isGenerated={true}
                    onApply={() => handleApplyCoupon(data)}
                 />

                 <h4 className="px-4 mt-6 mb-3 font-bold text-slate-800 text-sm">More offers</h4>
                 <PreviewCouponCard 
                  code="FLAT75" 
                  discountText="₹75 OFF" 
                  title="Get Flat Rs. 75 off" 
                  desc="Use code FLAT75 & get flat ₹75 off orders above ₹399"
                  terms="• Minimum order value ₹399&#10;• Valid on all services"
                  onApply={() => handleApplyCoupon({ ...INITIAL_DATA, code: 'FLAT75', minOrderValue: 399, discountType: DiscountType.FLAT, discountValue: 75 })}
                 />
                 <PreviewCouponCard 
                  code="SPECIAL30" 
                  discountText="30% OFF" 
                  title="Monsoon Special Offer" 
                  desc="Get 30% off on all dry cleaning services this week."
                  terms="• Valid only on Dry Cleaning&#10;• Max discount ₹150"
                  onApply={() => handleApplyCoupon({ ...INITIAL_DATA, code: 'SPECIAL30', discountType: DiscountType.PERCENTAGE, discountValue: 30, maxDiscount: 150 })}
                 />
              </div>

               {/* Bottom Floating Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 z-20 cursor-pointer">
                 <div className="bg-orange-500 p-0.5 rounded-full"><Ticket className="w-3 h-3 text-white" /></div>
                 View Add-On Payment Offers
                 <ChevronRight className="w-3 h-3 rotate-90" />
              </div>
           </>
        )}

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-30"></div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

interface CreateCouponWizardProps {
  onCreate: (data: CouponFormData) => void;
  initialData?: Coupon | null;
  isEditing?: boolean;
}

const CreateCouponWizard: React.FC<CreateCouponWizardProps> = ({ onCreate, initialData, isEditing = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CouponFormData>(INITIAL_DATA);
  const [autoSaving, setAutoSaving] = useState(false);
  
  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [submittedData, setSubmittedData] = useState<CouponFormData | null>(null);

  // Load Initial Data for Editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        audience: initialData.audience,
        code: initialData.code,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        maxDiscount: initialData.maxDiscount || 0,
        minOrderValue: initialData.minOrderValue || 0,
        applyOn: initialData.category === CouponCategory.SERVICE_BASED ? 'SERVICE' : 'ORDER',
        selectedServices: initialData.serviceName ? initialData.serviceName.split(', ') : [],
        selectedStudio: initialData.studioName || '',
        isFirstLogin: initialData.isFirstLogin || false,
        terms: initialData.terms || '',
        maxUsesPerUser: initialData.maxUsesPerUser || 1,
        globalRedemptionLimit: initialData.usageLimit,
        allowStacking: initialData.allowStacking || false,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        status: initialData.status
      });
    } else {
      setFormData(INITIAL_DATA);
    }
  }, [initialData]);

  // Simulate Auto-save
  useEffect(() => {
    if (showSuccessView) return; 
    const timer = setTimeout(() => {
      setAutoSaving(true);
      setTimeout(() => setAutoSaving(false), 800);
    }, 5000);
    return () => clearTimeout(timer);
  }, [formData, showSuccessView]);

  const updateField = (field: keyof CouponFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setCurrentStep(p => Math.min(STEPS.length - 1, p + 1));
    }
  };
  
  const handleBack = () => setCurrentStep(p => Math.max(0, p - 1));

  const handleSubmit = async () => {
    if (!formData.title || !formData.code) {
      alert("Please fill in all required fields (Title, Code)");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate Backend API Call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call Parent to Add Coupon
      onCreate(formData);

      // On Success
      setSubmittedData(formData);
      setShowSuccessView(true);
      // Don't reset form immediately if editing to allow them to see what they saved
      if (!isEditing) {
        setFormData(INITIAL_DATA); 
        setCurrentStep(0);
      }
    } catch (error) {
      alert("Failed to save coupon. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartFresh = () => {
    setShowSuccessView(false);
    setSubmittedData(null);
    setFormData(INITIAL_DATA);
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <StepBasic formData={formData} updateField={updateField} />;
      case 1: return <StepCode formData={formData} updateField={updateField} />;
      case 2: return <StepDiscount formData={formData} updateField={updateField} />;
      case 3: return <StepTerms formData={formData} updateField={updateField} />;
      case 4: return <StepLimits formData={formData} updateField={updateField} />;
      case 5: return <StepSchedule formData={formData} updateField={updateField} />;
      default: return null;
    }
  };

  if (showSuccessView) {
    return (
      <div className="flex h-[calc(100vh-140px)] gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{isEditing ? 'Coupon Updated Successfully!' : 'Coupon Created Successfully!'}</h2>
          <p className="text-slate-500 max-w-md mb-8">
            The coupon <span className="font-mono font-bold text-slate-700">{submittedData?.code}</span> has been {isEditing ? 'updated' : 'published'} and is now live.
          </p>
          <div className="flex gap-4">
             <button 
               onClick={handleStartFresh}
               className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
             >
               {isEditing ? (
                 <>Return to List</>
               ) : (
                 <><Plus className="w-4 h-4" /> Create Another Coupon</>
               )}
             </button>
          </div>
        </div>

        {/* Preview Panel - Visible with content */}
        <div className="hidden lg:block w-[380px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col animate-in fade-in slide-in-from-right-10 duration-500">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-500" /> Live Preview
          </h3>
          <div className="flex-1">
            {submittedData && <MobilePreview data={submittedData} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Main Form Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Stepper Header */}
        <div className="p-6 border-b border-slate-200">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-slate-800">{isEditing ? `Edit Coupon: ${initialData?.code}` : 'Create New Coupon'}</h2>
             <div className="text-xs text-slate-400 flex items-center gap-2">
                {autoSaving && <span className="flex items-center text-brand-600"><Wand2 className="w-3 h-3 mr-1 animate-spin" /> Auto-saving...</span>}
             </div>
           </div>
           
           <div className="flex items-center justify-between relative">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
             {STEPS.map((step, idx) => {
               const isActive = idx === currentStep;
               const isCompleted = idx < currentStep;
               return (
                 <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isActive ? 'bg-brand-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                     {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                   </div>
                   <span className={`text-xs font-medium ${isActive ? 'text-brand-600' : 'text-slate-400'}`}>{step}</span>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
           <div className="max-w-2xl mx-auto">
             {renderStepContent()}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-between items-center">
           <button 
             onClick={handleBack} 
             disabled={currentStep === 0 || isSubmitting}
             className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Back
           </button>
           <button 
             onClick={handleNext}
             disabled={isSubmitting}
             className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {isSubmitting ? (
               <>Processing...</>
             ) : currentStep === STEPS.length - 1 ? (
               isEditing ? 'Update Coupon' : 'Finish & Create'
             ) : (
               <>Next Step <ChevronRight className="w-4 h-4" /></>
             )}
           </button>
        </div>
      </div>

      {/* Preview Panel - Hidden Content during creation */}
      <div className="hidden lg:block w-[380px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-500" /> App Preview
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
           <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
             <Phone className="w-8 h-8" />
           </div>
           <h4 className="font-medium text-slate-700">Preview Not Available</h4>
           <p className="text-sm text-slate-500 mt-2">
             Complete the coupon creation process to see how it looks on the mobile app.
           </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponWizard;
