import { FormEvent, useState } from "react";
import type { SafeUser } from "@/lib/auth";

export type AuthMode = "signin" | "register" | "forgot_password";
export type RegisterStep = "email" | "code" | "password";

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong.");
  }

  return data;
}

export function useAuthForm({
  initialMode,
  onClose,
  onAuthed,
}: {
  initialMode: AuthMode;
  onClose: () => void;
  onAuthed: (user: SafeUser) => void;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<RegisterStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setStep("email");
    setEmail("");
    setCode("");
    setDevCode("");
    setRegistrationToken("");
    setName("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setStatus("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");

    try {
      if (mode === "signin") {
        const data = await postJson<{ user: SafeUser }>("/api/auth/login", { email, password });
        onAuthed(data.user);
        onClose();
        return;
      }

      if (mode === "forgot_password") {
        if (step === "email") {
          const data = await postJson<{
            message: string;
            devCode?: string;
            expiresInMinutes: number;
          }>("/api/auth/forgot-password/request-code", { email });
          setStatus(data.message);
          setDevCode(data.devCode ?? "");
          setStep("code");
          return;
        }

        if (step === "code") {
          const data = await postJson<{ resetToken: string; message: string }>(
            "/api/auth/forgot-password/verify-code",
            { email, code },
          );
          setStatus(data.message);
          setRegistrationToken(data.resetToken);
          setStep("password");
          return;
        }

        if (password !== confirmPassword) throw new Error("Passwords do not match");

        const data = await postJson<{ message: string }>("/api/auth/forgot-password/reset", {
          email,
          resetToken: registrationToken,
          newPassword: password,
        });
        setStatus(data.message);
        setTimeout(() => switchMode("signin"), 1500);
        return;
      }

      if (step === "email") {
        const data = await postJson<{ message: string; devCode?: string }>(
          "/api/auth/register/request-code",
          { email },
        );
        setStatus(data.message);
        setDevCode(data.devCode ?? "");
        setStep("code");
        return;
      }

      if (step === "code") {
        const data = await postJson<{ registrationToken: string }>("/api/auth/register/verify-code", {
          email,
          code,
        });
        setStatus("Email verified. Complete your profile.");
        setRegistrationToken(data.registrationToken);
        setStep("password");
        return;
      }

      const data = await postJson<{ user: SafeUser }>("/api/auth/register/complete", {
        email,
        name,
        password,
        registrationToken,
      });
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.track("CompleteRegistration", {
            status: "success",
            content_name: data.user.name,
          });
        })
        .catch(() => {});
      onAuthed(data.user);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to continue.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
