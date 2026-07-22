import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Wallet,
  Zap,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  Award,
  AlertTriangle,
  Upload,
  ArrowUpRight,
  Sparkles,
  Navigation,
  DollarSign,
  TrendingUp,
  FileText,
  UserCheck
} from "lucide-react";
import { MembershipPlanType } from "../types";

export const TechnicianDashboard: React.FC = () => {
  const {
    activeTechnician,
    bookings,
    transactions,
    membershipPlans,
    leadPrice,
    acceptLead,
    updateBookingStatus,
    rechargeWallet,
    upgradeMembership,
    submitKYC,
    toggleTechnicianAvailability,
    showToast,
    setActiveBookingForInvoice
  } = useApp();

  const [activeTab, setActiveTab] = useState<"leads" | "wallet" | "membership" | "kyc" | "earnings">("leads");

  // Recharge Modal State
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(1000);
  const [rechargePaymentMethod, setRechargePaymentMethod] = useState("UPI / Razorpay");

  // KYC Form State
  const [aadhaarNum, setAadhaarNum] = useState(activeTechnician?.kycDocuments?.aadhaarNumber || "");
  const [panNum, setPanNum] = useState(activeTechnician?.kycDocuments?.panNumber || "");

  if (!activeTechnician) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Please log in as a Technician Partner.</p>
        </div>
      </div>
    );
  }

  const pendingLeads = bookings.filter((b) => b.status === "pending" && b.category === activeTechnician.category);
  const myAcceptedJobs = bookings.filter((b) => b.assignedTechnicianId === activeTechnician.id);
  const activeJob = myAcceptedJobs.find((b) => ["accepted", "in_transit", "in_progress"].includes(b.status));

  const totalEarnings = myAcceptedJobs
    .filter((b) => b.status === "completed")
    .reduce((acc, curr) => acc + curr.finalAmount, 0);

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rechargeAmount < 100) {
      showToast("Minimum recharge amount is ₹100.");
      return;
    }
    rechargeWallet(activeTechnician.id, rechargeAmount, rechargePaymentMethod);
    setIsRechargeModalOpen(false);
  };

  const handleKYCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarNum || !panNum) {
      showToast("Please enter both Aadhaar and PAN numbers.");
      return;
    }
    submitKYC(activeTechnician.id, {
      aadhaarNumber: aadhaarNum,
      panNumber: panNum,
      photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Top Header Banner */}
      <div className="bg-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              {activeTechnician.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{activeTechnician.name}</h1>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    activeTechnician.kycStatus === "approved"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  KYC {activeTechnician.kycStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Primary Category: <b className="text-blue-400">{activeTechnician.category}</b> • City: {activeTechnician.city}
              </p>
            </div>
          </div>

          {/* Controls: Duty Toggle & Wallet Balance */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Availability Switch */}
            <button
              onClick={() => toggleTechnicianAvailability(activeTechnician.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                activeTechnician.isAvailable
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${activeTechnician.isAvailable ? "bg-white animate-pulse" : "bg-slate-500"}`} />
              <span>{activeTechnician.isAvailable ? "ONLINE (Receiving Leads)" : "OFFLINE"}</span>
            </button>

            {/* Wallet Box */}
            <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-2 rounded-xl flex items-center gap-3">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Wallet Balance</span>
                <span className="font-mono text-base font-bold text-white">
                  ₹{activeTechnician.walletBalance.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={() => setIsRechargeModalOpen(true)}
                className="ml-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-lg text-xs"
              >
                + Recharge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zero Wallet Warning Alert */}
      {activeTechnician.walletBalance < leadPrice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="bg-red-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <AlertTriangle className="w-6 h-6 shrink-0 animate-bounce" />
              <div>
                <p className="font-bold">Wallet Balance Low! (Minimum required: ₹{leadPrice})</p>
                <p className="text-red-100 mt-0.5">
                  You cannot accept incoming leads until your wallet is recharged. Standard deduction per accepted lead is ₹{leadPrice}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRechargeModalOpen(true)}
              className="px-4 py-2 bg-white text-red-700 font-extrabold rounded-xl text-xs hover:bg-red-50 shrink-0 shadow-sm"
            >
              Recharge Now
            </button>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6">
          <button
            onClick={() => setActiveTab("leads")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "leads"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Lead Board ({pendingLeads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "wallet"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet & Transactions</span>
          </button>
          <button
            onClick={() => setActiveTab("membership")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "membership"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Membership Plans</span>
          </button>
          <button
            onClick={() => setActiveTab("kyc")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "kyc"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>KYC Status</span>
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "earnings"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Earnings Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Active Job Tracker for Technician */}
        {activeJob && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl shadow-xl border border-blue-800">
            <div className="flex items-center justify-between pb-4 border-b border-blue-800/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Active Doorstep Job</span>
                <span className="font-mono text-xs text-blue-200">#{activeJob.bookingNumber}</span>
              </div>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-300 font-bold text-xs rounded-lg uppercase">
                {activeJob.status.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <h3 className="text-lg font-black text-white">{activeJob.customerName}</h3>
                <p className="text-slate-300 mt-1">{activeJob.customerAddress}</p>
                <div className="p-3 bg-slate-800/80 rounded-xl mt-3 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Description:</span>
                  <p className="text-slate-200 font-medium mt-0.5">{activeJob.problemDescription}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span>Customer Phone: <b>{activeJob.customerPhone}</b></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Calling customer ${activeJob.customerPhone}...`)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showToast(`Opening WhatsApp chat with customer...`)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">Total Customer Payable:</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">₹{activeJob.finalAmount}</span>
                </div>

                {/* Progress Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  {activeJob.status === "accepted" && (
                    <button
                      onClick={() => updateBookingStatus(activeJob.id, "in_transit")}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-xl"
                    >
                      Start Navigation (In Transit)
                    </button>
                  )}
                  {activeJob.status === "in_transit" && (
                    <button
                      onClick={() => updateBookingStatus(activeJob.id, "in_progress")}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 font-bold text-white rounded-xl"
                    >
                      Arrived at Doorstep (In Progress)
                    </button>
                  )}
                  {activeJob.status === "in_progress" && (
                    <button
                      onClick={() => updateBookingStatus(activeJob.id, "completed")}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-white rounded-xl"
                    >
                      Mark Job as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: LEADS BOARD */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Incoming Leads for {activeTechnician.category}
                </h2>
                <p className="text-xs text-slate-500">
                  Standard platform fee ₹{leadPrice} deducted from wallet upon lead acceptance.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                Auto-refreshed 2 mins ago
              </span>
            </div>

            {pendingLeads.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
                <Zap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Pending Leads Right Now</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Keep your availability status ONLINE. New requests in {activeTechnician.city} will pop up automatically!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {lead.category} Lead
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-[10px] rounded">
                        AI Match: 96%
                      </span>
                    </div>

                    <div className="space-y-2 text-xs mb-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Customer: {lead.customerName} ({lead.city})
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                        "{lead.problemDescription}"
                      </p>
                      <div className="flex items-center justify-between text-slate-500 pt-1">
                        <span>Preferred Slot: {lead.preferredTime}</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          Est. Earning: ₹{lead.estimatedPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400">
                        Lead Fee: <b>₹{leadPrice}</b>
                      </span>
                      <button
                        onClick={() => {
                          const result = acceptLead(lead.id, activeTechnician.id);
                          if (!result.success && activeTechnician.walletBalance < leadPrice) {
                            setIsRechargeModalOpen(true);
                          }
                        }}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                      >
                        Accept Lead (-₹{leadPrice})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WALLET & TRANSACTIONS */}
        {activeTab === "wallet" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Wallet Balance</span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  ₹{activeTechnician.walletBalance.toLocaleString("en-IN")}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Each accepted lead automatically deducts ₹{leadPrice} from wallet.
                </p>
              </div>
              <button
                onClick={() => setIsRechargeModalOpen(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-600/20"
              >
                + Recharge Wallet Now
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">
                Wallet Audit & Transaction Log
              </h3>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{tx.description}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Ref: {tx.referenceId} • {new Date(tx.date).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                    <span
                      className={`font-mono font-extrabold text-sm ${
                        tx.amount > 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEMBERSHIP PLANS */}
        {activeTab === "membership" && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Technician Membership Plans</h2>
              <p className="text-xs text-slate-500 mt-1">
                Purchase membership plans for priority lead access, discounted lead charges, and higher monthly earnings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {membershipPlans.map((plan) => {
                const isCurrent = activeTechnician.membershipPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                      isCurrent
                        ? "bg-slate-900 text-white border-blue-500 shadow-xl ring-2 ring-blue-500/50"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {plan.badgeText}
                      </span>
                      <h3 className="text-lg font-black mt-2">{plan.name}</h3>
                      <div className="my-4 font-mono">
                        <span className="text-2xl font-black">₹{plan.price.toLocaleString("en-IN")}</span>
                        <span className="text-xs text-slate-400"> / {plan.durationDays} days</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => upgradeMembership(activeTechnician.id, plan.id as MembershipPlanType)}
                      disabled={isCurrent}
                      className={`w-full py-3 rounded-2xl font-bold text-xs transition-colors ${
                        isCurrent
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      }`}
                    >
                      {isCurrent ? "Active Current Plan" : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: KYC STATUS */}
        {activeTab === "kyc" && (
          <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">KYC Verification Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mandatory government ID verification for lead dispatching</p>
              </div>
              <span
                className={`px-3 py-1 font-bold text-xs rounded-xl uppercase ${
                  activeTechnician.kycStatus === "approved"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {activeTechnician.kycStatus}
              </span>
            </div>

            <form onSubmit={handleKYCSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  12-Digit Aadhaar Card Number
                </label>
                <input
                  type="text"
                  placeholder="XXXX-XXXX-4812"
                  value={aadhaarNum}
                  onChange={(e) => setAadhaarNum(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  10-Character PAN Card Number
                </label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={panNum}
                  onChange={(e) => setPanNum(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skill Certificate or ITI Diploma (Optional)
                </label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">Upload Photo of Certificate</span>
                  <input type="file" className="hidden" />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md"
              >
                Submit KYC Documents for Approval
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: EARNINGS ANALYTICS */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Lifetime Revenue</span>
                <h3 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  ₹{totalEarnings.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Jobs Completed</span>
                <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                  {activeTechnician.jobsCompleted}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Average Customer Rating</span>
                <h3 className="text-2xl font-black font-mono text-amber-500 mt-1">
                  ⭐ {activeTechnician.rating} / 5.0
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wallet Recharge Modal */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setIsRechargeModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
              Recharge Technician Wallet
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add funds to accept customer leads automatically at ₹{leadPrice}/lead.
            </p>

            <form onSubmit={handleRechargeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Quick Recharge Amount
                </label>
                <div className="grid grid-cols-3 gap-2 font-mono font-bold">
                  {[500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt)}
                      className={`p-2.5 rounded-xl border text-center ${
                        rechargeAmount === amt
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Amount (₹)
                </label>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md text-xs"
              >
                Proceed to Pay ₹{rechargeAmount}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
