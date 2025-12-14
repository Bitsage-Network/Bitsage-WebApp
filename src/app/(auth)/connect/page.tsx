"use client";

import { useConnect, useAccount, Connector } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wallet, Shield, ArrowRight, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { LogoIcon } from "@/components/ui/Logo";

export default function ConnectPage() {
  const { connect, connectors, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [demoMode, setDemoMode] = useState(false);

  // Redirect to dashboard if already connected or demo mode
  useEffect(() => {
    if (isConnected && address) {
      router.push("/dashboard");
    }
  }, [isConnected, address, router]);

  // Check for demo mode in localStorage
  useEffect(() => {
    const isDemoMode = localStorage.getItem("bitsage_demo_mode") === "true";
    if (isDemoMode) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleConnect = async (connector: Connector) => {
    try {
      connect({ connector });
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleDemoMode = () => {
    localStorage.setItem("bitsage_demo_mode", "true");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-surface-dark bg-grid flex items-center justify-center p-4">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent-purple/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4"
          >
            <LogoIcon className="text-brand-400" size={56} />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome to <span className="text-gradient">BitSage</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 px-4">
            Connect your wallet to access decentralized GPU compute
          </p>
        </div>

        {/* Connect Card */}
        <div className="glass-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
            Connect Wallet
          </h2>

          <div className="space-y-3">
            {connectors.map((connector) => (
              <motion.button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-surface-elevated 
                         border border-surface-border rounded-xl hover:border-brand-500/50 
                         transition-all duration-200 group disabled:opacity-50"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-card flex items-center justify-center">
                    {connector.icon ? (
                      <img
                        src={typeof connector.icon === 'string' ? connector.icon : connector.icon.dark}
                        alt={connector.name}
                        className="w-6 h-6"
                      />
                    ) : (
                      <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm sm:text-base font-medium text-white">{connector.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {connector.id === "argentX" ? "Most Popular" : "Secure Wallet"}
                    </p>
                  </div>
                </div>
                {isPending ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-brand-400 transition-colors" />
                )}
              </motion.button>
            ))}

            {connectors.length === 0 && (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No wallets detected</p>
                <p className="text-sm text-gray-500">
                  Install{" "}
                  <a
                    href="https://www.argent.xyz/argent-x/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 hover:underline"
                  >
                    ArgentX
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://braavos.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 hover:underline"
                  >
                    Braavos
                  </a>{" "}
                  to continue
                </p>
              </div>
            )}

            {/* Demo Mode Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-card text-gray-500">or</span>
              </div>
            </div>

            {/* Demo Mode Button */}
            <motion.button
              onClick={handleDemoMode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 p-4 
                       bg-gradient-to-r from-brand-600/20 to-accent-purple/20
                       border border-brand-500/30 rounded-xl 
                       hover:border-brand-500/50 transition-all duration-200"
            >
              <Play className="w-5 h-5 text-brand-400" />
              <span className="text-white font-medium">Try Demo Mode</span>
            </motion.button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Preview the dashboard with mock data
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="glass-card p-3 sm:p-4 text-center">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-accent-emerald mx-auto mb-1.5 sm:mb-2" />
            <p className="text-xs sm:text-sm text-gray-400">ZK Proof Verified</p>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <LogoIcon className="text-accent-cyan mx-auto mb-1.5 sm:mb-2" size={20} />
            <p className="text-xs sm:text-sm text-gray-400">GPU Accelerated</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 px-4">
          By connecting, you agree to our{" "}
          <a href="#" className="text-brand-400 hover:underline">Terms of Service</a>
        </p>
      </motion.div>
    </div>
  );
}
