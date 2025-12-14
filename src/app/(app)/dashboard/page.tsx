"use client";

import { useAccount } from "@starknet-react/core";
import {
  Cpu,
  Zap,
  TrendingUp,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Shield,
  Thermometer,
  HardDrive,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock data - will be replaced with real API calls
const mockValidatorStatus = {
  isActive: true,
  stakedAmount: "5,000",
  totalEarnings: "1,245.50",
  pendingRewards: "45.25",
  uptime: "99.8%",
  jobsCompleted: 156,
  jobsInProgress: 3,
  reputation: 98,
};

const mockGPUs = [
  {
    id: "gpu_001",
    name: "NVIDIA H100",
    status: "active",
    utilization: 87,
    temperature: 72,
    memory: { used: 68, total: 80 },
    earnings24h: "12.50",
    jobsToday: 24,
  },
  {
    id: "gpu_002",
    name: "NVIDIA A100",
    status: "active",
    utilization: 45,
    temperature: 65,
    memory: { used: 32, total: 80 },
    earnings24h: "8.25",
    jobsToday: 18,
  },
  {
    id: "gpu_003",
    name: "NVIDIA RTX 4090",
    status: "idle",
    utilization: 0,
    temperature: 42,
    memory: { used: 2, total: 24 },
    earnings24h: "0.00",
    jobsToday: 0,
  },
];

const mockRecentActivity = [
  {
    id: "job_001",
    type: "AI Inference",
    status: "completed",
    reward: "0.85",
    duration: "2m 34s",
    timestamp: Date.now() - 300000,
  },
  {
    id: "job_002",
    type: "ZK Proof Generation",
    status: "completed",
    reward: "1.20",
    duration: "5m 12s",
    timestamp: Date.now() - 900000,
  },
  {
    id: "job_003",
    type: "Data Pipeline",
    status: "running",
    reward: "—",
    duration: "3m 45s",
    timestamp: Date.now() - 225000,
  },
];

const statusConfig = {
  active: { color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Active" },
  idle: { color: "text-orange-400", bg: "bg-orange-500/20", label: "Idle" },
  offline: { color: "text-red-400", bg: "bg-red-500/20", label: "Offline" },
  running: { color: "text-brand-400", bg: "bg-brand-500/20", label: "Running" },
  completed: { color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Completed" },
};

export default function DashboardPage() {
  const { address } = useAccount();

  const formatAddress = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Validator Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Welcome back, {address ? formatAddress(address) : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/docs" className="btn-secondary flex items-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">
            <span className="hidden sm:inline">Add GPU</span>
            <span className="sm:hidden">Add</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link href="/stake" className="btn-glow flex items-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Stake More</span>
            <span className="sm:hidden">Stake</span>
          </Link>
        </div>
      </div>

      {/* Validator Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-xl bg-emerald-500/20">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-white">Validator Status</h2>
                <span className="badge badge-success text-xs">Active</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Your node is validating on Starknet Sepolia
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right ml-auto sm:ml-0">
            <p className="text-xs sm:text-sm text-gray-400">Reputation Score</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{mockValidatorStatus.reputation}%</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 rounded-lg bg-brand-500/20">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400" />
            </div>
            <span className="text-emerald-400 text-xs sm:text-sm flex items-center gap-1">
              <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Live
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{mockGPUs.length}</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Connected GPUs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {mockValidatorStatus.stakedAmount} <span className="text-sm sm:text-lg text-gray-400">SAGE</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Total Staked</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-xs sm:text-sm">+12.5%</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {mockValidatorStatus.totalEarnings} <span className="text-sm sm:text-lg text-gray-400">SAGE</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Total Earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            </div>
            <Link href="/earnings" className="text-brand-400 text-xs sm:text-sm hover:underline">
              Claim
            </Link>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {mockValidatorStatus.pendingRewards} <span className="text-sm sm:text-lg text-gray-400">SAGE</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Pending Rewards</p>
        </motion.div>
      </div>

      {/* GPU Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-white">Your GPUs</h2>
          <Link
            href="/docs"
            className="text-xs sm:text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span className="hidden sm:inline">Add more GPUs</span>
            <span className="sm:hidden">Add GPU</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockGPUs.map((gpu, idx) => {
            const status = statusConfig[gpu.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={gpu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="glass-card p-4 sm:p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-surface-elevated">
                      <Server className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-white">{gpu.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{gpu.id}</p>
                    </div>
                  </div>
                  <span className={`badge text-[10px] sm:text-xs ${status.bg} ${status.color} border border-current/30`}>
                    {status.label}
                  </span>
                </div>

                {/* GPU Stats */}
                <div className="space-y-3">
                  {/* Utilization */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Utilization</span>
                      <span className="text-white">{gpu.utilization}%</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan rounded-full transition-all"
                        style={{ width: `${gpu.utilization}%` }}
                      />
                    </div>
                  </div>

                  {/* Memory */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400 flex items-center gap-1">
                        <HardDrive className="w-3 h-3" /> Memory
                      </span>
                      <span className="text-white">{gpu.memory.used}/{gpu.memory.total} GB</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${(gpu.memory.used / gpu.memory.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3" /> Temperature
                    </span>
                    <span className={gpu.temperature > 80 ? "text-red-400" : "text-white"}>
                      {gpu.temperature}°C
                    </span>
                  </div>
                </div>

                {/* GPU Earnings */}
                <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">24h Earnings</p>
                    <p className="text-base sm:text-lg font-semibold text-white">{gpu.earnings24h} SAGE</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] sm:text-xs text-gray-500">Jobs Today</p>
                    <p className="text-base sm:text-lg font-semibold text-white">{gpu.jobsToday}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
      >
        <div className="p-4 sm:p-6 border-b border-surface-border flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-white">Recent Activity</h2>
          <Link
            href="/jobs"
            className="text-xs sm:text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span className="hidden sm:inline">View All Jobs</span>
            <span className="sm:hidden">All</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-surface-border">
          {mockRecentActivity.map((activity) => {
            const status = statusConfig[activity.status as keyof typeof statusConfig];
            return (
              <div
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-surface-elevated/50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${status.bg} flex-shrink-0`}>
                    {activity.status === "completed" ? (
                      <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${status.color}`} />
                    ) : (
                      <Activity className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${status.color} animate-pulse`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium text-white truncate">{activity.type}</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{activity.id} • {activity.duration}</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-0 ml-auto sm:ml-0 flex-shrink-0">
                  <p className="text-sm sm:text-base text-white font-medium">
                    {activity.reward !== "—" ? `+${activity.reward} SAGE` : "—"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">{status.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
