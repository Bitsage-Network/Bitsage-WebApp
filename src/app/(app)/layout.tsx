"use client";

import { useAccount } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address, isConnecting, isReconnecting } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default to collapsed
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Mobile sidebar state

  useEffect(() => {
    setMounted(true);
    // Check for demo mode
    const demoMode = localStorage.getItem("bitsage_demo_mode") === "true";
    setIsDemoMode(demoMode);
  }, []);

  useEffect(() => {
    // Only redirect if not in demo mode and not connected
    if (mounted && !isConnecting && !isReconnecting && !address && !isDemoMode) {
      router.push("/connect");
    }
  }, [mounted, address, isConnecting, isReconnecting, isDemoMode, router]);

  if (!mounted || isConnecting || isReconnecting) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
          <p className="text-gray-400">Connecting to Starknet...</p>
        </div>
      </div>
    );
  }

  // Allow access if connected OR in demo mode
  if (!address && !isDemoMode) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark bg-grid">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div 
        className={cn(
          "min-h-screen transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"
        )}
      >
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
