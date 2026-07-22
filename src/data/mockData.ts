import {
  ServiceCategory,
  CityLocation,
  MembershipPlan,
  Technician,
  Booking,
  WalletTransaction,
  Coupon,
  Dispute,
  NotificationItem,
} from "../types";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "cat_1", name: "AC Repair", iconName: "Wind", description: "Filter cleaning, gas refill, installation & PCB repair", startingPrice: 499, popular: true, badge: "High Demand", color: "from-blue-500 to-cyan-500" },
  { id: "cat_2", name: "Electrician", iconName: "Zap", description: "Wiring, switchboard, MCB, fan & light fittings", startingPrice: 199, popular: true, badge: "Fast 15-Min", color: "from-amber-500 to-yellow-500" },
  { id: "cat_3", name: "Plumber", iconName: "Droplet", description: "Tap repair, pipe leaks, basin, flush tank & drainage", startingPrice: 249, popular: true, color: "from-sky-500 to-blue-600" },
  { id: "cat_4", name: "Carpenter", iconName: "Hammer", description: "Furniture repair, door lock, bed assembly & custom wood", startingPrice: 299, popular: false, color: "from-orange-500 to-amber-700" },
  { id: "cat_5", name: "Painter", iconName: "Paintbrush", description: "Full house painting, wall waterproofing & texture design", startingPrice: 1499, popular: false, color: "from-purple-500 to-pink-500" },
  { id: "cat_6", name: "RO Repair", iconName: "GlassWater", description: "Filter replacement, membrane service & water purifier repair", startingPrice: 349, popular: true, color: "from-teal-400 to-emerald-600" },
  { id: "cat_7", name: "CCTV Installation", iconName: "Video", description: "Camera setup, DVR configuration, night vision & wiring", startingPrice: 799, popular: false, color: "from-slate-600 to-zinc-800" },
  { id: "cat_8", name: "Refrigerator Repair", iconName: "Refrigerator", description: "Cooling failure, compressor, defrosting & thermostat", startingPrice: 449, popular: true, color: "from-indigo-500 to-blue-500" },
  { id: "cat_9", name: "Washing Machine Repair", iconName: "Shirt", description: "Spin issue, motor repair, drum leak & PCB panel fix", startingPrice: 399, popular: true, color: "from-blue-400 to-indigo-600" },
  { id: "cat_10", name: "TV Repair", iconName: "Tv", description: "LED/OLED display fix, power supply, sound & wall mount", startingPrice: 499, popular: false, color: "from-red-500 to-rose-600" },
  { id: "cat_11", name: "Laptop Repair", iconName: "Laptop", description: "Screen replacement, RAM upgrade, motherboard & OS install", startingPrice: 599, popular: true, badge: "Express Service", color: "from-violet-500 to-purple-700" },
  { id: "cat_12", name: "Computer Repair", iconName: "Monitor", description: "Desktop assembly, power supply, virus cleanup & networking", startingPrice: 499, popular: false, color: "from-cyan-600 to-blue-700" },
  { id: "cat_13", name: "Mobile Repair", iconName: "Smartphone", description: "Screen replacement, battery change, charging port & water damage", startingPrice: 399, popular: true, color: "from-fuchsia-500 to-pink-600" },
  { id: "cat_14", name: "Pest Control", iconName: "Bug", description: "Termite treatment, cockroach, bed bug & mosquito fogging", startingPrice: 999, popular: false, badge: "Chemical-Free", color: "from-emerald-500 to-green-700" },
  { id: "cat_15", name: "Home Cleaning", iconName: "Sparkles", description: "Deep kitchen, bathroom, sofa, mattress & full home sanitize", startingPrice: 1499, popular: true, badge: "Bestseller", color: "from-lime-500 to-emerald-600" },
  { id: "cat_16", name: "Web Design", iconName: "Globe", description: "Custom UI/UX, responsive website, e-commerce & SEO setup", startingPrice: 4999, popular: false, color: "from-indigo-600 to-violet-800" },
  { id: "cat_17", name: "Digital Marketing", iconName: "TrendingUp", description: "Google Ads, Meta Pixel, social media management & SEO", startingPrice: 3999, popular: false, color: "from-rose-500 to-orange-500" },
];

