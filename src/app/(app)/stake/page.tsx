"use client";

import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import {
  Coins,
  Lock,
  Unlock,
  TrendingUp,
  Clock,
  Shield,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PrivacyBalanceCard, PrivacyOption } from "@/components/privacy/PrivacyToggle";
import { useObelyskWallet } from "@/lib/obelysk/ObelyskWalletContext";
import Link from "next/link";

// Mock staking-specific data
const mockStakingData = {
  totalStaked: "5,000", // What the user SEES is only public unless they reveal
  publicStaked: "3,200",
  // privateStaked is NEVER shown directly
  pendingUnstake: "0",
  apr: "24.5",
  lockPeriod: "7 days",
  minStake: "100",
  validatorTier: "Gold",
};

const stakingTiers = [
  { name: "Bronze", min: 100, max: 999, apr: 18, color: "text-orange-400", benefits: ["Basic validation", "Standard rewards"] },
  { name: "Silver", min: 1000, max: 4999, apr: 21, color: "text-gray-300", benefits: ["Priority jobs", "+15% rewards"] },
  { name: "Gold", min: 5000, max: 24999, apr: 24, color: "text-yellow-400", benefits: ["Premium jobs", "+25% rewards", "Early access"] },
  { name: "Diamond", min: 25000, max: Infinity, apr: 30, color: "text-cyan-400", benefits: ["Top-tier jobs", "+40% rewards", "Governance voting", "Network incentives"] },
];

