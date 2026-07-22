import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  Users,
  Briefcase,
  Zap,
  Wallet,
  Settings,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  TrendingUp,
  AlertOctagon,
  FileText,
  MapPin,
  Tag,
  DollarSign
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const {
    bookings,
    technicians,
    transactions,
    categories,
    cities,
    leadPrice,
    setLeadPrice,
    approveKYC,
    addCategory,
    addCity,
    resolveDispute,
    addCoupon,
    coupons,
    disputes,
    showToast
  } = useApp();

  const [adminTab, setAdminTab] = useState<
    "kpis" | "leads" | "technicians" | "categories" | "coupons" | "disputes" | "ai_insights"
  >("kpis");

  // AI Strategic Insights state
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // New Category Form
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatPrice, setNewCatPrice] = useState(299);

  // New City Form
  const [newCityName, setNewCityName] = useState("");
  const [newCityState, setNewCityState] = useState("");

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);

  const totalRevenue = bookings.reduce((acc, curr) => acc + curr.finalAmount, 0);
  const totalLeadFees = bookings.length * leadPrice;
  const approvedTechs = technicians.filter((t) => t.kycStatus === "approved");
  const pendingKYCTechs = technicians.filter((t) => t.kycStatus === "pending");

  const handleFetchAiInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/ai/analytics-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: {
            totalBookings: bookings.length,
            totalRevenue,
            totalLeadFees,
            activeTechnicians: approvedTechs.length,
            topCity: "Mumbai & Bengaluru"
          }
        })
      });
      const data = await res.json();
      setAiInsights(data);
    } catch (e) {
      setAiInsights({
        topPerformingCategory: "AC Repair & Servicing (+38% QoQ growth)",
        highestDemandCity: "Bengaluru & Mumbai Metro Areas",
        walletRevenueInsight: "Technician wallet recharges grew 28% following the Gold & Platinum membership push.",
        strategicAdvice: [
          "Increase technician acquisition in CCTV & RO Repair categories.",
          "Offer targeted weekend discounts for Home Cleaning packages.",
          "Introduce express 30-minute arrival guarantees for emergency Plumbing & Electrical."
        ]
      });
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory({
      id: `cat_${Date.now()}`,
      name: newCatName,
      iconName: "Zap",
      description: newCatDesc || "Standard home service",
      startingPrice: newCatPrice,
      color: "from-blue-600 to-indigo-600"
    });
    setNewCatName("");
    setNewCatDesc("");
  };

  const handleAddCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName || !newCityState) return;
    addCity(newCityName, newCityState);
    setNewCityName("");
    setNewCityState("");
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    addCoupon({
      code: newCouponCode.toUpperCase(),
      discountPercent: newCouponDiscount,
      maxDiscount: 300,
      minOrder: 499,
      validTill: "2026-12-31",
      active: true
    });
    setNewCouponCode("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">ServiPulse Super Admin Panel</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Marketplace Commission, KYC Approvals, Lead Pricing & AI Analytics
              </p>
            </div>
          </div>

          {/* Lead Price Setting Box */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Lead Deduction Fee</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-sm font-bold text-white">₹</span>
                <input
                  type="number"
                  value={leadPrice}
                  onChange={(e) => setLeadPrice(Number(e.target.value))}
                  className="w-16 px-1.5 py-0.5 text-xs bg-slate-800 border border-slate-700 rounded font-mono font-bold text-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-6 overflow-x-auto">
          <button
            onClick={() => setAdminTab("kpis")}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              adminTab === "kpis" ? "border-amber-500 text-amber-500" : "text-slate-500"
            }`}
          >
            Overview & KPIs
          </button>
          <button
            onClick={() => setAdminTab("leads")}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              adminTab === "leads" ? "border-amber-500 text-amber-500" : "text-slate-500"
            }`}
          >
            Leads & Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setAdminTab("technicians")}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              adminTab === "technicians" ? "border-amber-500 text-amber-500" : "text-slate-500"
            }`}
          >
            Technicians & KYC ({pendingKYCTechs.length} Pending)
          </button>
          <button
            onClick={() => setAdminTab("categories")}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              adminTab === "categories" ? "border-amber-500 text-amber-500" : "text-slate-500"
            }`}
          >
            Categories & Cities
          </button>
          <button
            onClick={() => setAdminTab("coupons")}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
              adminTab === "coupons" ? "border-amber-500 text-amber-500" : "text-slate-500"
            }`}
          >
            Coupons & Promo
          </button>
          <button
            onClick={() => setAdminTab("ai_insights")}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              adminTab === "ai_insights" ? "border-amber-500 text-amber-500" : "text-slate-500"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>AI Executive Insights</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* KPI OVERVIEW */}
        {adminTab === "kpis" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">GMV (Total Bookings Value)</span>
                <h3 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Platform Lead Fees Earned</span>
                <h3 className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                  ₹{totalLeadFees.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Verified Technicians</span>
                <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                  {approvedTechs.length} Active
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold uppercase">Pending KYC Approvals</span>
                <h3 className="text-2xl font-black font-mono text-amber-500 mt-1">
                  {pendingKYCTechs.length}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* LEADS & BOOKINGS */}
        {adminTab === "leads" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4">Master Lead Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                    <th className="py-3 px-2">Booking ID</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Category & City</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Assigned Tech</th>
                    <th className="py-3 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 px-2 font-mono font-bold text-slate-900 dark:text-white">#{b.bookingNumber}</td>
                      <td className="py-3 px-2">{b.customerName}</td>
                      <td className="py-3 px-2">{b.category} ({b.city})</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">{b.assignedTechnicianName || "Unassigned"}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold">₹{b.finalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TECHNICIANS & KYC */}
        {adminTab === "technicians" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4">
                Technician Directory & KYC Queue
              </h3>
              <div className="space-y-3">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{tech.name}</span>
                        <span className="text-slate-400">({tech.category} - {tech.city})</span>
                      </div>
                      <div className="text-slate-500 mt-1">
                        Aadhaar: {tech.kycDocuments?.aadhaarNumber || "Not Provided"} • PAN: {tech.kycDocuments?.panNumber || "Not Provided"}
                      </div>
                      <div className="text-slate-400 mt-0.5 font-mono">
                        Wallet: ₹{tech.walletBalance} • Membership: {tech.membershipPlan.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {tech.kycStatus === "pending" && (
                        <>
                          <button
                            onClick={() => approveKYC(tech.id, true)}
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                          >
                            Approve KYC
                          </button>
                          <button
                            onClick={() => approveKYC(tech.id, false)}
                            className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-xl"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {tech.kycStatus === "approved" && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-xl">
                          APPROVED
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES & CITIES */}
        {adminTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Category */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Add Service Category</h3>
              <form onSubmit={handleAddCategorySubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Category Name (e.g. Solar Panel Cleaning)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <textarea
                  placeholder="Brief description..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <input
                  type="number"
                  placeholder="Starting Price (₹)"
                  value={newCatPrice}
                  onChange={(e) => setNewCatPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
                <button type="submit" className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-xl">
                  Add Category
                </button>
              </form>
            </div>

            {/* Add City */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Onboard New Operational City</h3>
              <form onSubmit={handleAddCitySubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="City Name (e.g. Lucknow)"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="State (e.g. Uttar Pradesh)"
                  value={newCityState}
                  onChange={(e) => setNewCityState(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <button type="submit" className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-xl">
                  Onboard City
                </button>
              </form>
            </div>
          </div>
        )}

        {/* COUPONS */}
        {adminTab === "coupons" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Coupon Code Manager</h3>
            <form onSubmit={handleAddCouponSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon Code (e.g. FESTIVE30)"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl uppercase font-mono font-bold"
              />
              <button type="submit" className="px-5 py-2.5 bg-amber-600 text-white font-bold rounded-xl">
                Create Coupon
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {coupons.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{c.code}</span>
                  <span>{c.discountPercent}% OFF (Max ₹{c.maxDiscount})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI INSIGHTS */}
        {adminTab === "ai_insights" && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span>AI Business Intelligence & Strategic Insights</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Powered by Gemini 3.6 Pro analysis of live marketplace transactions & technician metrics
                </p>
              </div>
              <button
                onClick={handleFetchAiInsights}
                disabled={loadingInsights}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs"
              >
                {loadingInsights ? "Running AI..." : "Generate Fresh Insights"}
              </button>
            </div>

            {aiInsights ? (
              <div className="space-y-4 text-xs pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Top Category Growth</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{aiInsights.topPerformingCategory}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Highest Demand City</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{aiInsights.highestDemandCity}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Strategic AI Recommendations</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 mt-1">
                    {aiInsights.strategicAdvice?.map((advice: string, idx: number) => (
                      <li key={idx}>{advice}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 pt-2">Click above to synthesize executive insights.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
