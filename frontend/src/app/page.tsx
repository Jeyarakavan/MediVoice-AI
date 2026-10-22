"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Activity } from "lucide-react";

const ROLE_REDIRECTS: Record<string, string> = {
  superAdmin: "/admin",
  hospitalAdmin: "/hospital",
  receptionist: "/receptionist",
  doctor: "/doctor",
  patient: "/ClinicBook",
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.replace(ROLE_REDIRECTS[user.role] || "/login");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  // Show a brief loading indicator while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center gradient-brand">
      <div className="text-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Activity className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">MediVox AI</h1>
        <p className="text-white/70">Redirecting…</p>
      </div>
    </div>
  );
}
