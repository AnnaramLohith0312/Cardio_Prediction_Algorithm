"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      const redirectUrl = searchParams.get("redirect") || "/assessment";
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="space-y-2">
          <label className="font-label-md text-xs font-semibold text-on-surface-variant block ml-1" htmlFor="email">
            Email address
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              mail
            </span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md text-sm text-on-surface"
              id="email"
              placeholder="name@medical.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="font-label-md text-xs font-semibold text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <a className="font-label-sm text-xs text-primary hover:text-primary-container transition-colors" href="#">
              Forgot password?
            </a>
          </div>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              lock
            </span>
            <input
              className="w-full pl-12 pr-12 py-3 bg-white/50 border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md text-sm text-on-surface"
              id="password"
              placeholder="••••••••"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors cursor-pointer"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>
        {/* Remember Me */}
        <div className="flex items-center space-x-2 ml-1">
          <input
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/30 transition-all cursor-pointer"
            id="remember"
            type="checkbox"
          />
          <label className="font-label-sm text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
            Remember me for 30 days
          </label>
        </div>
        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            <span className="material-symbols-outlined text-sm mt-px flex-shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}
        {/* CTA */}
        <button
          className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold py-4 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              Authenticating...
            </>
          ) : (
            <>
              Sign In
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </>
          )}
        </button>
      </form>
      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/30"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-outline font-medium">Or continue with</span>
        </div>
      </div>
      {/* OAuth Social */}
      <div className="grid grid-cols-1 gap-4">
        <button className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-outline-variant rounded-lg bg-white/50 hover:bg-surface-container-high transition-colors font-label-md text-sm font-semibold text-on-surface cursor-pointer">
          <span className="material-symbols-outlined text-primary text-xl">google</span>
          Google
        </button>
      </div>
      {/* Footnote */}
      <div className="mt-8 text-center">
        <p className="font-body-md text-sm text-on-surface-variant">
          Don't have an account?{" "}
          <Link className="text-primary font-bold hover:underline transition-all" href="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
