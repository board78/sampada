"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SafeUser, TicketBooking, UserSettings } from "@/lib/auth";
import { ContactDetailsSection, SettingToggle, TicketBookingHistory } from "./profile/ProfileComponents";
import { useProfilePanel, type ProfilePayload, fetchJson } from "./profile/useProfilePanel";

type Props = {
  open: boolean;
  user: SafeUser | null;
  onClose: () => void;
  onUserUpdated: (user: SafeUser | null) => void;
};

export function ProfilePanel({ open, user, onClose, onUserUpdated }: Props) {
  const {
    profile,
    setProfile,
    saving,
    setSaving,
    uploadingImage,
    error,
    setError,
    fileInputRef,
    updateSettings,
    handleImageUpload,
    signOut,
    activeUser,
    loading,
  } = useProfilePanel(open, user, onUserUpdated, onClose);

  return (
    <AnimatePresence>
      {open && activeUser ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="sl-profile-overlay fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="sl-profile-panel royal-panel flex h-full w-full max-w-md flex-col border-l border-amber-200/15 bg-[#14070f] p-5 shadow-2xl shadow-black/40 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Profile Picture Upload */}
                <div className="group relative shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400/30 bg-black/40 transition hover:border-amber-400/60"
                  >
                    {activeUser.image ? (
                      <img src={activeUser.image} alt={activeUser.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-amber-200/50">
                        {activeUser.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>

                    {/* Loading Spinner */}
                    {uploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-t-amber-400 border-white/20" />
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-200/80">My Profile</p>
                  <h2 className="mt-1.5 text-xl sm:text-2xl font-semibold text-white">{activeUser.name}</h2>
                  <p className="mt-0.5 text-sm text-zinc-400">{activeUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="sl-profile-close rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-white/25 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Admin Dashboard shortcut — only for admins */}
            {activeUser.role === "admin" && (
              <a
                href="/admin"
                className="sl-admin-btn mt-5 flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-linear-to-r from-amber-500/15 to-orange-500/10 px-4 py-3.5 text-left transition hover:border-amber-400/70 hover:from-amber-500/25 hover:to-orange-500/20"
                onClick={onClose}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-[#1a0900] shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-amber-200">Admin Dashboard</span>
                  <span className="mt-0.5 block text-xs text-amber-200/60">Manage draws, users & results</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden className="shrink-0 text-amber-400/60">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            )}

            <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto pb-5">
              {loading ? <p className="mt-6 text-sm text-zinc-400">Loading profile...</p> : null}
              {error ? (
                <p className="mt-5 rounded-2xl border border-red-300/15 bg-red-500/10 px-4 py-3 text-xs text-red-100">
                  {error}
                </p>
              ) : null}

              <ContactDetailsSection
                user={activeUser}
                saving={saving}
                onSave={async (payload) => {
                  setSaving(true);
                  setError("");
                  try {
                    const data = await fetchJson<ProfilePayload>("/api/profile", {
                      method: "PATCH",
                      body: JSON.stringify(payload),
                    });
                    setProfile(data);
                    onUserUpdated(data.user);
                  } catch (caught) {
                    setError(caught instanceof Error ? caught.message : "Unable to save contact details.");
                  } finally {
                    setSaving(false);
                  }
                }}
              />

              <TicketBookingHistory tickets={profile?.tickets} />
            </div>

            <button
              type="button"
              onClick={signOut}
              disabled={saving}
              className="sl-profile-signout mt-4 w-full cursor-pointer rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/30 disabled:opacity-60"
            >
              Sign Out
            </button>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}



