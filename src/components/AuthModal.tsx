"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState, useEffect } from "react";
import type { SafeUser } from "@/lib/auth";

import { useAuthForm, type AuthMode, type RegisterStep } from "./auth/useAuthForm";
import { AuthFormFields } from "./auth/AuthFormFields";

type Props = {
  open: boolean;
  initialMode: AuthMode;
  onClose: () => void;
  onAuthed: (user: SafeUser) => void;
};

function AuthModalBody({
  initialMode,
  onClose,
  onAuthed,
}: {
  initialMode: AuthMode;
  onClose: () => void;
  onAuthed: (user: SafeUser) => void;
}) {
  const hookArgs = useAuthForm({ initialMode, onClose, onAuthed });
  const { mode, step, switchMode } = hookArgs;

  return (
    <motion.div
      initial={{ y: 24, scale: 0.96 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ y: 16, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="royal-panel relative w-full max-w-md overflow-hidden rounded-[28px] border border-blue-200/50 bg-white p-5 shadow-2xl sm:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
      >
        Close
      </button>

      {mode === "signin" ? (
        <div className="pr-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
            Welcome back
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">Sign in to Subhlaxmi</h2>
        </div>
      ) : mode === "register" ? (
        <div className="pr-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
            New account
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">Create your account</h2>
        </div>
      ) : (
        <div className="pr-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
            Reset Password
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">Recover your account</h2>
        </div>
      )}

      {mode === "register" || mode === "forgot_password" ? (
        <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
          {(["email", "code", "password"] as RegisterStep[]).map((item, index) => {
            const order = ["email", "code", "password"];
            const isActive = step === item;
            const isDone = index < order.indexOf(step);
            return (
              <div
                key={item}
                className={`rounded-full px-3 py-2 text-center ${
                  isActive
                    ? "border border-blue-300 bg-blue-100 text-blue-800 font-bold"
                    : isDone
                      ? "border border-emerald-300 bg-emerald-100 text-emerald-800 font-bold"
                      : "border border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                {item === "email" ? "Email" : item === "code" ? "OTP" : "Password"}
              </div>
            );
          })}
        </div>
      ) : null}

      <AuthFormFields hookArgs={hookArgs} />

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600">
        {mode === "signin" ? (
          <>
            <span>New user?</span>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className="font-bold text-blue-700 transition hover:text-blue-800"
            >
              Create account
            </button>
          </>
        ) : mode === "register" ? (
          <>
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-bold text-blue-700 transition hover:text-blue-800"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            <span>Back to</span>
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-bold text-blue-700 transition hover:text-blue-800"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export function AuthModal({ open, initialMode, onClose, onAuthed }: Props) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).isAuthModalOpen = open;
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <AuthModalBody initialMode={initialMode} onClose={onClose} onAuthed={onAuthed} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
