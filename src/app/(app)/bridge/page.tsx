"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  ArrowDown,
  Clock,
  Shield,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Repeat,
  TrendingUp,
  Info,
  Eye,
  EyeOff,
  Lock,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { LogoIcon } from "@/components/ui/Logo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EXTERNAL_LINKS } from "@/lib/contracts/addresses";
import { PrivacyModeToggle } from "@/components/privacy/PrivacyToggle";
import { useObelyskWallet } from "@/lib/obelysk/ObelyskWalletContext";
import Link from "next/link";

const supportedChains = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "⟠", color: "bg-blue-500" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB", icon: "🔵", color: "bg-blue-400" },
  { id: "optimism", name: "Optimism", symbol: "OP", icon: "🔴", color: "bg-red-500" },
  { id: "base", name: "Base", symbol: "ETH", icon: "🔷", color: "bg-blue-600" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", icon: "🟣", color: "bg-purple-500" },
];

const supportedTokens = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠" },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether", icon: "💲" },
  { symbol: "DAI", name: "Dai", icon: "🔶" },
];

const swapTokens = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠" },
  { symbol: "SAGE", name: "BitSage", icon: "🦉" },
  { symbol: "STRK", name: "Starknet", icon: "⚡" },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
];

// Mock recent bridges
const recentBridges = [
  { id: "br_001", from: "Ethereum", to: "Starknet", amount: "1.5 ETH", status: "completed", time: "2h ago", private: true },
  { id: "br_002", from: "Arbitrum", to: "Starknet", amount: "500 USDC", status: "completed", time: "1d ago", private: false },
];

