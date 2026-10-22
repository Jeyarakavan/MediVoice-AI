"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Activity, Shield, Stethoscope } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

const ROLE_REDIRECTS: Record<string, string> = {
  superAdmin: "/admin",
  hospitalAdmin: "/hospital",
  receptionist: "/receptionist",
  doctor: "/doctor",
  patient: "/ClinicBook",
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    clearError();
    try {
      await login(data.email, data.password);
      const { user } = useAuthStore.getState();
      if (user) {
        router.push(ROLE_REDIRECTS[user.role] || "/");
      }
    } catch {
      // error already set in store
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Brand Panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden gradient-brand items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-8 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-lg text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MediVox AI</h1>
              <p className="text-white/70 text-sm">Hospital Management Platform</p>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Intelligent Healthcare
            <span className="block text-white/80">Management</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            AI-powered voice receptionist, automated appointment booking, and
            secure electronic patient records — all in one platform.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <Activity className="w-4 h-4" />, label: "AI Voice Receptionist" },
              { icon: <Shield className="w-4 h-4" />, label: "HIPAA-Ready Security" },
              { icon: <Stethoscope className="w-4 h-4" />, label: "Multi-Tenant SaaS" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur text-sm font-medium"
              >
                {icon}
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Login Panel ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[hsl(var(--color-bg))]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[hsl(var(--color-text))]">MediVox AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[hsl(var(--color-text))] mb-2">
              Welcome back
            </h1>
            <p className="text-[hsl(var(--color-text-secondary))]">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Global error */}
            {error && (
              <div className="p-3.5 rounded-xl bg-[hsl(var(--color-danger)/0.08)] border border-[hsl(var(--color-danger)/0.2)] text-[hsl(var(--color-danger))] text-sm font-medium">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[hsl(var(--color-text))]"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@hospital.com"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-xl border text-[hsl(var(--color-text))] bg-[hsl(var(--color-surface))] placeholder:text-[hsl(var(--color-text-muted))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.3)] focus:border-[hsl(var(--color-primary))] ${
                  errors.email
                    ? "border-[hsl(var(--color-danger))]"
                    : "border-[hsl(var(--color-border))]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-[hsl(var(--color-danger))]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[hsl(var(--color-text))]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[hsl(var(--color-primary))] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border text-[hsl(var(--color-text))] bg-[hsl(var(--color-surface))] placeholder:text-[hsl(var(--color-text-muted))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.3)] focus:border-[hsl(var(--color-primary))] ${
                    errors.password
                      ? "border-[hsl(var(--color-danger))]"
                      : "border-[hsl(var(--color-border))]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text))] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[hsl(var(--color-danger))]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white gradient-brand shadow-brand transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))] focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Patient portal link */}
          <div className="mt-8 p-4 rounded-xl bg-[hsl(var(--color-accent)/0.06)] border border-[hsl(var(--color-accent)/0.15)]">
            <p className="text-sm text-[hsl(var(--color-text-secondary))] text-center">
              Patient?{" "}
              <Link
                href="/ClinicBook"
                className="font-semibold text-[hsl(var(--color-accent))] hover:underline"
              >
                Access your ClinicBook portal →
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-[hsl(var(--color-text-muted))]">
            © 2026 MediVox AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
