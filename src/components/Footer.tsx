import React from "react";
import { Zap, Shield, Award, Clock, Heart, Phone, Mail, MapPin } from "lucide-react";
import { SERVICE_CATEGORIES, CITIES } from "../data/mockData";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Trust Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-3">
            <Shield className="w-8 h-8 text-blue-400 mb-2" />
            <span className="font-bold text-white text-base">Verified Technicians</span>
            <span className="text-xs text-slate-400 mt-1">Background checked & KYC verified</span>
          </div>
          <div className="flex flex-col items-center p-3">
            <Clock className="w-8 h-8 text-cyan-400 mb-2" />
            <span className="font-bold text-white text-base">15-Min Fast Arrival</span>
            <span className="text-xs text-slate-400 mt-1">Live GPS tracking & arrival guarantee</span>
          </div>
          <div className="flex flex-col items-center p-3">
            <Award className="w-8 h-8 text-amber-400 mb-2" />
            <span className="font-bold text-white text-base">30-Day Service Warranty</span>
            <span className="text-xs text-slate-400 mt-1">Free revisit or 100% money back</span>
          </div>
          <div className="flex flex-col items-center p-3">
            <Zap className="w-8 h-8 text-emerald-400 mb-2" />
            <span className="font-bold text-white text-base">AI Price Estimate</span>
            <span className="text-xs text-slate-400 mt-1">Transparent upfront pricing with zero hidden fees</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold text-white">ServiPulse</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            India's leading AI-powered on-demand service marketplace connecting millions of customers with certified local technicians. From AC servicing to home deep cleaning and tech support.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>+91 1800 200 9000</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>support@servipulse.com</span>
            </div>
          </div>
        </div>

        {/* Col 2: Top Categories */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Popular Services</h4>
          <ul className="space-y-2 text-xs">
            {SERVICE_CATEGORIES.slice(0, 7).map((cat) => (
              <li key={cat.id}>
                <a href={`#${cat.name}`} className="hover:text-blue-400 transition-colors">
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Cities */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Top Cities</h4>
          <ul className="space-y-2 text-xs">
            {CITIES.map((city) => (
              <li key={city.id}>
                <span className="hover:text-blue-400 cursor-pointer transition-colors">
                  {city.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: For Technicians */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Partner with Us</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-blue-400 cursor-pointer">Join as Technician</span></li>
            <li><span className="hover:text-blue-400 cursor-pointer">Membership Plans</span></li>
            <li><span className="hover:text-blue-400 cursor-pointer">Technician Wallet</span></li>
            <li><span className="hover:text-blue-400 cursor-pointer">KYC Guidelines</span></li>
            <li><span className="hover:text-blue-400 cursor-pointer">Lead Dispute Policy</span></li>
            <li><span className="hover:text-blue-400 cursor-pointer">Partner Safety Guarantee</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-3 text-slate-500">
          <div>
            © 2026 ServiPulse Technologies India Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Refund Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
