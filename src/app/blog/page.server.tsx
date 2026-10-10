import { Metadata } from "next";
import { BlogListClient } from "./BlogListClient";
import { cookies } from "next/headers";
import type { SafeUser } from "@/lib/auth";

// Base URL for fetching data and canonical URLs
function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, ""); // remove trailing slash
  return "https://subhlaxmi.in";
}

export const metadata: Metadata = {
  title: "Blog - Subhlaxmi Lottery | News & Updates",
  description: "Discover the latest news, winning strategies, and stories from India's most trusted online lottery platform.",
  alternates: {
    canonical: `${getBaseUrl()}/blog`,
  },
  openGraph: {
    title: "Blog - Subhlaxmi Lottery",
    description: "Read the latest news and stories from Subhlaxmi Lottery.",
    url: `${getBaseUrl()}/blog`,
  }
};

async function getInitialPosts() {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/blog?page=1&limit=9`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { posts: [], total: 0 };
    return await res.json();
  } catch (err) {
    console.error("Error fetching initial blog posts:", err);
    return { posts: [], total: 0 };
  }
}

export default async function BlogPage() {
  const data = await getInitialPosts();

  return (
    <BlogListClient 
      initialPosts={data.posts} 
      initialTotal={data.total} 
    />
  );
}
