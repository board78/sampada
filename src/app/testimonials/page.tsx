import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Player Testimonials & Reviews - Subhlaxmi Lottery",
  description: "Read real reviews and testimonials from our winners and players. See why Subhlaxmi Lottery is India's most trusted online lottery platform.",
  alternates: {
    canonical: "https://subhlaxmi.in/testimonials",
  }
};

async function getTestimonials() {
  try {
    const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    const baseUrl = raw ? raw.replace(/\/$/, "") : "https://subhlaxmi.in";
    const res = await fetch(`${baseUrl}/api/testimonials?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.testimonials || [];
  } catch (err) {
    return [];
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  // Generate JSON-LD Schema for Reviews
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Subhlaxmi Lottery",
    "image": "https://subhlaxmi.in/icon.png",
    "description": "India's most trusted online lottery platform.",
    "aggregateRating": testimonials.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": testimonials.length.toString(),
    } : undefined,
    "review": testimonials.map((t: any) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": t.rating?.toString() || "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": t.name || "Anonymous Player"
      },
      "reviewBody": t.content
    }))
  };

  return (
    <div className="royal-surface royal-grid min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-200/70 mb-3">Player Reviews</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">What Our Winners Say</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Real stories and reviews from our trusted players across India who have safely and securely played Subhlaxmi Lottery.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center text-zinc-500 py-12">No testimonials available yet.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t: any) => (
              <div key={t._id} className="rounded-3xl border border-white/10 bg-black/20 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 italic mb-6">"{t.content}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-900/30 text-amber-300 flex items-center justify-center font-bold">
                    {(t.name || "A")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name || "Anonymous Player"}</p>
                    {t.location && <p className="text-xs text-zinc-500">{t.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
