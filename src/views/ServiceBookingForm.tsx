import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Upload,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Phone,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Smartphone,
  Navigation,
  FileText,
  Check
} from "lucide-react";
import { ServiceCategory, Booking } from "../types";
import { RazorpayModal } from "../components/RazorpayModal";

interface ServiceBookingFormProps {
  category: ServiceCategory;
  onClose: () => void;
  onSuccessBooking: (bookingId: string) => void;
}

export const ServiceBookingForm: React.FC<ServiceBookingFormProps> = ({
  category,
  onClose,
  onSuccessBooking,
}) => {
  const { selectedCity, currentUser, createBooking, coupons, showToast, cities } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Field States
  const [customerName, setCustomerName] = useState(currentUser?.name || "Priya Sundaram");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "9820011223");
  const [otpCode, setOtpCode] = useState("4829");
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(true); // Default verified for prefilled demo phone

  const [serviceType, setServiceType] = useState("Full Inspection & Servicing");
  const [customerAddress, setCustomerAddress] = useState("Flat 402, Sea Breeze Heights, Hill Road");
  const [city, setCity] = useState(selectedCity || "Mumbai");
  const [areaPincode, setAreaPincode] = useState("400050");
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number; addressString: string } | null>({
    lat: 19.0544,
    lng: 72.8315,
    addressString: "Hill Road, Bandra West, Mumbai, Maharashtra 400050"
  });

  const [problemDescription, setProblemDescription] = useState("AC outdoor unit is humming loudly and blowing warm air instead of cooling.");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(["ac_unit_photo_1.jpg"]);
  
  const [urgency, setUrgency] = useState<"standard" | "today" | "emergency">("today");
  const [preferredDate, setPreferredDate] = useState<string>("2026-07-22");
  const [preferredTime, setPreferredTime] = useState<string>("02:00 PM - 04:00 PM");

  const [paymentMethod, setPaymentMethod] = useState<"Razorpay" | "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Cash After Service">("UPI");
  const [agreedTerms, setAgreedTerms] = useState(true);

  // AI Estimate state
  const [aiEstimating, setAiEstimating] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<{
    minPrice: number;
    maxPrice: number;
    advice: string;
  } | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Payment Gateway Modal state
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Touched states for validation feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Prices
  const basePrice = category.startingPrice;
  const subtotal = Math.max(199, aiEstimate ? aiEstimate.minPrice : basePrice);
  const finalPrice = Math.max(0, subtotal - appliedDiscount);

  // Field validation conditions
  const isNameValid = customerName.trim().length >= 2;
  const isPhoneValid = customerPhone.replace(/\D/g, "").length >= 10 && isOtpVerified;
  const isCategoryValid = !!category.name;
  const isServiceTypeValid = serviceType.trim().length > 0;
  const isAddressValid = customerAddress.trim().length >= 5;
  const isCityValid = city.trim().length > 0;
  const isPincodeValid = areaPincode.trim().length >= 3;
  const isMapLocationValid = mapLocation !== null && !!mapLocation.addressString;
  const isProblemDescValid = problemDescription.trim().length >= 8;
  const isDateValid = !!preferredDate;
  const isTimeValid = !!preferredTime;
  const isPaymentMethodValid = !!paymentMethod;
  const isTermsValid = agreedTerms === true;

  // Step 1 Validation
  const isStep1Valid = isCategoryValid && isServiceTypeValid && isProblemDescValid;

  // Step 2 Validation
  const isStep2Valid = isNameValid && isPhoneValid && isAddressValid && isCityValid && isPincodeValid && isMapLocationValid && isDateValid && isTimeValid;

  // Entire Form Validation
  const isFormValid = isStep1Valid && isStep2Valid && isPaymentMethodValid && isTermsValid;

  // Handle phone change -> reset OTP verification
  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
    if (val !== currentUser?.phone) {
      setIsOtpVerified(false);
      setIsOtpSent(false);
    }
  };

  const handleSendOtp = async () => {
    if (customerPhone.replace(/\D/g, "").length < 10) {
      showToast("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsOtpSending(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customerPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpSent(true);
        showToast(data.message);
      } else {
        showToast(data.message || "Failed to send OTP.");
      }
    } catch {
      showToast("OTP Service temporarily unavailable. Use test OTP 4829.");
      setIsOtpSent(true);
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customerPhone, otp: otpCode }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpVerified(true);
        showToast("Mobile Number Verified Successfully!");
      } else {
        showToast(data.message || "Invalid OTP code.");
      }
    } catch {
      if (otpCode === "4829") {
        setIsOtpVerified(true);
        showToast("Mobile Number Verified!");
      } else {
        showToast("Invalid OTP code.");
      }
    }
  };

  const handleDetectGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            addressString: `GPS Lat: ${pos.coords.latitude.toFixed(4)}°, Lng: ${pos.coords.longitude.toFixed(4)}° (${areaPincode}, ${city})`,
          });
          showToast("Detected precise GPS location!");
        },
        () => {
          setMapLocation({
            lat: 19.0760,
            lng: 72.8777,
            addressString: `GPS Pinpoint: ${areaPincode}, ${city}, India`,
          });
          showToast("Set location via pincode & area landmark.");
        }
      );
    } else {
      setMapLocation({
        lat: 19.0760,
        lng: 72.8777,
        addressString: `Pinpoint: ${areaPincode}, ${city}`,
      });
    }
  };

  const handleFetchAiEstimate = async () => {
    if (!problemDescription.trim()) {
      showToast("Please describe the problem first.");
      return;
    }
    setAiEstimating(true);
    try {
      const res = await fetch("/api/ai/estimate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: category.name,
          problemDescription,
          urgency,
          city,
        }),
      });
      const data = await res.json();
      setAiEstimate({
        minPrice: data.estimatedMin || basePrice,
        maxPrice: data.estimatedMax || basePrice + 300,
        advice: data.aiAdvice || "Transparent upfront pricing guaranteed.",
      });
      showToast("AI Price Estimate calculated!");
    } catch {
      setAiEstimate({
        minPrice: basePrice,
        maxPrice: basePrice + 250,
        advice: "Technician will diagnose the issue on site before work begins.",
      });
    } finally {
      setAiEstimating(false);
    }
  };

  const handleApplyCoupon = () => {
    const found = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    if (found) {
      const disc = Math.min(found.maxDiscount, Math.round((subtotal * found.discountPercent) / 100));
      setAppliedDiscount(disc);
      showToast(`Coupon ${found.code} applied! Saved ₹${disc}`);
    } else {
      showToast("Invalid or expired coupon code.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f: File) => f.name);
      setUploadedFiles((prev) => [...prev, ...names]);
      showToast(`Attached ${names.length} photo/video file(s).`);
    }
  };

  // Submit Handler
  const handleSubmitBookingFlow = async () => {
    setPaymentError(null);

    if (!isFormValid) {
      showToast("Please complete all mandatory fields before submitting.");
      return;
    }

    // ONLINE PAYMENT FLOW (Razorpay / UPI / Cards / Net Banking)
    if (paymentMethod !== "Cash After Service") {
      setIsSubmittingBooking(true);
      try {
        const res = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalPrice,
            category: category.name,
            customerName,
            customerPhone,
          }),
        });

        const order = await res.json();
        if (order.success) {
          setRazorpayOrder(order);
          setShowRazorpayModal(true);
        } else {
          setPaymentError("Could not initiate payment gateway order.");
        }
      } catch (err) {
        setPaymentError("Server connection error during payment initialization.");
      } finally {
        setIsSubmittingBooking(false);
      }
    } else {
      // CASH ON SERVICE FLOW
      createSecureBookingOnServer(null);
    }
  };

  const createSecureBookingOnServer = async (paymentDetails: any | null) => {
    setIsSubmittingBooking(true);
    setPaymentError(null);

    const payload = {
      customerName,
      customerPhone,
      isOtpVerified,
      category: category.name,
      serviceType,
      customerAddress,
      city,
      areaPincode,
      mapLocation,
      problemDescription,
      uploadedFiles,
      preferredDate,
      preferredTime,
      paymentMethod,
      paymentDetails,
      agreedTerms,
      finalAmount: finalPrice,
      estimatedPrice: subtotal,
    };

    try {
      const res = await fetch("/api/bookings/create-secure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.booking) {
        // Create in global context state as well
        const created = createBooking({
          customerId: data.booking.customerId || "cust_001",
          customerName: data.booking.customerName,
          customerPhone: data.booking.customerPhone,
          customerEmail: data.booking.customerEmail,
          customerAddress: data.booking.customerAddress,
          city: data.booking.city,
          areaPincode: data.booking.areaPincode,
          mapLocation: data.booking.mapLocation,
          serviceType: data.booking.serviceType,
          category: data.booking.category,
          problemDescription: data.booking.problemDescription,
          urgency,
          preferredDate: data.booking.preferredDate,
          preferredTime: data.booking.preferredTime,
          estimatedPrice: data.booking.estimatedPrice,
          finalAmount: data.booking.finalAmount,
          paymentStatus: data.booking.paymentStatus,
          paymentMethod: data.booking.paymentMethod,
          paymentDetails: data.booking.paymentDetails,
          mediaUrls: data.booking.mediaUrls,
          agreedTerms: true,
        });

        setShowRazorpayModal(false);
        showToast(data.message);
        onSuccessBooking(created.id);
      } else {
        setPaymentError(data.message || "Booking creation rejected by server validation.");
        showToast("Booking submission failed. Please check required fields.");
      }
    } catch (err) {
      setPaymentError("Server connection error while saving booking.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Book {category.name} Service
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified local technician doorstep matching in {city}
            </p>
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <div className="flex items-center justify-between mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 ${step >= 1 ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-400"}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isStep1Valid ? "bg-emerald-600 text-white" : "bg-blue-100 dark:bg-blue-950 text-blue-600"}`}>
              {isStep1Valid ? "✓" : "1"}
            </span>
            <span>Issue & Category</span>
          </button>
          <div className="h-0.5 flex-1 mx-2 bg-slate-200 dark:bg-slate-800" />
          <button
            type="button"
            onClick={() => isStep1Valid && setStep(2)}
            className={`flex items-center gap-1.5 ${step >= 2 ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-400"}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isStep2Valid ? "bg-emerald-600 text-white" : "bg-blue-100 dark:bg-blue-950 text-blue-600"}`}>
              {isStep2Valid ? "✓" : "2"}
            </span>
            <span>Customer & Location</span>
          </button>
          <div className="h-0.5 flex-1 mx-2 bg-slate-200 dark:bg-slate-800" />
          <button
            type="button"
            onClick={() => isStep1Valid && isStep2Valid && setStep(3)}
            className={`flex items-center gap-1.5 ${step >= 3 ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-400"}`}
          >
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>Payment & Submit</span>
          </button>
        </div>

        {/* STEP 1: SERVICE TYPE & PROBLEM DESCRIPTION */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Service Category (Pre-selected) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Selected Category <span className="text-red-500">*</span>
              </label>
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{category.name}</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">Starts @ ₹{category.startingPrice}</span>
              </div>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Specific Service Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  "Full Inspection & Servicing",
                  "Repair & Part Replacement",
                  "Emergency Fault Diagnostic",
                  "Deep Clean & Maintenance",
                  "Uninstallation & Re-fitting"
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setServiceType(st);
                      markTouched("serviceType");
                    }}
                    className={`p-3 rounded-xl border text-left font-medium transition-all ${
                      serviceType === st
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              {!isServiceTypeValid && touched.serviceType && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please select a specific service type.</span>
                </p>
              )}
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="E.g., AC unit is humming loudly, outdoor fan not rotating, blowing lukewarm air..."
                value={problemDescription}
                onChange={(e) => {
                  setProblemDescription(e.target.value);
                  markTouched("problemDescription");
                }}
                className={`w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-2xl focus:ring-2 focus:ring-blue-500/40 text-slate-900 dark:text-white ${
                  !isProblemDescValid && touched.problemDescription ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
              />
              {!isProblemDescValid && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please describe the problem (at least 8 characters).</span>
                </p>
              )}
            </div>

            {/* AI Price Estimator trigger */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-800/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    AI Price Estimator
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleFetchAiEstimate}
                  disabled={aiEstimating || !problemDescription.trim()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
                >
                  {aiEstimating ? "Calculating..." : "Get AI Price Estimate"}
                </button>
              </div>

              {aiEstimate ? (
                <div className="mt-3 pt-3 border-t border-blue-200/60 dark:border-blue-800/60 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                    <span>Estimated Labor & Inspection:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                      ₹{aiEstimate.minPrice} - ₹{aiEstimate.maxPrice}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    💡 {aiEstimate.advice}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click above to get an instant AI-calculated market price quote in {city}.
                </p>
              )}
            </div>

            {/* Photo / Video upload (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Upload Photos / Videos (Optional)
              </label>
              <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Attach photos of damaged component or appliance model
                </span>
                <input type="file" multiple onChange={handleFileUpload} className="hidden" />
              </label>
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedFiles.map((fn, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1">
                      📎 {fn}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={!isStep1Valid}
              onClick={() => {
                if (!isStep1Valid) {
                  showToast("Please complete problem description and service type.");
                  return;
                }
                setStep(2);
              }}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Next: Customer Details & Map Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: MANDATORY CUSTOMER DETAILS, OTP, ADDRESS & MAP LOCATION */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Priya Sundaram"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  markTouched("customerName");
                }}
                className={`w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white ${
                  !isNameValid && touched.customerName ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
              />
              {!isNameValid && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please enter your full name.</span>
                </p>
              )}
            </div>

            {/* Mobile Number with OTP Verification */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (OTP Verification Required) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">+91</span>
                  <input
                    type="tel"
                    placeholder="9820011223"
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-12 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                {!isOtpVerified ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isOtpSending}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shrink-0"
                  >
                    {isOtpSending ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <span className="px-3 py-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>OTP Verified</span>
                  </span>
                )}
              </div>

              {/* OTP Enter Box if sent & not verified */}
              {!isOtpVerified && isOtpSent && (
                <div className="mt-2.5 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP (Test OTP: 4829)"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-amber-300 rounded-lg font-mono text-center text-sm font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {!isPhoneValid && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please enter a valid 10-digit mobile number and verify via OTP.</span>
                </p>
              )}
            </div>

            {/* Complete Address & City & Area Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}, {c.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Area / Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="E.g., Bandra West / 400050"
                  value={areaPincode}
                  onChange={(e) => {
                    setAreaPincode(e.target.value);
                    markTouched("areaPincode");
                  }}
                  className={`w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-slate-900 dark:text-white ${
                    !isPincodeValid && touched.areaPincode ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  }`}
                />
                {!isPincodeValid && (
                  <p className="text-[11px] text-red-500 mt-1">Please enter area name or 6-digit pincode.</p>
                )}
              </div>
            </div>

            {/* Doorstep Address */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Complete Doorstep Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Building Name, Flat/House No, Floor, Street Landmark..."
                value={customerAddress}
                onChange={(e) => {
                  setCustomerAddress(e.target.value);
                  markTouched("customerAddress");
                }}
                className={`w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white ${
                  !isAddressValid && touched.customerAddress ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
              />
              {!isAddressValid && (
                <p className="text-[11px] text-red-500 mt-1">Please enter your complete doorstep address.</p>
              )}
            </div>

            {/* Google Map Location */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Google Map Location <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPSLocation}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Pinpoint GPS Location</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {mapLocation?.addressString || "No map location selected."}
                </span>
              </div>
              {!isMapLocationValid && (
                <p className="text-[11px] text-red-500 mt-1">Please set your Google Map location.</p>
              )}
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Immediate Slot (Within 30 Mins)">Immediate Slot (Within 30 Mins)</option>
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!isStep2Valid}
                onClick={() => {
                  if (!isStep2Valid) {
                    showToast("Please complete all mandatory fields & verify phone via OTP.");
                    return;
                  }
                  setStep(3);
                }}
                className="w-2/3 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: Review & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW, PAYMENT & TERMS */}
        {step === 3 && (
          <div className="space-y-5 text-xs">
            {/* Payment error notification */}
            {paymentError && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Payment or Verification Error</h4>
                  <p className="mt-0.5">{paymentError}</p>
                </div>
              </div>
            )}

            {/* Order Summary Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm pb-2 border-b border-slate-200 dark:border-slate-700">
                <span>{category.name} ({serviceType})</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount Applied</span>
                  <span className="font-mono">-₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 pt-1">
                <span>GST (18% Included)</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-blue-600 dark:text-blue-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount Payable</span>
                <span className="font-mono">₹{finalPrice}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Apply Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FIRST100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Select Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(["UPI", "Razorpay", "Credit Card", "Debit Card", "Net Banking", "Cash After Service"] as const).map(
                  (method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-center font-medium transition-all ${
                        paymentMethod === method
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {method}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  I agree to the <b>Terms & Conditions</b>, Doorstep Cancellation Policy, and confirm that all address & issue details provided above are accurate.
                </span>
              </label>
              {!isTermsValid && (
                <p className="text-[11px] text-red-500 mt-1">You must accept the Terms & Conditions.</p>
              )}
            </div>

            {/* Validation Checklist if Form Incomplete */}
            {!isFormValid && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                <span className="font-bold block">Incomplete Required Fields:</span>
                {!isNameValid && <div>• Customer Full Name</div>}
                {!isPhoneValid && <div>• Mobile Phone & OTP Verification</div>}
                {!isAddressValid && <div>• Complete Doorstep Address</div>}
                {!isPincodeValid && <div>• Area / Pincode</div>}
                {!isMapLocationValid && <div>• Google Map Location</div>}
                {!isProblemDescValid && <div>• Problem Description</div>}
                {!isTermsValid && <div>• Accept Terms & Conditions</div>}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!isFormValid || isSubmittingBooking}
                onClick={handleSubmitBookingFlow}
                className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {isSubmittingBooking
                    ? "Processing..."
                    : paymentMethod === "Cash After Service"
                    ? "Confirm Booking (Cash on Service)"
                    : `Pay ₹${finalPrice} & Confirm`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Razorpay Gateway Modal */}
        {showRazorpayModal && razorpayOrder && (
          <RazorpayModal
            orderData={{
              orderId: razorpayOrder.orderId,
              amount: razorpayOrder.amount,
              currency: razorpayOrder.currency,
              merchantName: razorpayOrder.merchantName,
              description: razorpayOrder.description,
              customer: {
                name: customerName,
                phone: customerPhone,
              },
            }}
            onSuccess={(paymentDetails) => {
              createSecureBookingOnServer(paymentDetails);
            }}
            onFailure={(errMsg) => {
              setShowRazorpayModal(false);
              setPaymentError(errMsg);
              showToast(errMsg);
            }}
            onClose={() => {
              setShowRazorpayModal(false);
              setPaymentError("Payment was cancelled. Booking was not submitted.");
            }}
          />
        )}
      </div>
    </div>
  );
};
