
export enum CouponStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  EXPIRED = 'Expired',
}

export enum CouponCategory {
  FIRST_LOGIN = 'First Login',
  ORDER_BASED = 'Order Based',
  SERVICE_BASED = 'Service Based',
  STUDIO_BASED = 'Studio Based',
}

export enum DiscountType {
  FLAT = 'Flat',
  PERCENTAGE = 'Percentage',
}

export enum AudienceType {
  ALL = 'All Users',
  NEW = 'New Users Only',
  STUDIO = 'Specific Studio Users',
  SERVICE = 'Specific Service Users',
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  category: CouponCategory;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit: number;
  status: CouponStatus;
  audience: AudienceType;
  studioName?: string;
  serviceName?: string;
  // Extended fields from Wizard
  minOrderValue?: number;
  terms?: string;
  selectedServices?: string[];
  maxUsesPerUser?: number;
  isFirstLogin?: boolean;
  allowStacking?: boolean;
  // New field for Banner
  bannerUrl?: string;
}

export interface CouponFormData {
  title: string;
  description: string;
  category: CouponCategory;
  audience: AudienceType;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  applyOn: 'ORDER' | 'SERVICE';
  selectedServices: string[];
  selectedStudio: string;
  isFirstLogin: boolean;
  terms: string;
  maxUsesPerUser: number;
  globalRedemptionLimit: number;
  allowStacking: boolean;
  startDate: string;
  endDate: string;
  status: CouponStatus;
}

export interface AnalyticsData {
  date: string;
  redemptions: number;
  revenue: number;
}