export const CITIES: CityLocation[] = [
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", activeTechniciansCount: 1420, isPopular: true },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", activeTechniciansCount: 1850, isPopular: true },
  { id: "delhi", name: "Delhi NCR", state: "Delhi", activeTechniciansCount: 2100, isPopular: true },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", activeTechniciansCount: 1120, isPopular: true },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", activeTechniciansCount: 980, isPopular: true },
  { id: "pune", name: "Pune", state: "Maharashtra", activeTechniciansCount: 840, isPopular: true },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", activeTechniciansCount: 650, isPopular: false },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", activeTechniciansCount: 540, isPopular: false },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", activeTechniciansCount: 420, isPopular: false },
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 4999,
    durationDays: 30,
    leadDiscountPercent: 0,
    priorityLeadMatching: false,
    badgeText: "Starter",
    color: "bg-slate-800 text-white border-slate-700",
    features: [
      "Access to standard local leads",
      "Standard lead price ₹150",
      "Basic lead alerts on WhatsApp",
      "Verified Technician Profile Badge",
      "Customer Direct Call & Messaging"
    ]
  },
  {
    id: "platinum",
    name: "Platinum Plan",
    price: 9999,
    durationDays: 90,
    leadDiscountPercent: 10,
    priorityLeadMatching: true,
    badgeText: "Popular",
    popularTag: true,
    color: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400",
    features: [
      "Priority Lead Broadcasting (3 mins early access)",
      "10% discount on lead charges (₹135/lead)",
      "Dedicated Account Support Manager",
      "Verified Platinum Badge on Customer App",
      "Unlimited Wallet Recharge Bonuses",
      "Zero commission on customer cash payments"
    ]
  },
  {
    id: "gold",
    name: "Gold Plan",
    price: 14999,
    durationDays: 180,
    leadDiscountPercent: 15,
    priorityLeadMatching: true,
    badgeText: "High Earnings",
    color: "bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-amber-300",
    features: [
      "Top-tier AI Lead Matching Preference",
      "15% lead fee discount (₹127.5/lead)",
      "FREE ₹1,500 bonus wallet credit included",
      "Instant 1-click customer call & routing",
      "Free advertising spot in top search results",
      "24/7 priority technician helpline"
    ]
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    price: 24999,
    durationDays: 365,
    leadDiscountPercent: 25,
    priorityLeadMatching: true,
    badgeText: "VIP Partner",
    color: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white border-fuchsia-300",
    features: [
      "Exclusive High-Value Commercial Leads",
      "25% lead fee discount (₹112.5/lead)",
      "FREE ₹3,000 bonus wallet credit",
      "Guaranteed minimum 100 leads/month",
      "VIP Diamond Verified Badge",
      "Free annual tool insurance coverage"
    ]
  }
];

