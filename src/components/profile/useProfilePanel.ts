import { useEffect, useRef, useState } from "react";
import type { SafeUser, TicketBooking, UserSettings } from "@/lib/auth";

export type ProfilePayload = {
  user: SafeUser;
  tickets: TicketBooking[];
};

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong.");
  }

  return data;
}

export function useProfilePanel(
  open: boolean,
  user: SafeUser | null,
  onUserUpdated: (user: SafeUser | null) => void,
  onClose: () => void,
) {
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const lastLoadedUserIdRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !user) return;
    if (profile?.user?.id === user.id) return;
    if (lastLoadedUserIdRef.current === user.id) return;

    let cancelled = false;
    lastLoadedUserIdRef.current = user.id;
    setError("");
    Promise.resolve()
      .then(() => fetchJson<ProfilePayload>("/api/profile"))
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
      })
      .catch((caught) => {
        if (cancelled) return;
        setError(caught instanceof Error ? caught.message : "Unable to load profile.");
      });

    return () => {
      cancelled = true;
    };
  }, [open, user, profile?.user?.id]);

  const updateSettings = async (settings: Partial<UserSettings>) => {
    if (!profile) return;
    setSaving(true);
    setError("");

    try {
      const data = await fetchJson<ProfilePayload>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ settings }),
      });
      setProfile(data);
      onUserUpdated(data.user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setError("");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.replace(/['"]/g, "");
    const uploadPreset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "subhlaxmi").replace(/['"]/g, "");

    if (!cloudName) {
      setError("Cloudinary configuration missing. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env file.");
      setUploadingImage(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error?.message || "Failed to upload image to Cloudinary.");
      }

      const data = await res.json();
      const imageUrl = data.secure_url;

      const profileData = await fetchJson<ProfilePayload>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ image: imageUrl }),
      });
      
      setProfile(profileData);
      onUserUpdated(profileData.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const signOut = async () => {
    setSaving(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setSaving(false);
    setProfile(null);
    onUserUpdated(null);
    onClose();
  };

  const activeUser = profile?.user ?? user;
  const loading = open && !!user && !profile && !error;

  return {
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
  };
}
