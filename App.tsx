
import React, { useState } from 'react';
import { 
  LayoutDashboard, Tag, PlusCircle, BarChart3, History, 
  Menu, Bell, ChevronDown, ImagePlus 
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import CouponList from './components/CouponList';
import CreateCouponWizard from './components/CreateCouponWizard';
import Analytics from './components/Analytics';
import HistorySection from './components/StudioRequests';
import BannerUpload from './components/BannerUpload';
import { Coupon, CouponStatus, CouponCategory, DiscountType, AudienceType, CouponFormData } from './types';

type Tab = 'dashboard' | 'coupons' | 'create' | 'banners' | 'analytics' | 'history';

// Initial Mock Data moved to App level
const INITIAL_COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME-SKAWSH',
    title: 'New User Bonanza',
    description: 'Flat 20% off on first order',
    category: CouponCategory.FIRST_LOGIN,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 20,
    maxDiscount: 200,
    startDate: '2023-10-01',
    endDate: '2024-12-31',
    usageCount: 1240,
    usageLimit: 5000,
    status: CouponStatus.ACTIVE,
    audience: AudienceType.NEW,
    minOrderValue: 0,
    terms: 'Valid for new users only.'
  },
  {
    id: '2',
    code: 'LAUNDRY-50',
    title: 'Laundry Special',
    description: 'Flat ₹50 off on Laundry',
    category: CouponCategory.SERVICE_BASED,
    discountType: DiscountType.FLAT,
    discountValue: 50,
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    usageCount: 200,
    usageLimit: 200,
    status: CouponStatus.EXPIRED,
    audience: AudienceType.SERVICE,
    serviceName: 'Dry Cleaning',
    minOrderValue: 300,
    terms: 'Valid on Dry Cleaning only.'
  },
  {
    id: '3',
    code: 'STUDIO-X-10',
    title: 'Studio X Exclusive',
    description: '10% off at Studio X',
    category: CouponCategory.STUDIO_BASED,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    startDate: '2023-12-01',
    endDate: '2024-01-15',
    usageCount: 12,
    usageLimit: 100,
    status: CouponStatus.DRAFT,
    audience: AudienceType.STUDIO,
    studioName: 'Studio X',
    minOrderValue: 0
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleSaveCoupon = (formData: CouponFormData) => {
    if (editingCoupon) {
      // Update existing coupon
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? {
        ...c,
        ...formData, // Spread form data
        // Explicitly map special fields that differ
        serviceName: formData.selectedServices.join(', '),
        studioName: formData.selectedStudio,
        usageLimit: formData.globalRedemptionLimit,
        id: c.id // Keep original ID
      } : c));
      
      // We don't immediately clear editingCoupon here because the wizard shows a success screen.
      // The wizard handles the "Return to List" action which should ideally trigger a cleanup.
      // But for now, we'll let the user navigate manually or via the button in Wizard.
    } else {
      // Create new coupon
      const newCoupon: Coupon = {
        id: Math.random().toString(36).substr(2, 9),
        code: formData.code,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        maxDiscount: formData.maxDiscount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageCount: 0,
        usageLimit: formData.globalRedemptionLimit,
        status: formData.status,
        audience: formData.audience,
        studioName: formData.selectedStudio,
        serviceName: formData.selectedServices.join(', '),
        minOrderValue: formData.minOrderValue,
        terms: formData.terms,
        maxUsesPerUser: formData.maxUsesPerUser,
        isFirstLogin: formData.isFirstLogin,
        allowStacking: formData.allowStacking
      };
      setCoupons(prev => [newCoupon, ...prev]);
    }
  };

  const handleDeleteCoupon = (id: string) => {
    // In a real app, this might be a soft delete or an API call.
    // For this demo, we move it to inactive/deleted state visually by updating status
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: CouponStatus.INACTIVE } : c));
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setActiveTab('create');
  };

  const handleCreateNew = () => {
    setEditingCoupon(null);
    setActiveTab('create');
  };

  const handleUpdateCouponBanner = (couponId: string, bannerUrl: string) => {
    setCoupons(prev => prev.map(c => 
      c.id === couponId ? { ...c, bannerUrl } : c
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'coupons': 
        return <CouponList 
          coupons={coupons} 
          onEdit={handleEditCoupon} 
          onDelete={handleDeleteCoupon} 
        />;
      case 'create': 
        return <CreateCouponWizard 
          onCreate={handleSaveCoupon} 
          initialData={editingCoupon}
          isEditing={!!editingCoupon}
        />;
      case 'banners': return <BannerUpload coupons={coupons} onUpdate={handleUpdateCouponBanner} />;
      case 'analytics': return <Analytics />;
      case 'history': return <HistorySection coupons={coupons} />;
      default: return <Dashboard />;
    }
  };

  const NavItem = ({ tab, icon: Icon, label, onClick }: { tab: Tab, icon: any, label: string, onClick?: () => void }) => (
    <button
      onClick={onClick ? onClick : () => {
        if (tab === 'create') setEditingCoupon(null); // Reset edit state when clicking Create sidebar
        setActiveTab(tab);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg ${
        activeTab === tab 
          ? 'bg-brand-50 text-brand-700' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeTab === tab ? 'text-brand-600' : 'text-slate-400'}`} />
      {isSidebarOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
           <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
           {isSidebarOpen && <span className="ml-3 font-bold text-slate-800 text-lg">SKAWSH</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <div className="pt-4 pb-2">
            {isSidebarOpen && <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Offers</p>}
            <NavItem tab="coupons" icon={Tag} label="All Coupons" />
            <NavItem tab="create" icon={PlusCircle} label="Create New" onClick={handleCreateNew} />
            <NavItem tab="banners" icon={ImagePlus} label="Upload Banners" />
            <NavItem tab="history" icon={History} label="History" />
          </div>
          <div className="pt-4 border-t border-slate-100">
            <NavItem tab="analytics" icon={BarChart3} label="Analytics" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-700">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'coupons' && 'All Coupons'}
            {activeTab === 'create' && (editingCoupon ? 'Edit Offer' : 'Create Offer')}
            {activeTab === 'banners' && 'Upload Banners'}
            {activeTab === 'analytics' && 'Analytics'}
            {activeTab === 'history' && 'Offer History'}
          </h1>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-medium">A</div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-700">Admin User</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