export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: "tech_101",
    userId: "usr_tech_101",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.ac@servipulse.com",
    category: "AC Repair",
    secondaryCategories: ["Refrigerator Repair", "Washing Machine Repair"],
    city: "Mumbai",
    workingAreas: ["Andheri", "Bandra", "Juhu", "Powai"],
    walletBalance: 1250,
    membershipPlan: "platinum",
    kycStatus: "approved",
    kycDocuments: {
      aadhaarNumber: "XXXX-XXXX-4812",
      panNumber: "ABCDE1234F",
      skillCertUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop"
    },
    rating: 4.9,
    reviewCount: 148,
    jobsCompleted: 320,
    isAvailable: true,
    joinedDate: "2024-01-15",
    lat: 19.1197,
    lng: 72.8464
  },
  {
    id: "tech_102",
    userId: "usr_tech_102",
    name: "Suresh Sharma",
    phone: "+91 91234 56789",
    email: "suresh.elec@servipulse.com",
    category: "Electrician",
    secondaryCategories: ["CCTV Installation"],
    city: "Bengaluru",
    workingAreas: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield"],
    walletBalance: 850,
    membershipPlan: "gold",
    kycStatus: "approved",
    kycDocuments: {
      aadhaarNumber: "XXXX-XXXX-9901",
      panNumber: "PQRST5678K"
    },
    rating: 4.8,
    reviewCount: 92,
    jobsCompleted: 210,
    isAvailable: true,
    joinedDate: "2024-03-10",
    lat: 12.9352,
    lng: 77.6245
  },
  {
    id: "tech_103",
    userId: "usr_tech_103",
    name: "Anil Verma",
    phone: "+91 98112 23344",
    email: "anil.plumb@servipulse.com",
    category: "Plumber",
    secondaryCategories: ["RO Repair"],
    city: "Delhi NCR",
    workingAreas: ["South Delhi", "Gurugram", "Noida", "Connaught Place"],
    walletBalance: 450,
    membershipPlan: "basic",
    kycStatus: "approved",
    rating: 4.7,
    reviewCount: 64,
    jobsCompleted: 140,
    isAvailable: true,
    joinedDate: "2024-05-20",
    lat: 28.5355,
    lng: 77.2610
  },
  {
    id: "tech_104",
    userId: "usr_tech_104",
    name: "Vikram Singh",
    phone: "+91 97788 99001",
    email: "vikram.clean@servipulse.com",
    category: "Home Cleaning",
    secondaryCategories: ["Pest Control"],
    city: "Hyderabad",
    workingAreas: ["Gachibowli", "Hitec City", "Jubilee Hills", "Banjara Hills"],
    walletBalance: 2100,
    membershipPlan: "diamond",
    kycStatus: "approved",
    rating: 4.95,
    reviewCount: 230,
    jobsCompleted: 510,
    isAvailable: true,
    joinedDate: "2023-11-01",
    lat: 17.4401,
    lng: 78.3489
  },
  {
    id: "tech_105",
    userId: "usr_tech_105",
    name: "Manoj Patel",
    phone: "+91 96543 21098",
    email: "manoj.laptop@servipulse.com",
    category: "Laptop Repair",
    secondaryCategories: ["Computer Repair", "Mobile Repair"],
    city: "Mumbai",
    workingAreas: ["Andheri East", "Malad", "Borivali", "Powai"],
    walletBalance: 0, // Zero balance to demonstrate restriction logic
    membershipPlan: "basic",
    kycStatus: "pending",
    rating: 4.6,
    reviewCount: 28,
    jobsCompleted: 45,
    isAvailable: false,
    joinedDate: "2024-06-01",
    lat: 19.1136,
    lng: 72.8697
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "book_901",
    bookingNumber: "SP-2026-8801",
    customerId: "cust_001",
    customerName: "Priya Sundaram",
    customerPhone: "+91 98200 11223",
    customerEmail: "priya.s@gmail.com",
    customerAddress: "Flat 402, Sea Breeze Heights, Bandra West, Mumbai",
    city: "Mumbai",
    category: "AC Repair",
    problemDescription: "Split AC not cooling properly and making buzzing sound from outdoor compressor unit.",
    urgency: "today",
    preferredDate: "2026-07-22",
    preferredTime: "02:00 PM - 04:00 PM",
    status: "in_transit",
    assignedTechnicianId: "tech_101",
    assignedTechnicianName: "Rajesh Kumar",
    assignedTechnicianPhone: "+91 98765 43210",
    assignedTechnicianRating: 4.9,
    estimatedPrice: 799,
    finalAmount: 799,
    paymentStatus: "paid",
    paymentMethod: "UPI",
    leadDeductionFee: 150,
    createdAt: "2026-07-22T09:30:00.000Z",
    verificationOtp: "4829",
    technicianLat: 19.1150,
    technicianLng: 72.8420
  },
  {
    id: "book_902",
    bookingNumber: "SP-2026-8802",
    customerId: "cust_002",
    customerName: "Arjun Reddy",
    customerPhone: "+91 99887 76655",
    customerEmail: "arjun.r@gmail.com",
    customerAddress: "Villa 14, Palm Meadows, Koramangala, Bengaluru",
    city: "Bengaluru",
    category: "Electrician",
    problemDescription: "MCB tripping frequently whenever microwave is powered on. Need complete panel check.",
    urgency: "emergency",
    preferredDate: "2026-07-22",
    preferredTime: "Immediate Slot",
    status: "in_progress",
    assignedTechnicianId: "tech_102",
    assignedTechnicianName: "Suresh Sharma",
    assignedTechnicianPhone: "+91 91234 56789",
    assignedTechnicianRating: 4.8,
    estimatedPrice: 499,
    finalAmount: 499,
    paymentStatus: "pending",
    paymentMethod: "Razorpay",
    leadDeductionFee: 150,
    createdAt: "2026-07-22T10:15:00.000Z",
    verificationOtp: "7103"
  },
  {
    id: "book_903",
    bookingNumber: "SP-2026-8803",
    customerId: "cust_003",
    customerName: "Aakash Mehta",
    customerPhone: "+91 97110 02233",
    customerEmail: "aakash.m@gmail.com",
    customerAddress: "B-104, Green Park Extension, New Delhi",
    city: "Delhi NCR",
    category: "Plumber",
    problemDescription: "Continuous water seepage under kitchen sink cabinet and leaking angle valve.",
    urgency: "standard",
    preferredDate: "2026-07-23",
    preferredTime: "10:00 AM - 12:00 PM",
    status: "pending",
    estimatedPrice: 349,
    finalAmount: 349,
    paymentStatus: "pending",
    leadDeductionFee: 150,
    createdAt: "2026-07-22T11:00:00.000Z"
  },
  {
    id: "book_900",
    bookingNumber: "SP-2026-8799",
    customerId: "cust_001",
    customerName: "Priya Sundaram",
    customerPhone: "+91 98200 11223",
    customerEmail: "priya.s@gmail.com",
    customerAddress: "Flat 402, Sea Breeze Heights, Bandra West, Mumbai",
    city: "Mumbai",
    category: "Home Cleaning",
    problemDescription: "Full 2BHK deep home cleaning including balcony pressure wash and sofa shampooing.",
    urgency: "standard",
    preferredDate: "2026-07-18",
    preferredTime: "09:00 AM",
    status: "completed",
    assignedTechnicianId: "tech_104",
    assignedTechnicianName: "Vikram Singh",
    assignedTechnicianPhone: "+91 97788 99001",
    assignedTechnicianRating: 4.95,
    estimatedPrice: 2499,
    finalAmount: 2299,
    paymentStatus: "paid",
    paymentMethod: "Razorpay",
    leadDeductionFee: 150,
    createdAt: "2026-07-17T14:20:00.000Z",
    rating: 5,
    reviewText: "Outstanding job! The team came with industrial equipment, cleaned every corner thoroughly, and left the home sparkling fresh.",
    reviewDate: "2026-07-18T16:00:00.000Z"
  }
];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "tx_501",
    technicianId: "tech_101",
    amount: 2000,
    type: "credit_recharge",
    description: "UPI Wallet Recharge - HDFC Bank",
    referenceId: "PAY_UPI_994812",
    date: "2026-07-20T14:30:00.000Z"
  },
  {
    id: "tx_502",
    technicianId: "tech_101",
    amount: -150,
    type: "lead_deduction",
    description: "Lead Fee Deducted: AC Repair (Book #SP-2026-8801)",
    referenceId: "LEAD_8801",
    date: "2026-07-22T09:31:00.000Z"
  },
  {
    id: "tx_503",
    technicianId: "tech_102",
    amount: 1000,
    type: "credit_recharge",
    description: "Razorpay Instant Recharge",
    referenceId: "RZP_1028391",
    date: "2026-07-21T18:10:00.000Z"
  },
  {
    id: "tx_504",
    technicianId: "tech_102",
    amount: -150,
    type: "lead_deduction",
    description: "Lead Fee Deducted: Electrician (Book #SP-2026-8802)",
    referenceId: "LEAD_8802",
    date: "2026-07-22T10:16:00.000Z"
  }
];

