"use client";

import { useEffect, useState } from "react";
import type { SafeUser, TicketBooking } from "@/lib/auth";

export function ContactDetailsSection({
  user,
  saving,
  onSave,
}: {
  user: SafeUser;
  saving: boolean;
  onSave: (payload: { name?: string; phone?: string }) => Promise<void>;
}) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");

  useEffect(() => {
    setName(user.name);
    setPhone(user.phone ?? "");
  }, [user.id, user.name, user.phone]);

  const dirty = name.trim() !== user.name || phone.trim() !== (user.phone ?? "");

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
      <h3 className="font-semibold text-white">Contact details</h3>
      <p className="mt-1 text-xs leading-5 text-zinc-500">
        Used for UPI payments at checkout. Email is from your account sign-in.
      </p>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-zinc-400">Full name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/40"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-zinc-400">Email</span>
          <input
            type="email"
            value={user.email}
            readOnly
            className="mt-1.5 w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-zinc-500"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-zinc-400">Mobile (10 digits)</span>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            maxLength={14}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/40"
          />
        </label>

        <button
          type="button"
          disabled={!dirty || saving}
          onClick={() =>
            onSave({
              name: name.trim(),
              phone: phone.trim() || "",
            })
          }
          className="w-full rounded-full bg-amber-300 px-4 py-2.5 text-sm font-bold text-[#2d1400] transition hover:bg-amber-200 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save contact details"}
        </button>
      </div>
    </section>
  );
}

export function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 p-3">
      <span>
        <span className="block text-sm font-semibold text-zinc-100">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-zinc-500">{description}</span>
      </span>
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-amber-400" : "bg-white/20"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function TicketBookingHistory({ tickets }: { tickets?: TicketBooking[] }) {
  return (
    <section className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">Ticket Booking History</h3>
          <p className="mt-1 text-xs text-zinc-500">Recent tickets booked from this account.</p>
        </div>
        <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-zinc-300">
          {tickets?.length ?? 0}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {tickets?.length ? (
          tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="rounded-2xl border border-amber-200/10 bg-[#120b0f] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{ticket.drawName}</p>
                  <p className="mt-1 text-xs text-amber-200">{ticket.prize}</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-100">
                  {ticket.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-400">
                <span className="rounded-full bg-white/6 px-2.5 py-1">{ticket.ticketNumber}</span>
                <span className="rounded-full bg-white/6 px-2.5 py-1">{ticket.drawTime}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/12 bg-white/3 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-zinc-200">No ticket bookings yet</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Book a draw from the home page and it will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
