import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Smartphone, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { UserRole } from "../types";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authDefaultRole, setRole, setCurrentUser, showToast } = useApp();

  const [activeRole, setActiveRole] = useState<UserRole>(authDefaultRole || "customer");
  const [loginMethod, setLoginMethod] = useState<"otp" | "google" | "email">("otp");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      showToast("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
    showToast(`OTP 4829 sent to +91 ${phoneNumber}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 4) {
      showToast("Please enter the 4-digit verification code (e.g. 4829).");
      return;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || (activeRole === "technician" ? "Technician Partner" : "Priya Sundaram"),
      email: email || `${phoneNumber}@servipulse.com`,
      phone: `+91 ${phoneNumber}`,
      role: activeRole,
      city: "Mumbai",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setCurrentUser(newUser);
    setRole(activeRole);
    setIsAuthModalOpen(false);
    showToast(`Welcome ${newUser.name}! Logged in as ${activeRole.toUpperCase()}.`);
  };

  const handleGoogleLogin = () => {
    const newUser = {
      id: `usr_g_${Date.now()}`,
      name: activeRole === "technician" ? "Suresh Sharma (Verified Tech)" : "Arjun Reddy",
      email: "user.google@gmail.com",
      phone: "+91 98765 43210",
      role: activeRole,
      city: "Bengaluru",
      createdAt: new Date().toISOString().split("T")[0]
    };
    setCurrentUser(newUser);
    setRole(activeRole);
    setIsAuthModalOpen(false);
    showToast(`Authenticated via Google as ${newUser.name}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Sign In to ServiPulse
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access doorstep services or manage technician lead orders
          </p>
        </div>

        {/* Role Toggle */}
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex text-xs font-semibold mb-5">
          <button
            type="button"
            onClick={() => setActiveRole("customer")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeRole === "customer"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => setActiveRole("technician")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeRole === "technician"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Technician Login
          </button>
        </div>

        {/* Login Method Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-5 text-xs font-medium text-slate-500">
          <button
            onClick={() => setLoginMethod("otp")}
            className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 ${
              loginMethod === "otp"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile OTP
          </button>
          <button
            onClick={() => setLoginMethod("google")}
            className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 ${
              loginMethod === "google"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent"
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setLoginMethod("email")}
            className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 ${
              loginMethod === "email"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent"
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
        </div>

        {/* Method 1: Mobile OTP */}
        {loginMethod === "otp" && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            {!otpSent ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Send OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>OTP sent to +91 {phoneNumber}. Enter <b>4829</b> to verify.</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Enter 4-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="4829"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-bold py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
                >
                  Verify & Sign In
                </button>
              </>
            )}
          </form>
        )}

        {/* Method 2: Google */}
        {loginMethod === "google" && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-500 text-center">
              Authenticate instantly using your Google Workspace or Gmail account
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-semibold text-slate-800 dark:text-white rounded-xl text-sm flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Method 3: Email */}
        {loginMethod === "email" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGoogleLogin();
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md"
            >
              Sign In with Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
