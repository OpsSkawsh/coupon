import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle, Save, MousePointerClick } from 'lucide-react';
import { Coupon, CouponStatus } from '../types';

interface BannerUploadProps {
  coupons: Coupon[];
  onUpdate: (couponId: string, bannerUrl: string) => void;
}

const BannerUpload: React.FC<BannerUploadProps> = ({ coupons, onUpdate }) => {
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter only active or draft coupons for banner uploads
  const eligibleCoupons = coupons.filter(c => 
    c.status !== CouponStatus.EXPIRED && c.status !== CouponStatus.INACTIVE
  );

  const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCouponId(id);
    setShowSuccess(false);
    const coupon = coupons.find(c => c.id === id);
    if (coupon && coupon.bannerUrl) {
      setPreviewUrl(coupon.bannerUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setShowSuccess(false);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (selectedCouponId && previewUrl) {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        onUpdate(selectedCouponId, previewUrl);
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 800);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectedCoupon = coupons.find(c => c.id === selectedCouponId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Coupon Banners</h2>
        <p className="text-sm text-slate-500">Upload promotional graphics for your active coupons.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Coupon</label>
            <select
              value={selectedCouponId}
              onChange={handleCouponChange}
              className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            >
              <option value="">-- Choose a coupon to bannerize --</option>
              {eligibleCoupons.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
            {selectedCouponId && (
               <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className={`w-2 h-2 rounded-full ${selectedCoupon?.status === 'Active' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                  Status: {selectedCoupon?.status}
                  <span className="mx-1">•</span>
                  Category: {selectedCoupon?.category}
               </div>
            )}
          </div>

          <div className={`bg-white p-8 rounded-xl border-2 border-dashed transition-all duration-200 text-center ${
            !selectedCouponId ? 'opacity-50 pointer-events-none border-slate-200' :
            isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400'
          }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDragging ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
                {previewUrl ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <Upload className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-700">
                  {previewUrl ? 'Change Banner Image' : 'Click or Drag Banner Here'}
                </h3>
                <p className="text-xs text-slate-500">Supports JPG, PNG (Max 2MB)</p>
                <p className="text-[10px] text-slate-400">Recommended Size: 1024x512px</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                disabled={!selectedCouponId}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!selectedCouponId}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Browse Files
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col h-full">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-500" /> Banner Preview
          </h3>
          
          <div className="flex-1 flex items-center justify-center">
            {selectedCouponId && previewUrl ? (
              <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                <div className="relative h-40 bg-slate-200">
                  <img src={previewUrl} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                    SPONSORED
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{selectedCoupon?.code}</h4>
                      <p className="text-sm text-slate-500">{selectedCoupon?.title}</p>
                    </div>
                    <div className="bg-brand-50 text-brand-700 font-bold px-3 py-1 rounded-lg text-sm">
                      Apply
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{selectedCoupon?.description}</p>
                </div>
                {/* Actions Bar */}
                <div className="border-t border-slate-100 p-3 bg-slate-50 flex gap-2 justify-end">
                   <button 
                     onClick={handleRemove}
                     className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     title="Remove Image"
                   >
                     <X className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-white/50 w-full h-64 flex flex-col items-center justify-center">
                 <MousePointerClick className="w-10 h-10 mb-3 opacity-20" />
                 <p className="text-sm font-medium">No coupon selected or image uploaded</p>
                 <p className="text-xs opacity-70 mt-1">Select a coupon and upload an image to see preview</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end gap-3">
             <button 
               onClick={() => {
                 setSelectedCouponId('');
                 setPreviewUrl(null);
               }}
               className="px-4 py-2 text-slate-600 hover:bg-white rounded-lg text-sm font-medium transition-colors"
             >
               Cancel
             </button>
             <button 
               onClick={handleSave}
               disabled={!selectedCouponId || !previewUrl || isSaving}
               className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium text-sm transition-all shadow-sm ${
                 showSuccess ? 'bg-green-600' : 
                 (!selectedCouponId || !previewUrl) ? 'bg-slate-300 cursor-not-allowed' : 
                 'bg-brand-600 hover:bg-brand-700 hover:shadow'
               }`}
             >
               {isSaving ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : showSuccess ? (
                 <>Saved <CheckCircle2 className="w-4 h-4" /></>
               ) : (
                 <>Save Banner <Save className="w-4 h-4" /></>
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerUpload;