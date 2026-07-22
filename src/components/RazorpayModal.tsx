import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Lock,
  Zap
} from "lucide-react";

interface RazorpayModalProps {
  orderData: {
    orderId: string;
    amount: number;
    currency: string;
    merchantName: string;
    description: string;
    customer: {
      name: string;
      phone: string;
    };
  };
  onSuccess: (paymentData: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) => void;
  onFailure: (errorMessage: string) => void;
  onClose: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  orderData,
  onSuccess,
  onFailure,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [upiId, setUpiId] = useState("user@upi");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("321");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      const mockPaymentId = `pay_rzp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const mockSignature = `sig_${Date.now()}_sha256`;

      const res = await fetch("/api/payment/verify-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: mockSignature,
          amount: orderData.amount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess({
          orderId: orderData.orderId,
          paymentId: mockPaymentId,
          signature: mockSignature,
        });
      } else {
        onFailure(data.message || "Payment signature verification failed.");
      }
    } catch (err: any) {
      onFailure("Network error during payment verification.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateFailure = () => {
    onFailure("Payment cancelled or declined by user. No booking was created.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Razorpay Gateway Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={handleSimulateFailure}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors"
            title="Cancel Payment"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">
                  Razorpay Secure Gateway
                </span>
                <span className="px-1.5 py-0.5 bg-blue-500/30 text-blue-200 text-[10px] font-mono rounded">
                  TEST MODE
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white">
                {orderData.merchantName}
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              <span className="block text-[10px] text-slate-400 uppercase">Order ID</span>
              <span className="font-mono text-cyan-300">{orderData.orderId}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 uppercase">Amount Payable</span>
              <span className="font-mono text-2xl font-black text-emerald-400">
                ₹{orderData.amount}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-4 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedMethod("upi")}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                selectedMethod === "upi"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 text-slate-500"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod("card")}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                selectedMethod === "card"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 text-slate-500"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod("netbanking")}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                selectedMethod === "netbanking"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 text-slate-500"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>NetBanking</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod("wallet")}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                selectedMethod === "wallet"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 text-slate-500"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Wallets</span>
            </button>
          </div>

          {/* Form per method */}
          {selectedMethod === "upi" && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Enter VPA / UPI ID (Google Pay, PhonePe, Paytm, BHIM)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
              />
              <p className="text-[11px] text-slate-500">
                💡 Instant verification via Razorpay Autopay / UPI Intent.
              </p>
            </div>
          )}

          {selectedMethod === "card" && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {(selectedMethod === "netbanking" || selectedMethod === "wallet") && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Select Bank or Wallet Partner
              </label>
              <select className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                <option>HDFC Bank NetBanking</option>
                <option>ICICI Bank NetBanking</option>
                <option>State Bank of India (SBI)</option>
                <option>Axis Bank</option>
                <option>Amazon Pay Balance / Paytm Wallet</option>
              </select>
            </div>
          )}

          {/* Security note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-blue-50/60 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              256-Bit Bank Grade Security • RBI Compliant Tokenization
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {isProcessing ? "Verifying Signature..." : `Pay ₹${orderData.amount} via Razorpay`}
              </span>
            </button>

            <button
              onClick={handleSimulateFailure}
              disabled={isProcessing}
              className="w-full py-2.5 text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-semibold text-center"
            >
              Cancel Payment / Simulate Gateway Failure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
