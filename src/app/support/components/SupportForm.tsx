import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, ShieldCheck } from "lucide-react";
import type { SafeUser } from "@/lib/auth";

export function SupportForm({ user }: { user?: SafeUser | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill details
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to submit your request.");
      }

      setIsSubmitting(false);
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.track("Contact", {
            content_name: subject,
          });
        })
        .catch(() => {});
      toast.success("Support ticket submitted!", {
        description: "Our customer success team will get back to you shortly.",
      });
      setSubject("");
      setMessage("");
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error instanceof Error ? error.message : "Unable to submit your request.");
    }
  };

  return (
    <aside>
      <div className="royal-panel sticky top-24 overflow-hidden rounded-[26px] border border-amber-300/20 bg-[#17070f]/95 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-amber-300 to-transparent" />
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Submit a support ticket</h2>
            <p className="mt-1 text-xs leading-5 text-zinc-400">Share the details and our team will get back to you within 24 hours.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="support-name" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Your Name</label>
            <input
              id="support-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400/50 focus:bg-white/8"
            />
          </div>

          <div>
            <label htmlFor="support-email" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
            <input
              id="support-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400/50 focus:bg-white/8"
            />
          </div>

          <div>
            <label htmlFor="support-subject" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Subject</label>
            <input
              id="support-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Ticket Booking Issue"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400/50 focus:bg-white/8"
            />
          </div>

          <div>
            <label htmlFor="support-message" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Message</label>
            <textarea
              id="support-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your problem in detail..."
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-amber-400/50 focus:bg-white/8 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full sl-cta-gradient py-3 text-sm font-bold text-white transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Send size={16} /> {isSubmitting ? "Submitting..." : "Send message"}
          </button>
        </form>
      </div>
    </aside>
  );
}
