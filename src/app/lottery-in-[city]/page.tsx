import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const cityName = resolvedParams.city.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `Buy Subhlaxmi Lottery Tickets in ${cityName} - Official`,
    description: `Play Subhlaxmi Lottery from ${cityName}. Get secure online tickets, instant results, and fast UPI withdrawals for users in ${cityName}, India.`,
    alternates: {
      canonical: `https://subhlaxmi.in/lottery-in-${resolvedParams.city}`,
    },
    openGraph: {
      title: `Subhlaxmi Lottery in ${cityName}`,
      description: `Play securely from ${cityName} and win big.`,
      url: `https://subhlaxmi.in/lottery-in-${resolvedParams.city}`,
    }
  };
}

export default async function GeoLotteryPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const cityName = resolvedParams.city.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="royal-surface royal-grid min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Play Subhlaxmi Lottery in <span className="text-amber-300">{cityName}</span>
        </h1>
        <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
          Welcome to {cityName}'s trusted platform for the Subhlaxmi Lottery. Buy your tickets online safely, check live results instantly, and get your winnings withdrawn via UPI or bank transfer securely.
        </p>
        <a href="/" className="inline-block rounded-full sl-cta-gradient px-8 py-4 font-bold sl-force-light-text text-lg shadow-2xl hover:scale-105 transition-transform">
          Play Now
        </a>

        <div className="mt-16 grid gap-8 sm:grid-cols-3 text-left">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <h3 className="text-xl font-bold text-amber-200 mb-3">100% Legal & Secure</h3>
            <p className="text-zinc-400 text-sm">We provide completely authentic and secure ticket purchases for our users in {cityName}.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <h3 className="text-xl font-bold text-amber-200 mb-3">Instant Withdrawals</h3>
            <p className="text-zinc-400 text-sm">Win in {cityName}? Get your money instantly transferred to your bank via UPI, IMPS, or NEFT.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <h3 className="text-xl font-bold text-amber-200 mb-3">24/7 Support</h3>
            <p className="text-zinc-400 text-sm">Dedicated customer service team available 24/7 to assist our players from {cityName}.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
