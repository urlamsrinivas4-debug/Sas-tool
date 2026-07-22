import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Send, Bot, Sparkles, User, HelpCircle, Zap } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  suggestedActions?: string[];
}

export const AIChatbotModal: React.FC = () => {
  const { isAIChatOpen, setIsAIChatOpen, selectedCity, selectedCategory, setSelectedCategory } = useApp();

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: `Hello! I am ServiPulse AI. I can diagnose appliance or home repair problems, calculate price estimates, or guide you to certified technicians in ${selectedCity}.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: ["AC not cooling", "Water heater leak", "MCB tripping", "Deep home cleaning price"]
    }
  ]);
  const [loading, setLoading] = useState(false);

  if (!isAIChatOpen) return null;

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          city: selectedCity,
          category: selectedCategory,
          conversationHistory: messages.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "I'm here to assist you with all home repairs.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: data.suggestedActions
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I'm experiencing a brief connection drop, but you can choose any category from the home screen to book a certified technician!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg h-[85vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "4s" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <span>ServiPulse AI Assistant</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 rounded">
                  Gemini 3.6
                </span>
              </h3>
              <p className="text-[11px] text-blue-200">Instant trouble diagnosis & price estimation</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIChatOpen(false)}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === "user"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    : "bg-blue-600 text-white"
                }`}
              >
                {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`max-w-[80%] space-y-1.5 ${m.sender === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/80 shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
                <div className="text-[10px] text-slate-400 px-1">{m.time}</div>

                {/* Suggested actions chips */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(action)}
                        className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-[11px] font-medium transition-colors"
                      >
                        ⚡ {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse p-2">
              <Bot className="w-4 h-4 text-blue-500" />
              <span>ServiPulse AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Describe issue (e.g. AC leaking water in Bandra)..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-900 dark:text-white"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
