"use client";
import { AuthProvider } from "@/lib/authcontext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}