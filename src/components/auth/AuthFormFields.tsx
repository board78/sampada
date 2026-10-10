import { FormEvent } from "react";
import type { AuthMode, RegisterStep } from "./useAuthForm";

export function AuthFormFields({
  hookArgs,
}: {
  hookArgs: any;
}) {
  const {
    mode,
    step,
    email,
    setEmail,
    code,
    setCode,
    devCode,
    name,
    setName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    status,
    error,
    loading,
    switchMode,
    submit,
  } = hookArgs;

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
      <label className="block">
        <span className="text-xs font-semibold text-zinc-300">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={(mode === "register" || mode === "forgot_password") && step !== "email"}
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-200/50"
          placeholder="you@example.com"
          required
        />
      </label>

      {mode === "signin" ? (
        <>
          <label className="block">
            <span className="text-xs font-semibold text-zinc-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-200/50"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => switchMode("forgot_password")}
              className="text-xs font-semibold text-amber-200 transition hover:text-amber-100"
            >
              Forgot Password?
            </button>
          </div>
        </>
      ) : null}

      {(mode === "register" || mode === "forgot_password") && step === "code" ? (
        <label className="block">
          <span className="text-xs font-semibold text-zinc-300">OTP</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm tracking-[0.35em] text-white outline-none transition placeholder:tracking-normal placeholder:text-zinc-600 focus:border-amber-200/50"
            placeholder="______"
            inputMode="numeric"
            minLength={6}
            maxLength={6}
            required
          />
        </label>
      ) : null}

      {mode === "register" && step === "password" ? (
        <>
          <label className="block">
            <span className="text-xs font-semibold text-zinc-300">Full Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-200/50"
              placeholder="Your name"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-zinc-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-200/50"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-zinc-300">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-200/50"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
        </>
      ) : null}

      {mode === "forgot_password" && step === "password" ? (
        <>
          <label className="block">
            <span className="text-xs font-semibold text-zinc-300">New Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-200/50"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-zinc-300">Confirm New Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-200/50"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
        </>
      ) : null}

      {devCode ? (
        <div className="rounded-2xl border border-amber-200/20 bg-amber-300/10 px-4 py-3 text-xs leading-5 text-amber-100">
          Local dev code: <span className="font-bold tracking-[0.2em]">{devCode}</span>
        </div>
      ) : null}

      {status ? (
        <p className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-100">
          {status}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-red-300/15 bg-red-500/10 px-4 py-3 text-xs text-red-100">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full sl-cta-gradient px-5 py-3 text-sm font-bold sl-force-light-text transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Please wait..."
          : mode === "signin"
            ? "Sign In"
            : step === "email"
              ? "Send OTP"
              : step === "code"
                ? "Verify OTP"
                : mode === "forgot_password"
                  ? "Reset Password"
                  : "Create Account"}
      </button>
    </form>
  );
}
