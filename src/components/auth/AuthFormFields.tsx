import type { useAuthForm } from "./useAuthForm";

export function AuthFormFields({
  hookArgs,
}: {
  hookArgs: ReturnType<typeof useAuthForm>;
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
        <span className="text-xs font-semibold text-slate-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={(mode === "register" || mode === "forgot_password") && step !== "email"}
          className="sl-input mt-1"
          placeholder="you@example.com"
          required
        />
      </label>

      {mode === "signin" ? (
        <>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="sl-input mt-1"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => switchMode("forgot_password")}
              className="text-xs font-semibold text-blue-700 transition hover:text-blue-800"
            >
              Forgot Password?
            </button>
          </div>
        </>
      ) : null}

      {(mode === "register" || mode === "forgot_password") && step === "code" ? (
        <label className="block">
          <span className="text-xs font-semibold text-slate-700">OTP</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="sl-input mt-1 tracking-[0.35em]"
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
            <span className="text-xs font-semibold text-slate-700">Full Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="sl-input mt-1"
              placeholder="Your name"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="sl-input mt-1"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="sl-input mt-1"
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
            <span className="text-xs font-semibold text-slate-700">New Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="sl-input mt-1"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Confirm New Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="sl-input mt-1"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </label>
        </>
      ) : null}

      {devCode ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-900">
          Local dev code: <span className="font-bold tracking-[0.2em]">{devCode}</span>
        </div>
      ) : null}

      {status ? (
        <p className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          {status}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-linear-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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
