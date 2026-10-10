"use client";

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { ReactLenis } from "lenis/react";

import { HelpCenterHeader } from "./components/HelpCenterHeader";
import { ContactMethods } from "./components/ContactMethods";
import { FAQSection } from "./components/FAQSection";
import { SupportForm } from "./components/SupportForm";

export default function SupportPage() {
  const { user } = useAuth();

  return (
    <div className="support-page royal-surface royal-grid relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/16 blur-3xl" />
        <div className="absolute -right-40 top-32 h-96 w-96 rounded-full bg-orange-500/16 blur-3xl" />
        <div className="absolute -bottom-48 left-[20%] h-104 w-104 rounded-full bg-amber-300/12 blur-3xl" />
      </div>

      <Navbar />

      <div className="min-h-0 flex-1">
        <ReactLenis options={{ duration: 1.2, smoothWheel: true }} className="hide-scrollbar h-full overflow-y-auto">
          <main className="relative mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
            
            <HelpCenterHeader />

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Columns: FAQ and Contact Options */}
              <div className="space-y-8 lg:col-span-2">
                <ContactMethods />
                <FAQSection />
              </div>

              {/* Right Column: Ticket Submission Form */}
              <SupportForm user={user} />
            </div>
            
          </main>
        </ReactLenis>
      </div>
    </div>
  );
}
