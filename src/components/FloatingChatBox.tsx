"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose, IoSend } from "react-icons/io5";
import { Hand, Ticket, Trophy, Calendar, CreditCard, Headset, Mail, MessageCircle, Banknote, User } from "lucide-react";

type Message = {
  id: number;
  text?: React.ReactNode;
  isBot: boolean;
  options?: string[];
  component?: React.ReactNode;
};

interface TicketItem {
  drawName?: string;
  ticketNumber?: string;
  drawTime?: string;
  status?: string;
}

interface ResultItem {
  drawName?: string;
  winningTicket?: string;
  prize?: string;
  winnerName?: string;
  declaredAt: string | number | Date;
}

interface DrawItem {
  name?: string;
  pricePerTicket?: string | number;
  drawDate: string | number | Date;
  drawTime?: string;
  prizeAmount?: string | number;
  totalTickets?: string | number;
}

function getOptionIcon(opt: string) {
  if (opt === "My Ticket") return <Ticket className="w-4 h-4" />;
  if (opt === "Check Result") return <Trophy className="w-4 h-4" />;
  if (opt === "Draw Information") return <Calendar className="w-4 h-4" />;
  if (opt === "Payment Help") return <CreditCard className="w-4 h-4" />;
  if (opt === "Contact Support") return <Headset className="w-4 h-4" />;
  if (opt === "Email Support") return <Mail className="w-4 h-4" />;
  if (opt === "WhatsApp Support") return <MessageCircle className="w-4 h-4" />;
  if (opt === "Create Support Request") return <Ticket className="w-4 h-4" />;
  return null;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: (
      <span className="flex items-center gap-2 font-semibold text-slate-900">
        <Hand className="w-4 h-4 text-blue-600 shrink-0" /> Hi! How can we help you?
      </span>
    ),
    isBot: true,
    options: [
      "My Ticket",
      "Check Result",
      "Draw Information",
      "Payment Help",
      "Contact Support",
    ],
  },
];

