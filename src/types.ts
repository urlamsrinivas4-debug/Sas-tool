export type UserRole = "customer" | "technician" | "admin" | "guest";

export type KYCStatus = "unsubmitted" | "pending" | "approved" | "rejected";

export type MembershipPlanType = "basic" | "platinum" | "gold" | "diamond" | "none";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "in_transit"
  | "in_progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "refunded";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  avatar?: string;
  createdAt: string;
}

export interface Technician {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  secondaryCategories: string[];
  city: string;
  workingAreas: string[];
  walletBalance: number;
  membershipPlan: MembershipPlanType;
  kycStatus: KYCStatus;
  kycDocuments?: {
    aadhaarNumber?: string;
    panNumber?: string;
    skillCertUrl?: string;
    photoUrl?: string;
  };
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  isAvailable: boolean;
  joinedDate: string;
  lat?: number;
  lng?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  startingPrice: number;
  popular?: boolean;
  badge?: string;
  color: string;
}

export interface CityLocation {
  id: string;
  name: string;
  state: string;
  activeTechniciansCount: number;
  isPopular?: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  city: string;
  areaPincode?: string;
  mapLocation?: {
    lat: number;
    lng: number;
    addressString: string;
  };
  serviceType?: string;
  category: string;
  problemDescription: string;
  mediaUrls?: string[];
  urgency: "standard" | "today" | "emergency";
  preferredDate: string;
  preferredTime: string;
  status: BookingStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianPhone?: string;
  assignedTechnicianRating?: number;
  estimatedPrice: number;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: "Razorpay" | "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Cash After Service";
  paymentDetails?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    verifiedAt?: string;
  };
  leadDeductionFee: number;
  createdAt: string;
  verificationOtp?: string;
  rating?: number;
  reviewText?: string;
  reviewDate?: string;
  technicianLat?: number;
  technicianLng?: number;
  agreedTerms?: boolean;
}

export interface WalletTransaction {
  id: string;
  technicianId: string;
  amount: number;
  type: "credit_recharge" | "lead_deduction" | "bonus" | "membership_fee";
  description: string;
  referenceId?: string;
  date: string;
}

export interface MembershipPlan {
  id: MembershipPlanType;
  name: string;
  price: number;
  durationDays: number;
  leadDiscountPercent: number;
  priorityLeadMatching: boolean;
  badgeText: string;
  popularTag?: boolean;
  color: string;
  features: string[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  validTill: string;
  active: boolean;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerName: string;
  technicianName: string;
  category: string;
  issue: string;
  status: "open" | "in_review" | "resolved" | "refunded";
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type?: "lead" | "wallet" | "kyc" | "booking" | "system";
}

export interface PriceEstimateResult {
  estimatedMin: number;
  estimatedMax: number;
  recommendedPartsCost: string;
  estimatedDurationMinutes: number;
  breakdown: Array<{ item: string; cost: number }>;
  aiAdvice: string;
}
