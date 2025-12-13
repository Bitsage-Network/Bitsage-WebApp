"use client";

import { useState } from "react";
import {
  TrendingUp,
  Download,
  Calendar,
  Coins,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  BarChart3,
  Eye,
  EyeOff,
  Shield,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PrivacyBalanceCard, PrivacyOption } from "@/components/privacy/PrivacyToggle";

// Mock earnings data
const mockEarningsData = {
  totalEarnings: "1,245.50",
  pendingRewards: "45.25",
  claimedRewards: "1,200.25",
  last24h: "32.50",
  last7d: "185.75",
  last30d: "612.00",
  // Privacy balances
  publicBalance: "892.30",
  privateBalance: "353.20",
};

const mockEarningsHistory = [
  { id: "e_001", type: "Validation Reward", amount: "12.50", status: "claimed", date: "Dec 11, 2024", txHash: "0x1234...abcd", private: false },
  { id: "e_002", type: "Job Completion", amount: "8.75", status: "claimed", date: "Dec 11, 2024", txHash: "0x5678...efgh", private: true },
  { id: "e_003", type: "Validation Reward", amount: "15.00", status: "pending", date: "Dec 11, 2024", txHash: null, private: false },
  { id: "e_004", type: "Bonus Reward", amount: "25.00", status: "claimed", date: "Dec 10, 2024", txHash: "0x9abc...ijkl", private: true },
  { id: "e_005", type: "Validation Reward", amount: "11.25", status: "claimed", date: "Dec 10, 2024", txHash: "0xdefg...mnop", private: false },
  { id: "e_006", type: "Job Completion", amount: "9.50", status: "claimed", date: "Dec 9, 2024", txHash: "0xhijk...qrst", private: false },
];

const chartData = [
  { day: "Mon", amount: 28 },
  { day: "Tue", amount: 35 },
  { day: "Wed", amount: 22 },
  { day: "Thu", amount: 42 },
  { day: "Fri", amount: 38 },
  { day: "Sat", amount: 25 },
  { day: "Sun", amount: 32 },
];

export default function EarningsPage() {
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [claimPrivately, setClaimPrivately] = useState(false);

  const maxAmount = Math.max(...chartData.map((d) => d.amount));

  const handleWrap = async (amount: string) => {
    // Mock - would call smart contract
    console.log("Wrapping", amount, "SAGE to private");
    await new Promise((r) => setTimeout(r, 2000));
  };

  const handleUnwrap = async (amount: string) => {
    // Mock - would call smart contract
    console.log("Unwrapping", amount, "SAGE to public");
    await new Promise((r) => setTimeout(r, 2000));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Earnings</h1>
          <p className="text-gray-400 mt-1">Track your validation rewards</p>
        </div>
        <button className={cn(
          "btn-glow flex items-center gap-2",
          claimPrivately && "bg-gradient-to-r from-brand-600 to-accent-purple"
        )}>
          {claimPrivately ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Coins className="w-4 h-4" />
          )}
          Claim {claimPrivately ? "Privately" : "All"} ({mockEarningsData.pendingRewards} SAGE)
        </button>
      </div>

      {/* Privacy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Privacy Balances */}
        <div className="lg:col-span-2">
          <PrivacyBalanceCard
            publicBalance={mockEarningsData.publicBalance}
            privateBalance={mockEarningsData.privateBalance}
            onWrap={handleWrap}
            onUnwrap={handleUnwrap}
          />
        </div>

        {/* Claim Options */}
        <div className="space-y-4">
          <PrivacyOption
            label="Claim Rewards Privately"
            description="Receive earnings to private balance"
            enabled={claimPrivately}
            onToggle={setClaimPrivately}
          />
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-white">Privacy Status</span>
            </div>
            <p className="text-xs text-gray-400">
              {claimPrivately 
                ? "New rewards will be encrypted and added to your private balance."
                : "Rewards will be claimed to your public balance (visible on-chain)."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            <span className="text-sm text-gray-400">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-white">{mockEarningsData.totalEarnings} <span className="text-sm text-gray-400">SAGE</span></p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-orange-400">{mockEarningsData.pendingRewards} <span className="text-sm text-gray-500">SAGE</span></p>
          <p className="text-xs text-gray-500 mt-1">Ready to claim</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Last 24h</span>
          </div>
          <p className="text-2xl font-bold text-white">{mockEarningsData.last24h} <span className="text-sm text-gray-400">SAGE</span></p>
          <p className="text-xs text-emerald-400 mt-1">+12.5% vs yesterday</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-white">{mockEarningsData.last30d} <span className="text-sm text-gray-400">SAGE</span></p>
          <p className="text-xs text-gray-500 mt-1">December 2024</p>
        </motion.div>
      </div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Earnings Overview</h3>
          <div className="flex gap-2">
            {(["24h", "7d", "30d", "all"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors",
                  timeFilter === filter
                    ? "bg-brand-600 text-white"
                    : "bg-surface-elevated text-gray-400 hover:text-white"
                )}
              >
                {filter === "all" ? "All" : filter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-40 flex items-end gap-4">
          {chartData.map((data, idx) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-gray-500">{data.amount}</div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.amount / maxAmount) * 100}%` }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg min-h-[4px]"
              />
              <span className="text-xs text-gray-500">{data.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Earnings History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
      >
        <div className="p-5 border-b border-surface-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Earnings History</h3>
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Privacy</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {mockEarningsHistory.map((earning, idx) => (
                <motion.tr
                  key={earning.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-surface-border/50 hover:bg-surface-elevated/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand-500/20">
                        <Coins className="w-4 h-4 text-brand-400" />
                      </div>
                      <span className="text-white">{earning.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {earning.private ? (
                      <span className="text-brand-400 font-mono tracking-wider">+••••••</span>
                    ) : (
                      <span className="text-white font-medium">+{earning.amount} SAGE</span>
                    )}
                  </td>
                  <td className="p-4">
                    {earning.private ? (
                      <span className="badge bg-brand-500/20 text-brand-400 flex items-center gap-1 w-fit">
                        <EyeOff className="w-3 h-3" />
                        Private
                      </span>
                    ) : (
                      <span className="badge bg-surface-elevated text-gray-400 flex items-center gap-1 w-fit">
                        <Eye className="w-3 h-3" />
                        Public
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {earning.status === "claimed" ? (
                      <span className="badge badge-success flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        Claimed
                      </span>
                    ) : (
                      <span className="badge badge-warning flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">{earning.date}</td>
                  <td className="p-4 text-right">
                    {earning.txHash ? (
                      earning.private ? (
                        <span className="text-gray-500 text-sm flex items-center gap-1 justify-end">
                          <Lock className="w-3 h-3" />
                          Encrypted
                        </span>
                      ) : (
                        <a
                          href={`https://sepolia.starkscan.co/tx/${earning.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-400 hover:underline text-sm flex items-center gap-1 justify-end"
                        >
                          {earning.txHash} <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