export function FloatingChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [chatContext, setChatContext] = useState<"idle" | "awaiting_result_lottery" | "awaiting_draw_lottery">("idle");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleRestart = () => {
    setMessages([{ ...INITIAL_MESSAGES[0], id: Date.now() }]);
    setChatContext("idle");
    setShowConfirmPopup(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const addBotMessage = (msg: Omit<Message, 'id' | 'isBot'>, delay = 600) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { ...msg, id: Date.now(), isBot: true }]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), text, isBot: false }]);
  };

  const handleOptionClick = async (option: string) => {
    addUserMessage(option);

    if (option === "My Ticket") {
      setIsTyping(true);
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          addBotMessage({ text: "You need to be logged in to view your tickets. Please login to your account to continue." }, 0);
          return;
        }
        const authData = await authRes.json();
        if (!authData.user) {
          addBotMessage({ text: "You need to be logged in to view your tickets. Please login to your account to continue." }, 0);
          return;
        }

        const ticketRes = await fetch("/api/tickets");
        if (ticketRes.ok) {
          const data = await ticketRes.json();
          if (data.tickets && data.tickets.length > 0) {
            const ticketList = (
              <div className="flex flex-col gap-2 mt-2 w-full">
                {data.tickets.slice(0, 5).map((t: TicketItem, i: number) => (
                  <div key={i} className="bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-200 shadow-2xs">
                    <p className="font-bold text-slate-900">{t.drawName}</p>
                    <p className="text-slate-600 mt-0.5">Ticket: <span className="font-semibold text-blue-700">{t.ticketNumber}</span></p>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className="text-slate-500 font-medium">{t.drawTime}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        t.status === 'booked' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {(t.status || '').replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                {data.tickets.length > 5 && <p className="text-xs text-center text-slate-600 font-medium mt-1">+{data.tickets.length - 5} more in your account</p>}
              </div>
            );
            addBotMessage({ text: "Here are your recent tickets:", component: ticketList }, 0);
          } else {
            addBotMessage({ text: "You haven't purchased any tickets yet." }, 0);
          }
        } else {
          addBotMessage({ text: "Sorry, we couldn't fetch your tickets right now." }, 0);
        }
      } catch {
        addBotMessage({ text: "Something went wrong while fetching your tickets." }, 0);
      }
      setIsTyping(false);
      return;
    }

    if (option === "Check Result") {
      setChatContext("awaiting_result_lottery");
      addBotMessage({
        text: "Select Lottery:",
        options: ["Subhlaxmi55", "Subhlaxmi15", "Subhlaxmi12", "Subhlaxmi5", "Dhan Laxmi Bumper"]
      });
      return;
    }

    if (option === "Draw Information") {
      setChatContext("awaiting_draw_lottery");
      addBotMessage({
        text: "Select Lottery for Draw Information:",
        options: ["Subhlaxmi55", "Subhlaxmi15", "Subhlaxmi12", "Subhlaxmi5", "Dhan Laxmi Bumper"]
      });
      return;
    }

    const isLotteryName = ["Subhlaxmi55", "Subhlaxmi15", "Subhlaxmi12", "Subhlaxmi5", "Dhan Laxmi Bumper"].includes(option);

    if (chatContext === "awaiting_result_lottery" && isLotteryName) {
      setChatContext("idle");
      setIsTyping(true);
      try {
        const res = await fetch("/api/results");
        if (res.ok) {
          const data = await res.json();
          const latestResult = data.results.find((r: ResultItem) => r.drawName && r.drawName.toLowerCase().includes(option.toLowerCase()));
          if (latestResult) {
            const resultUI = (
              <div className="bg-slate-50 p-3 rounded-xl mt-2 text-sm border border-slate-200 shadow-2xs w-full">
                <p className="font-bold text-blue-700 mb-2 border-b border-slate-200 pb-1">{latestResult.drawName}</p>
                <div className="space-y-2 text-slate-700">
                  <p className="flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500 shrink-0" /> <span className="font-semibold text-slate-900">Winning Ticket:</span> <span className="font-bold text-blue-700">{latestResult.winningTicket}</span></p>
                  <p className="flex items-center gap-2"><Banknote className="w-4 h-4 text-emerald-600 shrink-0" /> <span className="font-semibold text-slate-900">Prize:</span> <span className="font-bold text-emerald-700">{latestResult.prize}</span></p>
                  {latestResult.winnerName && <p className="flex items-center gap-2"><User className="w-4 h-4 text-blue-600 shrink-0" /> <span className="font-semibold text-slate-900">Winner:</span> <span className="font-medium text-slate-900">{latestResult.winnerName}</span></p>}
                </div>
                <p className="text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200 font-medium">Declared: {new Date(latestResult.declaredAt).toLocaleString("en-IN")}</p>
              </div>
            );
            addBotMessage({ text: `Here is the latest result for ${option}:`, component: resultUI }, 0);
          } else {
            addBotMessage({ text: `No recent results found for ${option}.` }, 0);
          }
        }
      } catch {
        addBotMessage({ text: "Failed to fetch results. Please try again later." }, 0);
      }
      setIsTyping(false);
      return;
    }

    if (chatContext === "awaiting_draw_lottery" && isLotteryName) {
      setChatContext("idle");
      setIsTyping(true);
      try {
        const res = await fetch("/api/draws");
        if (res.ok) {
          const data = await res.json();
          const draw = data.draws.find((d: DrawItem) => d.name && d.name.toLowerCase().includes(option.toLowerCase()));
          if (draw) {
            const drawUI = (
              <div className="bg-slate-50 p-3 rounded-xl mt-2 text-sm border border-slate-200 shadow-2xs w-full">
                <p className="font-bold text-blue-700 mb-2 border-b border-slate-200 pb-1">{draw.name}</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-xs">
                  <span className="text-slate-600">Ticket Price:</span> <span className="font-semibold text-slate-900">₹{draw.pricePerTicket}</span>
                  <span className="text-slate-600">Draw Date:</span> <span className="font-semibold text-slate-900">{new Date(draw.drawDate).toLocaleDateString("en-IN")}</span>
                  <span className="text-slate-600">Draw Time:</span> <span className="font-semibold text-slate-900">{draw.drawTime}</span>
                  <span className="text-slate-600">First Prize:</span> <span className="font-semibold text-emerald-700">{draw.prizeAmount || "N/A"}</span>
                  <span className="text-slate-600">Total Tickets:</span> <span className="font-semibold text-slate-900">{draw.totalTickets || "0"}</span>
                </div>
              </div>
            );
            addBotMessage({ text: `Here is the draw information for ${option}:`, component: drawUI }, 0);
          } else {
            addBotMessage({ text: `No active draw found right now for ${option}.` }, 0);
          }
        }
      } catch {
        addBotMessage({ text: "Failed to fetch draw information. Please try again later." }, 0);
      }
      setIsTyping(false);
      return;
    }

    if (option === "Payment Help") {
      addBotMessage({ 
        text: "For any payment related issues, please contact our support team. We usually resolve payment issues within 24 hours.",
        options: ["Contact Support"]
      });
      return;
    }

    if (option === "Contact Support") {
      addBotMessage({
        text: "Need more help?",
        options: [
          "Email Support",
          "WhatsApp Support",
          "Create Support Request"
        ]
      });
      return;
    }

    if (option === "Email Support") {
      addBotMessage({ text: "You can reach us at support@subhlaxmi.in" });
      return;
    }

    if (option === "WhatsApp Support") {
      addBotMessage({ text: "You can reach us on WhatsApp at +12236673706. Easy to WhatsApp voice call." });
      return;
    }

    if (option === "Create Support Request") {
      addBotMessage({ text: "Please visit our Contact Us page to create a support ticket." });
      return;
    }

    // Default fallback
    setChatContext("idle");
    addBotMessage({ 
      text: "Thanks for reaching out! Please select an option from the menu:",
      options: [
        "My Ticket",
        "Check Result",
        "Draw Information",
        "Payment Help",
        "Contact Support",
      ]
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addUserMessage(message);
    setMessage("");
    setChatContext("idle");

    addBotMessage({ 
      text: "Thanks for your message. Currently, I am a bot with limited options. Please select one of the following to proceed:",
      options: [
        "My Ticket",
        "Check Result",
        "Draw Information",
        "Payment Help",
        "Contact Support",
      ]
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative mb-4 w-85 sm:w-100 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700 px-4 py-3.5 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 p-1 backdrop-blur-xs">
                  <Image src="/chaticon.png" alt="Chat Support" width={32} height={32} className="h-full w-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Subhlaxmi Assistant</h3>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-300/40"></span> Online 24/7
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white transition-colors hover:bg-white/20"
                aria-label="Close chat"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-95 overflow-y-auto p-4 bg-slate-50/70">
              <div className="flex flex-col gap-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-2xs ${
                        msg.isBot
                          ? "rounded-tl-none bg-white text-slate-800 border border-slate-200/90 font-normal"
                          : "rounded-tr-none bg-blue-600 text-white font-medium shadow-xs"
                      }`}
                    >
                      {msg.text && (
                        typeof msg.text === "string" ? (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        ) : (
                          <div className="leading-relaxed">{msg.text}</div>
                        )
                      )}
                      {msg.component}
                      {msg.options && (
                        <div className="mt-3 flex flex-col gap-2">
                          {msg.options.map((opt, i) => {
                            const Icon = getOptionIcon(opt);
                            return (
                              <button
                                key={i}
                                onClick={() => handleOptionClick(opt)}
                                className="group flex items-center gap-2.5 text-left bg-blue-50/90 hover:bg-blue-600 hover:text-white text-blue-700 font-semibold py-2.5 px-3.5 rounded-xl border border-blue-200/80 transition-all text-xs hover:border-blue-300 shadow-2xs hover:shadow-xs active:scale-[0.99]"
                              >
                                {Icon && <span className="text-blue-600 group-hover:text-white transition-colors shrink-0">{Icon}</span>}
                                <span className="group-hover:text-white transition-colors">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200 px-4 py-3 shadow-2xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-3 bg-white">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="sl-input rounded-full pr-12 shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-blue-600 shadow-xs"
                  aria-label="Send message"
                >
                  <IoSend className="h-4 w-4 ml-0.5" />
                </button>
              </form>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => setShowConfirmPopup(true)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-blue-700 hover:underline transition-colors"
                >
                  Restart Conversation
                </button>
              </div>
            </div>

            {/* Popup Overlay inside chatbox */}
            <AnimatePresence>
              {showConfirmPopup && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 10 }}
                    className="w-[90%] rounded-2xl bg-white p-5 text-center shadow-2xl border border-blue-100"
                  >
                    <h4 className="mb-2 text-sm font-bold text-slate-900">
                      Start fresh?
                    </h4>
                    <p className="mb-4 text-xs text-slate-600 leading-relaxed">
                      Do you want to start a new conversation and clear previous messages?
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setShowConfirmPopup(false)}
                        className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRestart}
                        className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 shadow-xs"
                      >
                        Yes, Restart
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-tr from-blue-700 via-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95"
        whileTap={{ scale: 0.95 }}
        aria-label="Open support chat"
      >
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/20 p-1 backdrop-blur-xs">
          <Image
            src="/chaticon.png"
            alt="Chat"
            width={40}
            height={40}
            className="h-full w-full object-contain drop-shadow"
          />
        </div>
      </motion.button>
    </div>
  );
}