export const MOCK_COUPONS: Coupon[] = [
  { code: "FIRST100", discountPercent: 20, maxDiscount: 150, minOrder: 399, validTill: "2026-12-31", active: true },
  { code: "SUMMERCOOL", discountPercent: 15, maxDiscount: 300, minOrder: 799, validTill: "2026-08-31", active: true },
  { code: "FESTIVE500", discountPercent: 25, maxDiscount: 500, minOrder: 1999, validTill: "2026-10-15", active: true }
];

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "disp_101",
    bookingId: "SP-2026-8750",
    customerName: "Neha Kapoor",
    technicianName: "Anil Verma",
    category: "Plumber",
    issue: "Customer reported minor leakage from new joint 2 days after service.",
    status: "in_review",
    createdAt: "2026-07-20T11:40:00.000Z"
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    userId: "usr_tech_101",
    title: "⚡ Urgent Lead Available in Bandra!",
    message: "New AC Repair request from Priya Sundaram. Potential Earnings: ₹799.",
    time: "10 mins ago",
    isRead: false,
    type: "lead"
  },
  {
    id: "notif_2",
    userId: "usr_tech_101",
    title: "💰 Wallet Balance Updated",
    message: "₹150 deducted for accepted lead #SP-2026-8801. Balance: ₹1,250.",
    time: "15 mins ago",
    isRead: true,
    type: "wallet"
  },
  {
    id: "notif_3",
    userId: "usr_tech_102",
    title: "⭐ New 5-Star Customer Review!",
    message: "Arjun Reddy rated your electrical work 5/5 stars: 'Super fast mcb fix!'",
    time: "1 hour ago",
    isRead: false,
    type: "booking"
  }
];
