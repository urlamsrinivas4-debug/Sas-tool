import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Zap,
  Search,
  Sparkles,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  Phone,
  MessageSquare,
  Award,
  CheckCircle2,
  Wind,
  Droplet,
  Hammer,
  Paintbrush,
  GlassWater,
  Video,
  Refrigerator,
  Shirt,
  Tv,
  Laptop,
  Monitor,
  Smartphone,
  Bug,
  Globe,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { ServiceCategory } from "../types";
import { ServiceBookingForm } from "./ServiceBookingForm";
import { LiveBookingTracker } from "./LiveBookingTracker";

// Icon resolver map
const ICON_MAP: Record<string, React.ReactNode> = {
  Wind: <Wind className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Droplet: <Droplet className="w-6 h-6" />,
  Hammer: <Hammer className="w-6 h-6" />,
  Paintbrush: <Paintbrush className="w-6 h-6" />,
  GlassWater: <GlassWater className="w-6 h-6" />,
  Video: <Video className="w-6 h-6" />,
  Refrigerator: <Refrigerator className="w-6 h-6" />,
  Shirt: <Shirt className="w-6 h-6" />,
  Tv: <Tv className="w-6 h-6" />,
  Laptop: <Laptop className="w-6 h-6" />,
  Monitor: <Monitor className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Bug: <Bug className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
};

export const CustomerHome: React.FC = () => {
  const {
    categories,
    selectedCity,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    bookings,
    technicians,
    setIsAIChatOpen,
    activeTrackingBooking,
    setActiveTrackingBooking
  } = useApp();

  const [bookingCategory, setBookingCategory] = useState<ServiceCategory | null>(null);

  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Customer active booking check
  const activeCustomerBooking = bookings.find(
    (b) => ["pending", "accepted", "in_transit", "in_progress"].includes(b.status)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Active Live Booking Banner if present */}
      {activeCustomerBooking && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white py-3 px-4 shadow-lg sticky top-16 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold">
                Active Order #{activeCustomerBooking.bookingNumber} in Progress!
              </span>
              <span className="hidden sm:inline text-blue-100">
                ({activeCustomerBooking.category} - {activeCustomerBooking.status.replace("_", " ").toUpperCase()})
              </span>
            </div>
            <button
              onClick={() => setActiveTrackingBooking(activeCustomerBooking)}
              className="px-3 py-1 bg-white text-blue-700 font-bold rounded-lg text-xs hover:bg-blue-50 transition-colors shadow-sm"
            >
              Track Technician
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span>AI-Powered Service Marketplace</span>
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">
              {selectedCity}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Doorstep Services by <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Verified Local Technicians
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Book certified experts for AC Repair, Electrical, Plumbing, Cleaning, Appliance Fixes & Tech Support. 15-minute emergency arrival & 30-day warranty.
          </p>

          {/* Hero Search Box */}
          <div className="max-w-2xl mx-auto bg-white/10 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/20 dark:border-slate-800 flex items-center gap-2 shadow-2xl">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              placeholder="Search services (e.g. AC Repair, Plumber, Laptop Fix)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:outline-none text-sm px-2"
            />
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>AI Price Quote</span>
            </button>
          </div>

          {/* Quick Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Trending:</span>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setBookingCategory(cat)}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Explore All Service Categories
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Transparent starting rates in {selectedCity} with 100% price guarantee
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              17 Verified Services
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setBookingCategory(cat)}
                className="group relative bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 hover:border-blue-500/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                {cat.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded">
                    {cat.badge}
                  </span>
                )}

                <div>
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    {ICON_MAP[cat.iconName] || <Zap className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 text-[10px]">Starts @</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                    ₹{cat.startingPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Technicians in City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <span>Top-Rated Verified Technicians in {selectedCity}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              100% background checked with police verification & active membership
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {tech.name}
                    </h3>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {tech.category}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] rounded uppercase">
                  KYC Verified
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{tech.rating}</span>
                  <span className="text-slate-400 text-[10px]">({tech.reviewCount} reviews)</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  {tech.jobsCompleted}+ Jobs Done
                </div>
              </div>

              <button
                onClick={() => {
                  const cat = categories.find((c) => c.name === tech.category) || categories[0];
                  setBookingCategory(cat);
                }}
                className="w-full mt-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors"
              >
                Book {tech.category}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black">How ServiPulse Works</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Seamless doorstep repair & maintenance in 3 quick steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl mx-auto shadow-lg shadow-blue-500/30">
                1
              </div>
              <h3 className="font-bold text-base">Select & Describe</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose service category, describe issue, and get instant AI price quotes.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl mx-auto shadow-lg shadow-indigo-500/30">
                2
              </div>
              <h3 className="font-bold text-base">AI Lead Match & Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform broadcasts request to nearest verified technicians with ratings above 4.7⭐.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl mx-auto shadow-lg shadow-emerald-500/30">
                3
              </div>
              <h3 className="font-bold text-base">Doorstep Fix & 30-Day Warranty</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track technician on live map, verify OTP on arrival, pay securely & download tax invoice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {bookingCategory && (
        <ServiceBookingForm
          category={bookingCategory}
          onClose={() => setBookingCategory(null)}
          onSuccessBooking={(bookingId) => {
            setBookingCategory(null);
            const newlyCreated = bookings.find((b) => b.id === bookingId);
            if (newlyCreated) {
              setActiveTrackingBooking(newlyCreated);
            }
          }}
        />
      )}

      {/* Active Tracking Modal */}
      {activeTrackingBooking && (
        <LiveBookingTracker
          booking={activeTrackingBooking}
          onClose={() => setActiveTrackingBooking(null)}
        />
      )}
    </div>
  );
};