export default function StakePage() {
  const { address } = useAccount();
  const { balance, isPrivateRevealed } = useObelyskWallet();
  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake");
  const [amount, setAmount] = useState("");
  const [stakePrivately, setStakePrivately] = useState(false);
  const [usePrivateBalance, setUsePrivateBalance] = useState(false);
  const [revealPrivateStake, setRevealPrivateStake] = useState(false);

  const currentTier = stakingTiers.find(
    (tier) => parseFloat(mockStakingData.publicStaked.replace(",", "")) >= tier.min
  );

  const handleWrap = async (amount: string) => {
    console.log("Wrapping", amount, "SAGE to private");
    await new Promise((r) => setTimeout(r, 2000));
  };

  const handleUnwrap = async (amount: string) => {
    console.log("Unwrapping", amount, "SAGE to public");
    await new Promise((r) => setTimeout(r, 2000));
  };

  // Use balances from Obelysk wallet
  const availableAmount = usePrivateBalance 
    ? balance.private 
    : balance.public;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stake SAGE</h1>
          <p className="text-gray-400 mt-1">
            Stake SAGE tokens to become a validator and earn rewards
          </p>
        </div>
        <Link
          href="/wallet"
          className="flex items-center gap-2 px-4 py-2 text-sm text-brand-400 hover:text-brand-300 border border-brand-500/30 rounded-xl hover:bg-brand-500/10 transition-colors"
        >
          <Wallet className="w-4 h-4" />
          Obelysk Wallet
        </Link>
      </div>

      {/* Obelysk Wallet Quick View */}
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
              <p className="text-sm text-gray-400">Available to Stake</p>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{balance.public} SAGE</span>
                <span className="text-gray-600">|</span>
                <span className="text-brand-400 font-mono text-sm flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
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
            className="text-sm text-brand-400 hover:underline"
          >
            Rollover to Private →
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Staked - Only shows PUBLIC amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-brand-400" />
            <span className="text-sm text-gray-400">Total Staked</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white">{mockStakingData.publicStaked}</p>
            <span className="text-sm text-gray-400">SAGE</span>
            <Eye className="w-3 h-3 text-gray-500 ml-1" />
          </div>
          {/* Private stake indicator - never reveal amount */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-brand-400 flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              <span className="font-mono tracking-wider">+ •••••</span>
            </span>
            <span className="text-[10px] text-gray-600">(private)</span>
          </div>
        </motion.div>

        {/* Available Balance - shows public, private is masked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Available</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white">{balance.public}</p>
            <span className="text-sm text-gray-400">SAGE</span>
            <Eye className="w-3 h-3 text-gray-500 ml-1" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-brand-400 flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              <span className="font-mono tracking-wider">+ •••••</span>
            </span>
            <span className="text-[10px] text-gray-600">(private)</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Current APR</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{mockStakingData.apr}%</p>
          <p className="text-xs text-gray-500 mt-2">{currentTier?.name} tier rewards</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">Lock Period</span>
          </div>
          <p className="text-2xl font-bold text-white">{mockStakingData.lockPeriod}</p>
          <p className="text-xs text-gray-500 mt-2">Cooldown for unstaking</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Privacy Balance Card */}
          <PrivacyBalanceCard
            publicBalance={balance.public}
            privateBalance={balance.private}
            onWrap={handleWrap}
            onUnwrap={handleUnwrap}
          />

          {/* Staking Card */}
          <div className="glass-card">
            {/* Tabs */}
            <div className="flex border-b border-surface-border">
              <button
                onClick={() => setActiveTab("stake")}
                className={cn(
                  "flex-1 px-6 py-4 text-sm font-medium transition-colors relative",
                  activeTab === "stake" ? "text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Stake
                </span>
                {activeTab === "stake" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("unstake")}
                className={cn(
                  "flex-1 px-6 py-4 text-sm font-medium transition-colors relative",
                  activeTab === "unstake" ? "text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  <Unlock className="w-4 h-4" />
                  Unstake
                </span>
                {activeTab === "unstake" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
                  />
                )}
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Privacy Options */}
              {activeTab === "stake" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PrivacyOption
                    label="Use Private Balance"
                    description="Stake from private SAGE"
                    enabled={usePrivateBalance}
                    onToggle={setUsePrivateBalance}
                  />
                  <PrivacyOption
                    label="Stake Privately"
                    description="Hide staked amount on-chain"
                    enabled={stakePrivately}
                    onToggle={setStakePrivately}
                  />
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Amount to {activeTab}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-field pr-24 text-xl"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      onClick={() => setAmount(availableAmount.replace(",", ""))}
                      className="text-xs text-brand-400 hover:text-brand-300"
                    >
                      MAX
                    </button>
                    <span className="text-gray-400">SAGE</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  {activeTab === "stake" ? (
                    usePrivateBalance ? (
                      <>
                        <EyeOff className="w-3 h-3 text-brand-400" />
                        <span>Private balance (reveal to see)</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>{balance.public} SAGE available</span>
                      </>
                    )
                  ) : (
                    `Staked: ${mockStakingData.publicStaked} SAGE (public)`
                  )}
                </p>
              </div>

              {/* Staking Info */}
              {activeTab === "stake" && (
                <div className={cn(
                  "p-4 rounded-xl border",
                  stakePrivately 
                    ? "bg-brand-600/10 border-brand-500/20" 
                    : "bg-surface-elevated/50 border-surface-border"
                )}>
                  <div className="flex items-start gap-3">
                    {stakePrivately ? (
                      <Shield className="w-5 h-5 text-brand-400 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm text-white mb-1">
                        {stakePrivately ? "Private Staking Enabled" : "Staking Requirements"}
                      </p>
                      {stakePrivately ? (
                        <p className="text-xs text-gray-400">
                          Your staked amount will be encrypted using ElGamal encryption. 
                          It will appear as <span className="font-mono text-brand-400">•••••</span> on-chain. 
                          Only you can reveal the actual amount.
                        </p>
                      ) : (
                        <ul className="text-xs text-gray-400 space-y-1">
                          <li>• Minimum stake: {mockStakingData.minStake} SAGE</li>
                          <li>• Lock period: {mockStakingData.lockPeriod}</li>
                          <li>• Must have registered GPU node</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "unstake" && (
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-white mb-1">Unstaking Notice</p>
                      <p className="text-xs text-gray-400">
                        Unstaking will begin a {mockStakingData.lockPeriod} cooldown period. 
                        During this time, you won't earn rewards on the unstaking amount.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button className={cn(
                "w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all",
                stakePrivately && activeTab === "stake"
                  ? "bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-500 hover:to-accent-purple/90 text-white"
                  : "btn-glow"
              )}>
                {activeTab === "stake" ? (
                  stakePrivately ? (
                    <><EyeOff className="w-4 h-4" /> Stake Privately</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Stake SAGE</>
                  )
                ) : (
                  <><Unlock className="w-4 h-4" /> Begin Unstaking</>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Validator Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 h-fit"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-400" />
            Validator Tiers
          </h3>
          
          <div className="space-y-3">
            {stakingTiers.map((tier) => {
              const isCurrentTier = tier.name === currentTier?.name;
              return (
                <div
                  key={tier.name}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    isCurrentTier
                      ? "bg-brand-600/10 border-brand-500/30"
                      : "bg-surface-elevated border-surface-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium", tier.color)}>{tier.name}</span>
                      {isCurrentTier && (
                        <span className="badge badge-success text-xs">Current</span>
                      )}
                    </div>
                    <span className="text-sm text-emerald-400">{tier.apr}% APR</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {tier.min.toLocaleString()} - {tier.max === Infinity ? "∞" : tier.max.toLocaleString()} SAGE
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tier.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-xs px-2 py-0.5 rounded-full bg-surface-card text-gray-400"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
