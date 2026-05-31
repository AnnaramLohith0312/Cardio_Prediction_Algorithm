"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

export default function TopNavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isCurrent = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  return (
    <header className="w-full top-0 sticky z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="font-headline-page text-headline-page text-primary font-bold">
          CorMetrics
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/dashboard" className={`font-medium transition-colors duration-200 ${isCurrent("/dashboard") ? "text-primary border-b-2 border-primary pb-1 font-semibold" : "text-on-surface-variant hover:text-primary"}`}>
            Dashboard
          </Link>
          <Link href="/methodology" className={`font-medium transition-colors duration-200 ${isCurrent("/methodology") ? "text-primary border-b-2 border-primary pb-1 font-semibold" : "text-on-surface-variant hover:text-primary"}`}>
            Methodology
          </Link>
          <Link href="/assess" className={`font-medium transition-colors duration-200 ${isCurrent("/assess") ? "text-primary border-b-2 border-primary pb-1 font-semibold" : "text-on-surface-variant hover:text-primary"}`}>
            Risk Assessment
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-on-surface-variant hidden sm:block">{user.email}</span>
              <button onClick={() => { logout(); router.push("/signin"); }} className="text-teal-accent border border-teal-accent/50 px-4 py-1.5 rounded-lg text-sm hover:bg-teal-accent/10 transition-colors">
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/signin" className="text-teal-accent border border-teal-accent/50 px-4 py-1.5 rounded-lg text-sm hover:bg-teal-accent/10 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
