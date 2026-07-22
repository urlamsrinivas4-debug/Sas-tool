import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  MapPin,
  Search,
  User,
  Wallet,
  Bot,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Briefcase,
  SlidersHorizontal,
  ChevronDown,
  Zap,
  Sparkles,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    activeTechnician,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    cities,
    setIsAuthModalOpen,
    setIsAIChatOpen,
    notifications,
    darkMode,
    setDarkMode,
    leadPrice,
  } = useApp();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-bold">
                  <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
                  ServiPulse
                </span>
                <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800">
                  AI Marketplace
                </span>
              </div>
            </div>

            {/* City Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/80"
              >
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Your City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.name);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors ${
                        selectedCity === city.name
                          ? "font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{city.name}</span>
                      {city.isPopular && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search bar in Customer Mode */}
          {role === "customer" && (
            <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search AC Repair, Plumber, Electrician, Cleaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          )}

          {/* Role Switcher & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Pills */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-medium">
              <button
                onClick={() => setRole("customer")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  role === "customer"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setRole("technician")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  role === "technician"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Technician</span>
              </button>
              <button
                onClick={() => setRole("admin")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  role === "admin"
                    ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>

            {/* Wallet indicator for Technician */}
            {role === "technician" && activeTechnician && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  activeTechnician.walletBalance < leadPrice
                    ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 animate-pulse"
                    : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>₹{activeTechnician.walletBalance.toLocaleString("en-IN")}</span>
              </div>
            )}

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/20 transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: "3s" }} />
              <span className="hidden sm:inline">AI Support</span>
            </button>

            {/* Notifications toggle */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
                      {notifications.length} alerts
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left text-xs"
                      >
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {notif.title}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login / Profile */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(" ")[0] : "Login"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
