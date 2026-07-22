import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  User,
  Technician,
  Booking,
  WalletTransaction,
  MembershipPlan,
  Coupon,
  Dispute,
  NotificationItem,
  MembershipPlanType,
  KYCStatus,
  BookingStatus,
} from "../types";
import {
  SERVICE_CATEGORIES,
  CITIES,
  MEMBERSHIP_PLANS,
  MOCK_TECHNICIANS,
  INITIAL_BOOKINGS,
  MOCK_TRANSACTIONS,
  MOCK_COUPONS,
  MOCK_DISPUTES,
  MOCK_NOTIFICATIONS,
} from "../data/mockData";

interface AppContextType {
  // User & Auth Role
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeTechnician: Technician | null;
  setActiveTechnician: (tech: Technician | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authDefaultRole: UserRole;
  setAuthDefaultRole: (role: UserRole) => void;

  // Location & Category
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Marketplace Data
  categories: typeof SERVICE_CATEGORIES;
  cities: typeof CITIES;
  bookings: Booking[];
  technicians: Technician[];
  transactions: WalletTransaction[];
  membershipPlans: MembershipPlan[];
  coupons: Coupon[];
  disputes: Dispute[];
  notifications: NotificationItem[];

  // Admin Config
  leadPrice: number;
  setLeadPrice: (price: number) => void;

  // Core Business Actions
  createBooking: (newBooking: Omit<Booking, "id" | "bookingNumber" | "status" | "createdAt" | "leadDeductionFee">) => Booking;
  acceptLead: (bookingId: string, technicianId: string) => { success: boolean; message: string };
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  cancelBooking: (bookingId: string) => void;
  addReview: (bookingId: string, rating: number, reviewText: string) => void;

  // Technician Actions
  rechargeWallet: (technicianId: string, amount: number, paymentMethod: string) => void;
  upgradeMembership: (technicianId: string, plan: MembershipPlanType) => void;
  submitKYC: (technicianId: string, docs: NonNullable<Technician["kycDocuments"]>) => void;
  toggleTechnicianAvailability: (technicianId: string) => void;

  // Admin Actions
  approveKYC: (technicianId: string, approved: boolean) => void;
  addCategory: (cat: (typeof SERVICE_CATEGORIES)[0]) => void;
  addCity: (cityName: string, stateName: string) => void;
  resolveDispute: (disputeId: string, action: "resolved" | "refunded") => void;
  addCoupon: (coupon: Coupon) => void;

  // UI Modals
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  activeBookingForInvoice: Booking | null;
  setActiveBookingForInvoice: (booking: Booking | null) => void;
  activeTrackingBooking: Booking | null;
  setActiveTrackingBooking: (booking: Booking | null) => void;

  // Utilities
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved role or default "customer"
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem("servipulse_role") as UserRole) || "customer";
  });

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "usr_cust_001",
    name: "Priya Sundaram",
    email: "priya.s@gmail.com",
    phone: "+91 98200 11223",
    role: "customer",
    city: "Mumbai",
    createdAt: "2026-01-01"
  });

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const saved = localStorage.getItem("servipulse_technicians");
    return saved ? JSON.parse(saved) : MOCK_TECHNICIANS;
  });

  const [activeTechnician, setActiveTechnicianState] = useState<Technician | null>(() => {
    return technicians[0] || null;
  });

  const [selectedCity, setSelectedCity] = useState<string>("Mumbai");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("servipulse_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem("servipulse_transactions");
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  const [leadPrice, setLeadPriceState] = useState<number>(150);
  const [categories, setCategories] = useState(SERVICE_CATEGORIES);
  const [cities, setCities] = useState(CITIES);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>("customer");
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [activeBookingForInvoice, setActiveBookingForInvoice] = useState<Booking | null>(null);
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<Booking | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("servipulse_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("servipulse_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("servipulse_technicians", JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem("servipulse_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === "technician") {
      setActiveTechnicianState(technicians[0]);
      setCurrentUser({
        id: technicians[0].userId,
        name: technicians[0].name,
        email: technicians[0].email,
        phone: technicians[0].phone,
        role: "technician",
        city: technicians[0].city,
        createdAt: technicians[0].joinedDate
      });
    } else if (newRole === "admin") {
      setCurrentUser({
        id: "usr_admin_001",
        name: "ServiPulse Super Admin",
        email: "admin@servipulse.com",
        phone: "+91 90000 00000",
        role: "admin",
        city: "All Cities",
        createdAt: "2025-01-01"
      });
    } else {
      setCurrentUser({
        id: "usr_cust_001",
        name: "Priya Sundaram",
        email: "priya.s@gmail.com",
        phone: "+91 98200 11223",
        role: "customer",
        city: selectedCity,
        createdAt: "2026-01-01"
      });
    }
    showToast(`Switched workspace role to ${newRole.toUpperCase()}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Create new booking
  const createBooking = (
    data: Omit<Booking, "id" | "bookingNumber" | "status" | "createdAt" | "leadDeductionFee">
  ): Booking => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...data,
      id: `book_${Date.now()}`,
      bookingNumber: `SP-2026-${randomNum}`,
      status: "pending",
      leadDeductionFee: leadPrice,
      createdAt: new Date().toISOString(),
      verificationOtp: Math.floor(1000 + Math.random() * 9000).toString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send mock notification to eligible technicians
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: "all_techs",
      title: `⚡ New ${newBooking.category} Lead in ${newBooking.city}!`,
      message: `${newBooking.customerName} needs service: "${newBooking.problemDescription.slice(0, 50)}..."`,
      time: "Just now",
      isRead: false,
      type: "lead"
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Service Booked Successfully! Booking ID: ${newBooking.bookingNumber}`);
    return newBooking;
  };

  // Technician accepts lead -> deduct leadPrice (default ₹150)
  const acceptLead = (bookingId: string, technicianId: string) => {
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) {
      return { success: false, message: "Technician profile not found." };
    }

    if (tech.walletBalance < leadPrice) {
      return {
        success: false,
        message: `Insufficient Wallet Balance! Required: ₹${leadPrice}, Current Balance: ₹${tech.walletBalance}. Please recharge your wallet to accept leads.`
      };
    }

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, message: "Booking lead not found." };
    }

    if (booking.status !== "pending") {
      return { success: false, message: "This lead has already been accepted by another technician." };
    }

    // Deduct wallet balance
    const updatedWallet = tech.walletBalance - leadPrice;
    const updatedTechs = technicians.map((t) => (t.id === technicianId ? { ...t, walletBalance: updatedWallet } : t));
    setTechnicians(updatedTechs);

    if (activeTechnician && activeTechnician.id === technicianId) {
      setActiveTechnicianState({ ...activeTechnician, walletBalance: updatedWallet });
    }

    // Record wallet transaction
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      technicianId,
      amount: -leadPrice,
      type: "lead_deduction",
      description: `Lead Fee Deducted: ${booking.category} (#${booking.bookingNumber})`,
      referenceId: booking.bookingNumber,
      date: new Date().toISOString()
    };
    setTransactions((prev) => [tx, ...prev]);

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "accepted",
              assignedTechnicianId: tech.id,
              assignedTechnicianName: tech.name,
              assignedTechnicianPhone: tech.phone,
              assignedTechnicianRating: tech.rating,
              technicianLat: tech.lat || 19.1197,
              technicianLng: tech.lng || 72.8464
            }
          : b
      )
    );

    showToast(`Lead Accepted! ₹${leadPrice} deducted from wallet. Customer contact details unlocked.`);
    return { success: true, message: "Lead accepted successfully!" };
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = { ...b, status };
          if (status === "completed") {
            updated.paymentStatus = "paid";
          }
          return updated;
        }
        return b;
      })
    );
    showToast(`Booking status updated to ${status.replace("_", " ").toUpperCase()}`);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );
    showToast("Booking has been cancelled.");
  };

  const addReview = (bookingId: string, rating: number, reviewText: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              rating,
              reviewText,
              reviewDate: new Date().toISOString()
            }
          : b
      )
    );
    showToast("Thank you for your rating & feedback!");
  };

  const rechargeWallet = (technicianId: string, amount: number, paymentMethod: string) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === technicianId ? { ...t, walletBalance: t.walletBalance + amount } : t))
    );
    if (activeTechnician && activeTechnician.id === technicianId) {
      setActiveTechnicianState((prev) => (prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null));
    }

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      technicianId,
      amount,
      type: "credit_recharge",
      description: `Wallet Recharge via ${paymentMethod}`,
      referenceId: `PAY_${Date.now()}`,
      date: new Date().toISOString()
    };
    setTransactions((prev) => [tx, ...prev]);

    showToast(`Wallet Recharged with ₹${amount.toLocaleString("en-IN")} via ${paymentMethod}!`);
  };

  const upgradeMembership = (technicianId: string, plan: MembershipPlanType) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === technicianId ? { ...t, membershipPlan: plan } : t))
    );
    if (activeTechnician && activeTechnician.id === technicianId) {
      setActiveTechnicianState((prev) => (prev ? { ...prev, membershipPlan: plan } : null));
    }
    showToast(`Successfully upgraded to ${plan.toUpperCase()} Membership Plan!`);
  };

  const submitKYC = (technicianId: string, docs: NonNullable<Technician["kycDocuments"]>) => {
    setTechnicians((prev) =>
      prev.map((t) =>
        t.id === technicianId ? { ...t, kycStatus: "pending" as KYCStatus, kycDocuments: docs } : t
      )
    );
    if (activeTechnician && activeTechnician.id === technicianId) {
      setActiveTechnicianState((prev) => (prev ? { ...prev, kycStatus: "pending", kycDocuments: docs } : null));
    }
    showToast("KYC Documents submitted for verification. Admin approval usually takes 2-4 hours.");
  };

  const toggleTechnicianAvailability = (technicianId: string) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === technicianId) {
          const updated = !t.isAvailable;
          showToast(`Duty Status: ${updated ? "ONLINE (Receiving Leads)" : "OFFLINE"}`);
          return { ...t, isAvailable: updated };
        }
        return t;
      })
    );
    if (activeTechnician && activeTechnician.id === technicianId) {
      setActiveTechnicianState((prev) => (prev ? { ...prev, isAvailable: !prev.isAvailable } : null));
    }
  };

  const approveKYC = (technicianId: string, approved: boolean) => {
    const status: KYCStatus = approved ? "approved" : "rejected";
    setTechnicians((prev) =>
      prev.map((t) => (t.id === technicianId ? { ...t, kycStatus: status } : t))
    );
    showToast(`Technician KYC ${approved ? "Approved" : "Rejected"}.`);
  };

  const addCategory = (cat: (typeof SERVICE_CATEGORIES)[0]) => {
    setCategories((prev) => [...prev, cat]);
    showToast(`New Category '${cat.name}' added successfully.`);
  };

  const addCity = (cityName: string, stateName: string) => {
    const newCity = {
      id: cityName.toLowerCase().replace(/\s+/g, "-"),
      name: cityName,
      state: stateName,
      activeTechniciansCount: 10,
      isPopular: false
    };
    setCities((prev) => [...prev, newCity]);
    showToast(`New City '${cityName}' onboarded.`);
  };

  const resolveDispute = (disputeId: string, action: "resolved" | "refunded") => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: action } : d))
    );
    showToast(`Dispute #${disputeId} marked as ${action.toUpperCase()}`);
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    showToast(`Coupon code ${coupon.code} created.`);
  };

  const setLeadPrice = (price: number) => {
    setLeadPriceState(price);
    showToast(`Updated default lead deduction price to ₹${price}`);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        activeTechnician,
        setActiveTechnician: setActiveTechnicianState,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authDefaultRole,
        setAuthDefaultRole,

        selectedCity,
        setSelectedCity,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,

        categories,
        cities,
        bookings,
        technicians,
        transactions,
        membershipPlans: MEMBERSHIP_PLANS,
        coupons,
        disputes,
        notifications,

        leadPrice,
        setLeadPrice,

        createBooking,
        acceptLead,
        updateBookingStatus,
        cancelBooking,
        addReview,

        rechargeWallet,
        upgradeMembership,
        submitKYC,
        toggleTechnicianAvailability,

        approveKYC,
        addCategory,
        addCity,
        resolveDispute,
        addCoupon,

        isAIChatOpen,
        setIsAIChatOpen,
        activeBookingForInvoice,
        setActiveBookingForInvoice,
        activeTrackingBooking,
        setActiveTrackingBooking,

        darkMode,
        setDarkMode,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
