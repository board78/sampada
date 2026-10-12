"use client";

import { useState } from "react";
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
  const [prevUserId, setPrevUserId] = useState(user.id);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");

  if (user.id !== prevUserId) {
    setPrevUserId(user.id);
    setName(user.name);
    setPhone(user.phone ?? "");
  }

  const dirty = name.trim() !== user.name || phone.trim() !== (user.phone ?? "");

  return (
    <section className="mt-6 rounded-3xl border border-blue-200/60 bg-white p-5 shadow-xs">
      <h3 className="font-bold text-slate-900">Contact details</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Used for UPI payments at checkout. Email is from your account sign-in.
      </p>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs font-semibold text-slate-700">Full name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="sl-input mt-1.5"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-slate-700">Email</span>
          <input
            type="email"
            value={user.email}
            readOnly
            className="sl-input mt-1.5 bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-slate-700">Mobile (10 digits)</span>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            maxLength={14}
            className="sl-input mt-1.5"
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
          className="w-full rounded-full bg-linear-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
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
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-blue-200/50 bg-slate-50 p-3">
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
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
    <section className="mt-4 rounded-3xl border border-blue-200/60 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">Ticket Booking History</h3>
          <p className="mt-1 text-xs text-slate-500">Recent tickets booked from this account.</p>
        </div>
        <span className="rounded-full border border-blue-200/60 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {tickets?.length ?? 0}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {tickets?.length ? (
          tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="rounded-2xl border border-blue-200/60 bg-blue-50/40 p-3.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{ticket.drawName}</p>
                  <p className="mt-1 text-xs font-semibold text-blue-700">{ticket.prize}</p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  {ticket.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="rounded-full border border-blue-200/50 bg-white px-2.5 py-1 font-mono font-semibold text-slate-800">{ticket.ticketNumber}</span>
                <span className="rounded-full border border-blue-200/50 bg-white px-2.5 py-1 font-medium text-slate-600">{ticket.drawTime}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-slate-800">No ticket bookings yet</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Book a draw from the home page and it will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
