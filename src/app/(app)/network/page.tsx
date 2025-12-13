"use client";

import {
  Globe,
  Server,
  Cpu,
  Activity,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock network data
const networkStats = {
  totalValidators: 247,
  activeValidators: 234,
  totalGPUs: 1284,
  totalStaked: "12,450,000",
  jobsProcessed24h: 15420,
  avgResponseTime: "2.3s",
  networkUptime: "99.97%",
  currentEpoch: 1245,
};

const gpuDistribution = [
  { type: "H100", count: 145, percentage: 11.3, color: "bg-brand-500" },
  { type: "A100", count: 412, percentage: 32.1, color: "bg-purple-500" },
  { type: "RTX 4090", count: 387, percentage: 30.1, color: "bg-emerald-500" },
  { type: "RTX 3090", count: 198, percentage: 15.4, color: "bg-orange-500" },
  { type: "Other", count: 142, percentage: 11.1, color: "bg-gray-500" },
];

const topValidators = [
  { rank: 1, address: "0x1234...abcd", gpus: 24, staked: "125,000", uptime: "100%", reputation: 100 },
  { rank: 2, address: "0x5678...efgh", gpus: 18, staked: "98,000", uptime: "99.9%", reputation: 99 },
  { rank: 3, address: "0x9abc...ijkl", gpus: 16, staked: "87,500", uptime: "99.8%", reputation: 98 },
  { rank: 4, address: "0xdefg...mnop", gpus: 12, staked: "65,000", uptime: "99.7%", reputation: 97 },
  { rank: 5, address: "0xhijk...qrst", gpus: 10, staked: "52,000", uptime: "99.5%", reputation: 96 },
];

const recentBlocks = [
  { epoch: 1245, validators: 234, jobs: 156, time: "12s ago" },
  { epoch: 1244, validators: 233, jobs: 142, time: "24s ago" },
  { epoch: 1243, validators: 234, jobs: 168, time: "36s ago" },
  { epoch: 1242, validators: 232, jobs: 151, time: "48s ago" },
];

export default function NetworkPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Network Overview</h1>
        <p className="text-gray-400 mt-1">
          Real-time status of the BitSage validator network
        </p>
      </div>

      {/* Network Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <Globe className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">Network Status</h2>
              <span className="badge badge-success">Healthy</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              All systems operational • Epoch {networkStats.currentEpoch}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Uptime</p>
            <p className="text-2xl font-bold text-emerald-400">{networkStats.networkUptime}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-brand-400" />
            <span className="text-sm text-gray-400">Validators</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {networkStats.activeValidators}
            <span className="text-sm text-gray-500 font-normal">/{networkStats.totalValidators}</span>
          </p>
          <p className="text-sm text-emerald-400 mt-1">Active now</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Total GPUs</span>
          </div>
          <p className="text-2xl font-bold text-white">{networkStats.totalGPUs.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Connected to network</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">Total Staked</span>
          </div>
          <p className="text-2xl font-bold text-white">{networkStats.totalStaked}</p>
          <p className="text-sm text-gray-500 mt-1">SAGE tokens</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Jobs (24h)</span>
          </div>
          <p className="text-2xl font-bold text-white">{networkStats.jobsProcessed24h.toLocaleString()}</p>
          <p className="text-sm text-emerald-400 mt-1">+8.5% vs yesterday</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPU Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-400" />
            GPU Distribution
          </h3>
          <div className="space-y-4">
            {gpuDistribution.map((gpu, idx) => (
              <div key={gpu.type}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white">{gpu.type}</span>
                  <span className="text-gray-400">{gpu.count} ({gpu.percentage}%)</span>
                </div>
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gpu.percentage}%` }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                    className={cn("h-full rounded-full", gpu.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Epochs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-400" />
            Recent Epochs
          </h3>
          <div className="space-y-3">
            {recentBlocks.map((block, idx) => (
              <div
                key={block.epoch}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Epoch {block.epoch}</p>
                    <p className="text-xs text-gray-500">{block.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{block.jobs} jobs</p>
                  <p className="text-xs text-gray-500">{block.validators} validators</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Network Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            Performance
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-elevated">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Avg Response Time</span>
                <span className="text-emerald-400 font-medium">{networkStats.avgResponseTime}</span>
              </div>
              <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                <div className="h-full w-[15%] bg-emerald-500 rounded-full" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: &lt;5s</p>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Job Success Rate</span>
                <span className="text-emerald-400 font-medium">98.7%</span>
              </div>
              <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                <div className="h-full w-[98.7%] bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">TEE Attestation</span>
                <span className="text-brand-400 font-medium">87.2%</span>
              </div>
              <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                <div className="h-full w-[87.2%] bg-brand-500 rounded-full" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Of validators with TEE</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Validators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card"
      >
        <div className="p-6 border-b border-surface-border">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-400" />
            Top Validators
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left p-4 text-sm font-medium text-gray-400">Rank</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Validator</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">GPUs</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Staked</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Uptime</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Reputation</th>
              </tr>
            </thead>
            <tbody>
              {topValidators.map((validator, idx) => (
                <tr
                  key={validator.address}
                  className="border-b border-surface-border/50 hover:bg-surface-elevated/50 transition-colors"
                >
                  <td className="p-4">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      idx === 0 ? "bg-yellow-500/20 text-yellow-400" :
                      idx === 1 ? "bg-gray-400/20 text-gray-300" :
                      idx === 2 ? "bg-orange-500/20 text-orange-400" :
                      "bg-surface-elevated text-gray-400"
                    )}>
                      {validator.rank}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-white font-mono">{validator.address}</span>
                  </td>
                  <td className="p-4 text-white">{validator.gpus}</td>
                  <td className="p-4 text-white">{validator.staked} SAGE</td>
                  <td className="p-4 text-emerald-400">{validator.uptime}</td>
                  <td className="p-4">
                    <span className="badge badge-success">{validator.reputation}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
