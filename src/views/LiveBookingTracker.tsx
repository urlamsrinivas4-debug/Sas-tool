import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Printer,
  Navigation,
  Key,
  Award
} from "lucide-react";
import { Booking } from "../types";

interface LiveBookingTrackerProps {
  booking: Booking;
  onClose: () => void;
}

export const LiveBookingTracker: React.FC<LiveBookingTrackerProps> = ({ booking, onClose }) => {
  const { updateBookingStatus, addReview, setActiveBookingForInvoice, showToast } = useApp();

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "cust" | "tech"; text: string; time: string }>>([
    {
      sender: "tech",
      text: `Hello ${booking.customerName}, I have accepted your ${booking.category} request. I am carrying standard diagnostic equipment and genuine spare parts. On my way!`,
      time: "Just now"
    }
  ]);

  const [ratingVal, setRatingVal] = useState(5);
  const [reviewTextVal, setReviewTextVal] = useState("");

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: "cust" as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulated reply from technician
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "tech",
          text: "Noted! Reaching your doorstep shortly.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1200);
  };

  const handleCallTechnician = () => {
    showToast(`Calling Technician ${booking.assignedTechnicianName || "Partner"} at ${booking.assignedTechnicianPhone || "+91 98765 43210"}...`);
  };

  const handleWhatsAppTechnician = () => {
    showToast(`Opening WhatsApp chat with ${booking.assignedTechnicianName || "Technician"}...`);
  };

  const handleCompleteJob = () => {
    updateBookingStatus(booking.id, "completed");
    showToast("Job marked as Completed! Service Invoice generated.");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview(booking.id, ratingVal, reviewTextVal);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase tracking-wider">
                Live Order #{booking.bookingNumber}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {booking.category} Doorstep Tracking
            </h2>
          </div>
          {booking.status === "completed" && (
            <button
              onClick={() => setActiveBookingForInvoice(booking)}
              className="px-3.5 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
          )}
        </div>

        {/* Payment Status & Details Bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 mb-4 text-xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Service Type & Address</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {booking.serviceType || "Standard Doorstep Repair"} • {booking.city} ({booking.areaPincode || "Central"})
            </span>
            <p className="text-[11px] text-slate-500 line-clamp-1">{booking.customerAddress}</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 font-extrabold rounded-xl border text-[11px] ${
                booking.paymentStatus === "paid"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              }`}
            >
              {booking.paymentStatus === "paid"
                ? `✓ Payment Successful (${booking.paymentMethod || "Online"})`
                : `⏳ Payment Pending (Pay ₹${booking.finalAmount} via Cash/UPI on Service)`}
            </span>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
          <div className="grid grid-cols-4 text-center text-xs font-bold gap-2">
            <div className={`${booking.status !== "pending" ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
              <span>Accepted</span>
            </div>
            <div className={`${["in_transit", "in_progress", "completed"].includes(booking.status) ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
              <Navigation className="w-5 h-5 mx-auto mb-1 animate-bounce" />
              <span>In Transit</span>
            </div>
            <div className={`${["in_progress", "completed"].includes(booking.status) ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
              <Clock className="w-5 h-5 mx-auto mb-1" />
              <span>In Repair</span>
            </div>
            <div className={`${booking.status === "completed" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
              <Award className="w-5 h-5 mx-auto mb-1" />
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Interactive Simulated Map */}
        <div className="relative w-full h-52 bg-slate-900 rounded-2xl overflow-hidden mb-6 border border-slate-800 flex items-center justify-center">
          {/* Simulated Map Visual */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className="relative z-10 flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse mb-2">
              <Navigation className="w-6 h-6 rotate-45" />
            </div>
            <span className="text-xs font-bold text-white">
              Technician Live GPS Signal Active
            </span>
            <span className="text-[11px] text-cyan-300 mt-0.5">
              Estimated Arrival: <b>8 Minutes</b> (1.2 km away)
            </span>
          </div>
          {/* Verification OTP Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-white">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Job Start OTP: <b className="text-amber-400 font-mono text-sm">{booking.verificationOtp || "4829"}</b></span>
          </div>
        </div>

        {/* Technician Details & Contact Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {(booking.assignedTechnicianName || "R").charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {booking.assignedTechnicianName || "Rajesh Kumar"}
                </h4>
                <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded">
                  Verified Tech
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{booking.assignedTechnicianRating || 4.9} (148+ Jobs Completed)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCallTechnician}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </button>
            <button
              onClick={handleWhatsAppTechnician}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Simulated Live Chat */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Live Chat with Technician
          </h4>
          <div className="space-y-2.5 max-h-40 overflow-y-auto mb-3 pr-1 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "cust" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-2.5 rounded-xl max-w-[80%] ${
                    msg.sender === "cust"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              placeholder="Send message to technician..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Rating & Review Modal section if job completed */}
        {booking.status === "completed" && !booking.rating && (
          <form onSubmit={handleReviewSubmit} className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Rate your experience with {booking.assignedTechnicianName}
            </h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingVal(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= ratingVal ? "text-amber-400 fill-amber-400" : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="Write a brief review regarding punctuality, work quality, behavior..."
              value={reviewTextVal}
              onChange={(e) => setReviewTextVal(e.target.value)}
              className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded-xl text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs"
            >
              Submit Star Rating & Review
            </button>
          </form>
        )}

        {/* Complete job simulation button */}
        {booking.status !== "completed" && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
            <button
              onClick={handleCompleteJob}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Simulate Technician Completing Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