export default function BridgePage() {
  const { balance, isPrivateRevealed } = useObelyskWallet();
  const [activeTab, setActiveTab] = useState<"bridge" | "swap">("bridge");
  const [fromChain, setFromChain] = useState(supportedChains[0]);
  const [token, setToken] = useState(supportedTokens[0]);
  const [amount, setAmount] = useState("");
  const [showChainSelect, setShowChainSelect] = useState(false);
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  // Swap state
  const [fromToken, setFromToken] = useState(swapTokens[0]);
  const [toToken, setToToken] = useState(swapTokens[1]);
  const [swapAmount, setSwapAmount] = useState("");
  const [showFromTokenSelect, setShowFromTokenSelect] = useState(false);
  const [showToTokenSelect, setShowToTokenSelect] = useState(false);
  const [swapPrivacyMode, setSwapPrivacyMode] = useState(false);

  const swapTokenPositions = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Bridge & Swap</h1>
        <p className="text-gray-400 mt-1">
          Bring liquidity from other chains and swap to SAGE
        </p>
      </div>

      {/* Obelysk Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Obelysk Wallet</p>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{balance.public} SAGE</span>
                <span className="text-gray-600">|</span>
                <span className="text-brand-400 font-mono text-sm">
                  {isPrivateRevealed ? balance.private : "•••••"} private
                </span>
                {parseFloat(balance.pending) > 0 && (
                  <>
                    <span className="text-gray-600">|</span>
                    <span className="text-orange-400 text-sm flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      +{balance.pending} pending
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Link
            href="/wallet"
            className="px-3 py-1.5 text-sm text-brand-400 hover:text-brand-300 border border-brand-500/30 rounded-lg hover:bg-brand-500/10 transition-colors"
          >
            Manage
          </Link>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface-card rounded-xl border border-surface-border">
        <button
          onClick={() => setActiveTab("bridge")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
            activeTab === "bridge"
              ? "bg-brand-600 text-white"
              : "text-gray-400 hover:text-white"
          )}
        >
          <ArrowLeftRight className="w-4 h-4" />
          Bridge
        </button>
        <button
          onClick={() => setActiveTab("swap")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
            activeTab === "swap"
              ? "bg-brand-600 text-white"
              : "text-gray-400 hover:text-white"
          )}
        >
          <Repeat className="w-4 h-4" />
          Swap
        </button>
      </div>

      {/* Bridge Tab */}
      {activeTab === "bridge" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <div className="p-6 space-y-5">
            {/* Privacy Mode Toggle */}
            <PrivacyModeToggle
              enabled={privacyMode}
              onToggle={setPrivacyMode}
            />

            {/* From Section */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">From</label>
              <div className="flex gap-3">
                {/* Chain Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowChainSelect(!showChainSelect)}
                    className="flex items-center gap-2 px-4 py-3 bg-surface-elevated border border-surface-border rounded-xl hover:border-brand-500/50 transition-colors"
                  >
                    <span className="text-xl">{fromChain.icon}</span>
                    <span className="text-white">{fromChain.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {showChainSelect && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-surface-card border border-surface-border rounded-xl shadow-lg z-10">
                      {supportedChains.map((chain) => (
                        <button
                          key={chain.id}
                          onClick={() => {
                            setFromChain(chain);
                            setShowChainSelect(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-elevated transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <span className="text-xl">{chain.icon}</span>
                          <span className="text-white">{chain.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amount + Token */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-field pr-28 text-xl"
                  />
                  <button
                    onClick={() => setShowTokenSelect(!showTokenSelect)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-surface-card rounded-lg hover:bg-surface-elevated transition-colors"
                  >
                    <span>{token.icon}</span>
                    <span className="text-white">{token.symbol}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  {showTokenSelect && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-surface-card border border-surface-border rounded-xl shadow-lg z-10">
                      {supportedTokens.map((t) => (
                        <button
                          key={t.symbol}
                          onClick={() => {
                            setToken(t);
                            setShowTokenSelect(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-elevated transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <span>{t.icon}</span>
                          <span className="text-white">{t.symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Balance: 2.45 {token.symbol}</p>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className={cn(
                "p-3 rounded-full border transition-colors",
                privacyMode 
                  ? "bg-brand-600/20 border-brand-500/30" 
                  : "bg-surface-elevated border-surface-border"
              )}>
                {privacyMode ? (
                  <Lock className="w-5 h-5 text-brand-400" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-brand-400" />
                )}
              </div>
            </div>

            {/* To Section */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                To {privacyMode && <span className="text-brand-400">(Private Balance)</span>}
              </label>
              <div className={cn(
                "flex items-center gap-3 p-4 border rounded-xl transition-colors",
                privacyMode 
                  ? "bg-gradient-to-r from-brand-600/10 to-accent-purple/10 border-brand-500/30" 
                  : "bg-surface-elevated border-surface-border"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <LogoIcon className="text-brand-400" size={28} />
                  </div>
                  <div>
                    <span className="text-white font-medium">Starknet</span>
                    {privacyMode && (
                      <span className="ml-2 text-xs text-brand-400 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 text-right">
                  {privacyMode ? (
                    <div>
                      <p className="text-xl text-brand-400 font-mono tracking-widest">
                        •••••••
                      </p>
                      <p className="text-xs text-brand-400/50 font-mono">encrypted on arrival</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xl text-white font-medium">
                        {amount || "0.00"} {token.symbol}
                      </p>
                      <p className="text-sm text-gray-500">≈ ${(parseFloat(amount || "0") * 2450).toFixed(2)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bridge Info */}
            <div className={cn(
              "p-4 rounded-xl border space-y-2",
              privacyMode 
                ? "bg-brand-600/5 border-brand-500/20" 
                : "bg-surface-elevated border-surface-border"
            )}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Estimated time</span>
                <span className="text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ~15 minutes
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Bridge fee</span>
                <span className="text-white">0.001 {token.symbol}</span>
                <span className="text-xs text-emerald-400 ml-2">(gas sponsored)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Privacy</span>
                {privacyMode ? (
                  <span className="text-brand-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> ElGamal Encrypted
                  </span>
                ) : (
                  <span className="text-gray-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Public
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Security</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> StarkGate Official
                </span>
              </div>
            </div>

            {/* Privacy Info */}
            {privacyMode && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-600/10 border border-brand-500/20">
                <Shield className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400">
                  <strong className="text-brand-400">Private Bridge:</strong> Your bridged assets will be automatically 
                  encrypted on arrival. The amount will appear as "•••••••" on-chain. You can reveal or make public anytime.
                </p>
              </div>
            )}

            {/* Bridge Button */}
            <a
              href={EXTERNAL_LINKS.starkgate}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-full py-4 flex items-center justify-center gap-2 rounded-lg font-medium transition-all",
                privacyMode 
                  ? "bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-500 hover:to-accent-purple/90 text-white"
                  : "btn-glow"
              )}
            >
              {privacyMode ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  Bridge Privately
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-5 h-5" />
                  Bridge via StarkGate
                </>
              )}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Powered by */}
          <div className="px-6 py-4 border-t border-surface-border flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500">Official Starknet bridge by</span>
            <a
              href={EXTERNAL_LINKS.starkgate}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-400 hover:underline flex items-center gap-1"
            >
              StarkGate <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      )}

      {/* Swap Tab */}
      {activeTab === "swap" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <div className="p-6 space-y-5">
            {/* Privacy Mode Toggle */}
            <PrivacyModeToggle
              enabled={swapPrivacyMode}
              onToggle={setSwapPrivacyMode}
            />

            {/* From Token */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">You Pay</label>
              <div className="relative">
                <input
                  type="text"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field pr-32 text-xl"
                />
                <button
                  onClick={() => setShowFromTokenSelect(!showFromTokenSelect)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-surface-card rounded-lg hover:bg-surface-elevated transition-colors"
                >
                  <span className="text-lg">{fromToken.icon}</span>
                  <span className="text-white font-medium">{fromToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showFromTokenSelect && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-surface-card border border-surface-border rounded-xl shadow-lg z-10">
                    {swapTokens.map((t) => (
                      <button
                        key={t.symbol}
                        onClick={() => {
                          setFromToken(t);
                          setShowFromTokenSelect(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-lg">{t.icon}</span>
                        <div className="text-left">
                          <span className="text-white block">{t.symbol}</span>
                          <span className="text-xs text-gray-500">{t.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">Balance: 2.45 {fromToken.symbol}</p>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center">
              <button
                onClick={swapTokenPositions}
                className={cn(
                  "p-3 rounded-full border transition-all group",
                  swapPrivacyMode 
                    ? "bg-brand-600/20 border-brand-500/30 hover:bg-brand-600/30" 
                    : "bg-surface-elevated border-surface-border hover:border-brand-500/50 hover:bg-surface-card"
                )}
              >
                <Repeat className="w-5 h-5 text-brand-400 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* To Token */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                You Receive {swapPrivacyMode && <span className="text-brand-400">(Private)</span>}
              </label>
              <div className={cn(
                "relative rounded-xl transition-colors",
                swapPrivacyMode && "ring-1 ring-brand-500/30"
              )}>
                {swapPrivacyMode ? (
                  <div className="input-field pr-32 text-xl bg-gradient-to-r from-brand-600/10 to-accent-purple/10 flex items-center">
                    <span className="text-brand-400 font-mono tracking-widest">•••••••</span>
                    <span className="ml-2 text-xs text-brand-400/50">(encrypted)</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={swapAmount ? (parseFloat(swapAmount) * 1250).toFixed(2) : ""}
                    readOnly
                    placeholder="0.00"
                    className="input-field pr-32 text-xl bg-surface-elevated"
                  />
                )}
                <button
                  onClick={() => setShowToTokenSelect(!showToTokenSelect)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-surface-card rounded-lg hover:bg-surface-elevated transition-colors"
                >
                  <span className="text-lg">{toToken.icon}</span>
                  <span className="text-white font-medium">{toToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showToTokenSelect && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-surface-card border border-surface-border rounded-xl shadow-lg z-10">
                    {swapTokens.map((t) => (
                      <button
                        key={t.symbol}
                        onClick={() => {
                          setToToken(t);
                          setShowToTokenSelect(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-lg">{t.icon}</span>
                        <div className="text-left">
                          <span className="text-white block">{t.symbol}</span>
                          <span className="text-xs text-gray-500">{t.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Swap Info */}
            <div className={cn(
              "p-4 rounded-xl border space-y-2",
              swapPrivacyMode 
                ? "bg-brand-600/5 border-brand-500/20" 
                : "bg-surface-elevated border-surface-border"
            )}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">1 {fromToken.symbol} = 1,250 {toToken.symbol}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Price Impact</span>
                <span className="text-emerald-400">&lt;0.01%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Output Privacy</span>
                {swapPrivacyMode ? (
                  <span className="text-brand-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Encrypted
                  </span>
                ) : (
                  <span className="text-gray-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Public
                  </span>
                )}
              </div>
            </div>

            {/* Privacy Info */}
            {swapPrivacyMode && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-600/10 border border-brand-500/20">
                <Shield className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400">
                  <strong className="text-brand-400">Private Swap:</strong> The output amount will be encrypted. 
                  Nobody can see how much {toToken.symbol} you received.
                </p>
              </div>
            )}

            {/* Swap Button */}
            <a
              href={EXTERNAL_LINKS.avnu}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-full py-4 flex items-center justify-center gap-2 rounded-lg font-medium transition-all",
                swapPrivacyMode 
                  ? "bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-500 hover:to-accent-purple/90 text-white"
                  : "btn-glow"
              )}
            >
              {swapPrivacyMode ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  Swap Privately
                </>
              ) : (
                <>
                  <Repeat className="w-5 h-5" />
                  Swap on AVNU
                </>
              )}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Powered by */}
          <div className="px-6 py-4 border-t border-surface-border flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500">Best rates via</span>
            <a
              href={EXTERNAL_LINKS.avnu}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-400 hover:underline flex items-center gap-1"
            >
              AVNU DEX Aggregator <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <a
          href={EXTERNAL_LINKS.starkgate}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-5 hover:border-brand-500/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <ArrowLeftRight className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white group-hover:text-brand-400 transition-colors">StarkGate Bridge</h3>
              <p className="text-sm text-gray-400">Official L1 ↔ L2 bridge</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </div>
        </a>

        <a
          href={EXTERNAL_LINKS.avnu}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-5 hover:border-brand-500/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white group-hover:text-brand-400 transition-colors">AVNU Exchange</h3>
              <p className="text-sm text-gray-400">Best swap rates on Starknet</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </div>
        </a>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
      >
        <div className="p-4 border-b border-surface-border">
          <h3 className="font-medium text-white">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-surface-border">
          {recentBridges.map((bridge) => (
            <div key={bridge.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white">{bridge.from} → {bridge.to}</p>
                    {bridge.private && (
                      <span className="text-xs text-brand-400 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{bridge.time}</p>
                </div>
              </div>
              {bridge.private ? (
                <span className="text-brand-400 font-mono tracking-widest">•••••</span>
              ) : (
                <p className="text-white font-medium">{bridge.amount}</p>
              )}
            </div>
          ))}
          {recentBridges.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400">No recent transactions</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
