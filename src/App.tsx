import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { AIChatbotModal } from "./components/AIChatbotModal";
import { InvoiceModal } from "./components/InvoiceModal";
import { CustomerHome } from "./views/CustomerHome";
import { TechnicianDashboard } from "./views/TechnicianDashboard";
import { AdminDashboard } from "./views/AdminDashboard";
import { CheckCircle2 } from "lucide-react";

const MainContent: React.FC = () => {
  const { role, toastMessage, darkMode } = useApp();

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <main className="flex-1">
        {role === "customer" && <CustomerHome />}
        {role === "technician" && <TechnicianDashboard />}
        {role === "admin" && <AdminDashboard />}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <AIChatbotModal />
      <InvoiceModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
