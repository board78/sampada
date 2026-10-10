"use client";
import { Navbar } from "./Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <Navbar />
      {children}
    </div>
  );
}
