import React from "react";
import { useApp } from "../context/AppContext";
import { X, Printer, Download, CheckCircle2, Zap, ShieldCheck } from "lucide-react";

export const InvoiceModal: React.FC = () => {
  const { activeBookingForInvoice, setActiveBookingForInvoice } = useApp();

  if (!activeBookingForInvoice) return null;

  const booking = activeBookingForInvoice;
  const gstAmount = Math.round(booking.finalAmount * 0.18);
  const baseAmount = booking.finalAmount - gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setActiveBookingForInvoice(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                ServiPulse
              </h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                GST Tax Invoice
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
              PAID IN FULL
            </span>
            <div className="text-xs font-mono text-slate-500 mt-1">
              Invoice #{booking.bookingNumber}
            </div>
          </div>
        </div>

        {/* Customer & Technician Info */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
              Billed To (Customer)
            </span>
            <p className="font-bold text-slate-900">{booking.customerName}</p>
            <p className="text-slate-600">{booking.customerPhone}</p>
            <p className="text-slate-500 mt-0.5 leading-tight">{booking.customerAddress}</p>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
              Fulfilled By (Technician)
            </span>
            <p className="font-bold text-slate-900">{booking.assignedTechnicianName || "Verified Partner"}</p>
            <p className="text-slate-600">{booking.assignedTechnicianPhone || "+91 98765 43210"}</p>
            <p className="text-slate-500 mt-0.5">Date: {new Date(booking.createdAt).toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="p-3">Service Description</th>
                <th className="p-3 text-right">Category</th>
                <th className="p-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3">
                  <span className="font-bold text-slate-800 block">{booking.category} Doorstep Service</span>
                  <span className="text-slate-500 text-[11px]">{booking.problemDescription}</span>
                </td>
                <td className="p-3 text-right font-medium text-slate-600">{booking.category}</td>
                <td className="p-3 text-right font-mono font-semibold">₹{baseAmount.toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-600">GST (18% Integrated Tax)</td>
                <td className="p-3 text-right text-slate-500">CGST + SGST</td>
                <td className="p-3 text-right font-mono text-slate-600">₹{gstAmount.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-blue-50/80 font-bold text-slate-900 border-t border-slate-200">
                <td colSpan={2} className="p-3 text-right text-sm">Total Paid:</td>
                <td className="p-3 text-right text-base text-blue-700 font-mono">
                  ₹{booking.finalAmount.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Proof Badge */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Payment verified via <b>{booking.paymentMethod || "UPI / Razorpay"}</b>. ServiPulse 30-Day Service Warranty active.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={() => setActiveBookingForInvoice(null)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
