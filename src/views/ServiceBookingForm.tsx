import React, { useState } from "react";
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
  Tag,
  CreditCard,
  Phone,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { ServiceCategory } from "../types";

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
  const { selectedCity, currentUser, createBooking, coupons, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [problemDescription, setProblemDescription] = useState("");
  const [urgency, setUrgency] = useState<"standard" | "today" | "emergency">("today");
  const [preferredDate, setPreferredDate] = useState<string>("2026-07-22");
  const [preferredTime, setPreferredTime] = useState<string>("02:00 PM - 04:00 PM");
  const [customerName, setCustomerName] = useState(currentUser?.name || "Priya Sundaram");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "+91 98200 11223");
  const [customerAddress, setCustomerAddress] = useState("Flat 402, Sea Breeze Heights, Bandra West");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"Razorpay" | "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Cash After Service">("UPI");

  const basePrice = category.startingPrice;
  const subtotal = Math.max(199, aiEstimate ? aiEstimate.minPrice : basePrice);
  const finalPrice = Math.max(0, subtotal - appliedDiscount);

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
          city: selectedCity,
        }),
      });
      const data = await res.json();
      setAiEstimate({
        minPrice: data.estimatedMin || basePrice,
        maxPrice: data.estimatedMax || basePrice + 300,
        advice: data.aiAdvice || "Transparent upfront pricing guaranteed.",
      });
      showToast("AI Price Estimate generated!");
    } catch (e) {
      setAiEstimate({
        minPrice: basePrice,
        maxPrice: basePrice + 250,
        advice: "Technician will diagnose the issue on-site before commencing repair.",
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

  const handleConfirmBooking = () => {
    if (!problemDescription.trim()) {
      showToast("Please describe the problem.");
      return;
    }
    if (!customerAddress.trim()) {
      showToast("Please provide service address.");
      return;
    }

    const created = createBooking({
      customerId: currentUser?.id || "cust_001",
      customerName,
      customerPhone,
      customerEmail: currentUser?.email || "customer@servipulse.com",
      customerAddress: `${customerAddress}, ${selectedCity}`,
      city: selectedCity,
      category: category.name,
      problemDescription,
      urgency,
      preferredDate,
      preferredTime,
      estimatedPrice: subtotal,
      finalAmount: finalPrice,
      paymentStatus: paymentMethod === "Cash After Service" ? "pending" : "paid",
      paymentMethod,
      mediaUrls: uploadedFiles,
    });

    onSuccessBooking(created.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Book {category.name} Service
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instant AI technician matching in {selectedCity}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold">1</span>
            <span>Describe Problem</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold">2</span>
            <span>Schedule & Location</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold">3</span>
            <span>Payment & Confirm</span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Describe the Issue or Service Request
              </label>
              <textarea
                rows={3}
                placeholder="E.g., AC outdoor unit making heavy noise and not blowing cold air since yesterday..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/40 text-slate-900 dark:text-white"
              />
            </div>

            {/* AI Estimator trigger card */}
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
                  disabled={aiEstimating}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
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
                  Click above to get an instant AI-calculated transparent price quote based on current market rates in {selectedCity}.
                </p>
              )}
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setUrgency("standard")}
                  className={`p-3 rounded-2xl border text-center font-medium transition-all ${
                    urgency === "standard"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Regular Slot
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency("today")}
                  className={`p-3 rounded-2xl border text-center font-medium transition-all ${
                    urgency === "today"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Same Day (2 Hrs)
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency("emergency")}
                  className={`p-3 rounded-2xl border text-center font-medium transition-all ${
                    urgency === "emergency"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  ⚡ Emergency 15-Min
                </button>
              </div>
            </div>

            {/* Photo / Video upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Upload Photos / Videos (Optional)
              </label>
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Click to upload damaged part photos
                </span>
                <input type="file" multiple onChange={handleFileUpload} className="hidden" />
              </label>
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadedFiles.map((fn, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                      📎 {fn}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (!problemDescription) {
                  showToast("Please enter a brief problem description.");
                  return;
                }
                setStep(2);
              }}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Next: Schedule & Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Service Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Immediate Slot">Immediate Slot (Within 30 Mins)</option>
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Doorstep Service Address ({selectedCity})
              </label>
              <textarea
                rows={2}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: Review & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Order Summary Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm pb-2 border-b border-slate-200 dark:border-slate-700">
                <span>{category.name} Inspection & Labor</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount Applied</span>
                  <span className="font-mono">-₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 pt-1">
                <span>GST (Integrated 18%)</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-blue-600 dark:text-blue-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount Payable</span>
                <span className="font-mono">₹{finalPrice}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Apply Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FIRST100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase font-mono"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
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

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                30-Day Doorstep Service Warranty & Verified Technician Guarantee
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Pay ₹{finalPrice}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
