"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
  Copy,
  Check,
  Cpu,
  Activity,
  Zap,
  BarChart3,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  FileJson,
  Hash,
  Layers,
  Timer,
  Server,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Tab configuration
type TabType = "live" | "history";

// Proof status configuration
const proofStatusConfig: Record<string, {
  label: string;
  color: string;
  bg: string;
  icon: typeof CheckCircle2;
}> = {
  verified: {
    label: "Verified",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    color: "text-orange-400",
    bg: "bg-orange-500/20",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    color: "text-red-400",
    bg: "bg-red-500/20",
    icon: XCircle,
  },
  generating: {
    label: "Generating",
    color: "text-brand-400",
    bg: "bg-brand-500/20",
    icon: Activity,
  },
};

// Circuit type configuration
const circuitTypeConfig: Record<string, {
  label: string;
  color: string;
  description: string;
}> = {
  stwo_fibonacci: {
    label: "STWO Fibonacci",
    color: "text-purple-400",
    description: "Fibonacci sequence proof",
  },
  stwo_ml_inference: {
    label: "ML Inference",
    color: "text-cyan-400",
    description: "Machine learning verification",
  },
  stwo_etl: {
    label: "ETL Pipeline",
    color: "text-orange-400",
    description: "Data transformation proof",
  },
  tee_attestation: {
    label: "TEE Attestation",
    color: "text-emerald-400",
    description: "Trusted execution proof",
  },
  generic_compute: {
    label: "Generic Compute",
    color: "text-gray-400",
    description: "General computation proof",
  },
};

// Mock live proofs (currently being generated)
const mockLiveProofs = [
  {
    id: "proof_live_001",
    jobId: "job_0x9d4e5f",
    circuitType: "stwo_ml_inference",
    gpu: "NVIDIA H100",
    startedAt: Date.now() - 180000, // 3 mins ago
    estimatedDuration: 480000, // 8 mins
    progress: 65,
    currentPhase: "Constraint Evaluation",
    phases: [
      { name: "Trace Generation", status: "completed", duration: "12s" },
      { name: "Trace Commitment", status: "completed", duration: "45s" },
      { name: "Constraint Evaluation", status: "in_progress", duration: "~1m" },
      { name: "Composition Commitment", status: "pending", duration: "~1m" },
      { name: "FRI Protocol", status: "pending", duration: "~3m" },
      { name: "Query Phase", status: "pending", duration: "~30s" },
    ],
    stats: {
      constraintCount: "2,456,789",
      traceLength: "2^20",
      fieldSize: "M31 (ext: QM31)",
      memoryUsed: "48.2 GB",
      gpuUtilization: 94,
    },
  },
  {
    id: "proof_live_002",
    jobId: "job_0x1a2b3c",
    circuitType: "stwo_fibonacci",
    gpu: "NVIDIA A100",
    startedAt: Date.now() - 45000, // 45s ago
    estimatedDuration: 120000, // 2 mins
    progress: 22,
    currentPhase: "Trace Commitment",
    phases: [
      { name: "Trace Generation", status: "completed", duration: "8s" },
      { name: "Trace Commitment", status: "in_progress", duration: "~20s" },
      { name: "Constraint Evaluation", status: "pending", duration: "~15s" },
      { name: "Composition Commitment", status: "pending", duration: "~15s" },
      { name: "FRI Protocol", status: "pending", duration: "~30s" },
      { name: "Query Phase", status: "pending", duration: "~10s" },
    ],
    stats: {
      constraintCount: "65,536",
      traceLength: "2^16",
      fieldSize: "M31 (ext: QM31)",
      memoryUsed: "4.8 GB",
      gpuUtilization: 78,
    },
  },
];

// Mock historical proofs
const mockHistoricalProofs = [
  {
    id: "proof_0x4e5f6a",
    jobId: "job_0x7a2f3b",
    circuitType: "stwo_ml_inference",
    status: "verified",
    gpu: "NVIDIA H100",
    generatedAt: Date.now() - 300000,
    duration: "5m 12s",
    durationMs: 312000,
    verifiedOnChain: true,
    txHash: "0x04a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef12345678",
    proofSize: "1.2 MB",
    stats: {
      constraintCount: "2,456,789",
      traceLength: "2^20",
      fieldSize: "M31 (ext: QM31)",
    },
    client: "0x04f2...3a1b",
    reward: "1.20",
  },
  {
    id: "proof_0x8a9b0c",
    jobId: "job_0x6e7f8a",
    circuitType: "stwo_etl",
    status: "verified",
    gpu: "NVIDIA A100",
    generatedAt: Date.now() - 1800000,
    duration: "8m 22s",
    durationMs: 502000,
    verifiedOnChain: true,
    txHash: "0x05b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef123456789a",
    proofSize: "2.1 MB",
    stats: {
      constraintCount: "4,892,156",
      traceLength: "2^22",
      fieldSize: "M31 (ext: QM31)",
    },
    client: "0x09e4...1a7b",
    reward: "2.15",
  },
  {
    id: "proof_0x2d3e4f",
    jobId: "job_0x8e9f0a",
    circuitType: "stwo_fibonacci",
    status: "verified",
    gpu: "NVIDIA A100",
    generatedAt: Date.now() - 10800000,
    duration: "6m 33s",
    durationMs: 393000,
    verifiedOnChain: true,
    txHash: "0x06c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    proofSize: "0.8 MB",
    stats: {
      constraintCount: "1,245,678",
      traceLength: "2^18",
      fieldSize: "M31 (ext: QM31)",
    },
    client: "0x01d4...8b3c",
    reward: "1.65",
  },
  {
    id: "proof_0x5f6a7b",
    jobId: "job_0x2c3d4e",
    circuitType: "tee_attestation",
    status: "verified",
    gpu: "NVIDIA H100",
    generatedAt: Date.now() - 14400000,
    duration: "2m 45s",
    durationMs: 165000,
    verifiedOnChain: true,
    txHash: "0x07d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    proofSize: "0.4 MB",
    stats: {
      constraintCount: "512,000",
      traceLength: "2^14",
      fieldSize: "M31 (ext: QM31)",
    },
    client: "0x06e5...9c4d",
    reward: "0.85",
  },
  {
    id: "proof_0x9c0d1e",
    jobId: "job_0x4e5f6a",
    circuitType: "stwo_ml_inference",
    status: "failed",
    gpu: "NVIDIA RTX 4090",
    generatedAt: Date.now() - 21600000,
    duration: "1m 23s",
    durationMs: 83000,
    verifiedOnChain: false,
    txHash: null,
    proofSize: null,
    stats: {
      constraintCount: "3,245,000",
      traceLength: "2^21",
      fieldSize: "M31 (ext: QM31)",
    },
    client: "0x08f6...0d5e",
    reward: "0.00",
    errorMessage: "Out of memory during FRI computation",
  },
];

// Analytics
const analytics = {
  totalProofs: mockHistoricalProofs.length,
  verifiedProofs: mockHistoricalProofs.filter(p => p.status === "verified").length,
  avgDuration: Math.round(
    mockHistoricalProofs
      .filter(p => p.status === "verified")
      .reduce((sum, p) => sum + p.durationMs, 0) / 
    mockHistoricalProofs.filter(p => p.status === "verified").length / 1000
  ),
  totalRewards: mockHistoricalProofs
    .filter(p => p.reward !== "0.00")
    .reduce((sum, p) => sum + parseFloat(p.reward), 0)
    .toFixed(2),
};

export default function ProofsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("live");
  const [expandedProof, setExpandedProof] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [liveProofs, setLiveProofs] = useState(mockLiveProofs);

  // Simulate progress updates for live proofs
  useEffect(() => {
    if (!isAutoRefresh) return;
    
    const interval = setInterval(() => {
      setLiveProofs(prev => prev.map(proof => ({
        ...proof,
        progress: Math.min(proof.progress + Math.random() * 2, 99),
        stats: {
          ...proof.stats,
          gpuUtilization: Math.round(75 + Math.random() * 20),
        },
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const downloadProof = (proofId: string) => {
    // Mock download - in production would fetch actual proof data
    const mockProofData = {
      proof_id: proofId,
      circuit_type: "stwo",
      commitment: "0x...",
      fri_layers: [],
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(mockProofData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${proofId}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Proofs & Validation</h1>
          <p className="text-gray-400 mt-1">Monitor STWO proof generation and verification</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={cn(
              "btn-secondary flex items-center gap-2",
              isAutoRefresh && "bg-brand-600/20 border-brand-500/50"
            )}
          >
            {isAutoRefresh ? (
              <>
                <Pause className="w-4 h-4" />
                Auto-refresh ON
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Auto-refresh OFF
              </>
            )}
          </button>
          <button
            onClick={() => setLiveProofs([...mockLiveProofs])}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Shield className="w-4 h-4" />
            Total Proofs
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalProofs}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <CheckCircle2 className="w-4 h-4" />
            Verified
          </div>
          <p className="text-2xl font-bold text-emerald-400">{analytics.verifiedProofs}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Timer className="w-4 h-4" />
            Avg Generation
          </div>
          <p className="text-2xl font-bold text-white">{Math.floor(analytics.avgDuration / 60)}m {analytics.avgDuration % 60}s</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Zap className="w-4 h-4" />
            Proof Rewards
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalRewards} <span className="text-sm text-gray-400">SAGE</span></p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("live")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
            activeTab === "live"
              ? "bg-brand-600 text-white"
              : "bg-surface-elevated text-gray-400 hover:text-white"
          )}
        >
          <Activity className={cn("w-4 h-4", activeTab === "live" && "animate-pulse")} />
          Live ({liveProofs.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
            activeTab === "history"
              ? "bg-brand-600 text-white"
              : "bg-surface-elevated text-gray-400 hover:text-white"
          )}
        >
          <Clock className="w-4 h-4" />
          History ({mockHistoricalProofs.length})
        </button>
      </div>

      {/* Live Proofs Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "live" && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {liveProofs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No proofs currently generating</p>
                <p className="text-sm text-gray-500 mt-1">New proofs will appear here when jobs start</p>
              </div>
            ) : (
              liveProofs.map((proof, idx) => {
                const circuitConfig = circuitTypeConfig[proof.circuitType] || circuitTypeConfig.generic_compute;
                const elapsed = Date.now() - proof.startedAt;
                const remaining = Math.max(0, proof.estimatedDuration - elapsed);

                return (
                  <motion.div
                    key={proof.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-surface-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center">
                              <Shield className="w-6 h-6 text-brand-400" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                              <Activity className="w-2.5 h-2.5 text-white animate-pulse" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/proofs/${proof.id}`}
                                className="text-white font-mono font-medium hover:text-brand-400 transition-colors"
                              >
                                {proof.id}
                              </Link>
                              <span className={cn("text-xs px-2 py-0.5 rounded-full", circuitConfig.color, "bg-white/5")}>
                                {circuitConfig.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-0.5">
                              Job: {proof.jobId} • {proof.gpu}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Link
                            href={`/proofs/${proof.id}`}
                            className="text-2xl font-bold text-white hover:text-brand-400 transition-colors"
                          >
                            {Math.round(proof.progress)}%
                          </Link>
                          <p className="text-sm text-gray-400">~{formatDuration(remaining)} remaining</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-4 py-3 bg-surface-elevated/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Current Phase: <span className="text-white">{proof.currentPhase}</span></span>
                        <span className="text-sm text-gray-500">Started {formatTimeAgo(proof.startedAt)}</span>
                      </div>
                      <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${proof.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Phases */}
                    <div className="p-4 border-t border-surface-border/50">
                      <p className="text-sm font-medium text-gray-400 mb-3">Proof Generation Phases</p>
                      <div className="flex items-center gap-2">
                        {proof.phases.map((phase, i) => (
                          <div key={phase.name} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                                  phase.status === "completed" && "bg-emerald-500/20 text-emerald-400",
                                  phase.status === "in_progress" && "bg-brand-500/20 text-brand-400 ring-2 ring-brand-500/50",
                                  phase.status === "pending" && "bg-surface-elevated text-gray-500"
                                )}
                              >
                                {phase.status === "completed" ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : phase.status === "in_progress" ? (
                                  <Activity className="w-4 h-4 animate-pulse" />
                                ) : (
                                  i + 1
                                )}
                              </div>
                              <span className={cn(
                                "text-xs mt-1 max-w-[80px] text-center truncate",
                                phase.status === "in_progress" ? "text-brand-400" : "text-gray-500"
                              )}>
                                {phase.name}
                              </span>
                              <span className="text-xs text-gray-600">{phase.duration}</span>
                            </div>
                            {i < proof.phases.length - 1 && (
                              <div
                                className={cn(
                                  "h-0.5 w-8 mx-1 mt-[-20px]",
                                  phase.status === "completed" ? "bg-emerald-500/50" : "bg-surface-border"
                                )}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-4 bg-surface-elevated/30 border-t border-surface-border/50">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Constraints</p>
                          <p className="text-white font-mono">{proof.stats.constraintCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Trace Length</p>
                          <p className="text-white font-mono">{proof.stats.traceLength}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Field</p>
                          <p className="text-white font-mono">{proof.stats.fieldSize}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Memory</p>
                          <p className="text-white font-mono">{proof.stats.memoryUsed}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">GPU Usage</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-500 rounded-full transition-all"
                                style={{ width: `${proof.stats.gpuUtilization}%` }}
                              />
                            </div>
                            <span className="text-white font-mono text-xs">{proof.stats.gpuUtilization}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card overflow-hidden"
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-surface-border text-sm font-medium text-gray-400 bg-surface-elevated/50">
              <div className="col-span-2">Proof ID</div>
              <div className="col-span-2">Circuit Type</div>
              <div className="col-span-2">GPU</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Reward</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Proof Rows */}
            <div className="divide-y divide-surface-border/50">
              {mockHistoricalProofs.map((proof, idx) => {
                const statusConf = proofStatusConfig[proof.status];
                const circuitConf = circuitTypeConfig[proof.circuitType] || circuitTypeConfig.generic_compute;
                const StatusIcon = statusConf?.icon || Clock;
                const isExpanded = expandedProof === proof.id;

                return (
                  <motion.div
                    key={proof.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    {/* Main Row */}
                    <div
                      className={cn(
                        "grid grid-cols-12 gap-4 p-4 items-center cursor-pointer transition-colors",
                        isExpanded ? "bg-surface-elevated" : "hover:bg-surface-elevated/50"
                      )}
                      onClick={() => setExpandedProof(isExpanded ? null : proof.id)}
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        <Shield className={cn("w-4 h-4", statusConf?.color)} />
                        <Link
                          href={`/proofs/${proof.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-white font-mono hover:text-brand-400 transition-colors"
                        >
                          {proof.id}
                        </Link>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>

                      <div className="col-span-2">
                        <span className={cn("text-sm", circuitConf.color)}>{circuitConf.label}</span>
                      </div>

                      <div className="col-span-2 text-gray-300 text-sm">
                        {proof.gpu}
                      </div>

                      <div className="col-span-1 text-gray-300 text-sm">
                        {proof.duration}
                      </div>

                      <div className="col-span-2 flex items-center gap-2">
                        <span className={cn(
                          "badge flex items-center gap-1",
                          statusConf?.bg,
                          statusConf?.color
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConf?.label}
                        </span>
                        {proof.verifiedOnChain && (
                          <span className="text-xs text-emerald-400">On-chain</span>
                        )}
                      </div>

                      <div className="col-span-2">
                        {proof.reward !== "0.00" ? (
                          <span className="text-emerald-400 font-medium">+{proof.reward} SAGE</span>
                        ) : (
                          <span className="text-red-400">0.00 SAGE</span>
                        )}
                      </div>

                      <div className="col-span-1 flex items-center gap-2 justify-end">
                        {proof.txHash && (
                          <a
                            href={`https://sepolia.starkscan.co/tx/${proof.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-400 hover:text-brand-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {proof.status === "verified" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadProof(proof.id);
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 bg-surface-elevated/50 border-t border-surface-border/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {/* Job ID */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Job ID</p>
                                <code className="text-xs text-gray-300 font-mono">
                                  {proof.jobId}
                                </code>
                              </div>

                              {/* Tx Hash */}
                              {proof.txHash && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                                  <div className="flex items-center gap-2">
                                    <code className="text-xs text-gray-300 font-mono truncate max-w-[150px]">
                                      {proof.txHash.slice(0, 18)}...
                                    </code>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(proof.txHash!, `tx-${proof.id}`);
                                      }}
                                      className="text-gray-500 hover:text-white"
                                    >
                                      {copiedHash === `tx-${proof.id}` ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Proof Size */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Proof Size</p>
                                <code className="text-xs text-gray-300 font-mono">
                                  {proof.proofSize || "—"}
                                </code>
                              </div>

                              {/* Client */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Client</p>
                                <code className="text-xs text-gray-300 font-mono">
                                  {proof.client}
                                </code>
                              </div>

                              {/* Constraints */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Constraints</p>
                                <code className="text-xs text-gray-300 font-mono">
                                  {proof.stats.constraintCount}
                                </code>
                              </div>

                              {/* Trace Length */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Trace Length</p>
                                <code className="text-xs text-gray-300 font-mono">
                                  {proof.stats.traceLength}
                                </code>
                              </div>

                              {/* Field Size */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Field</p>
                                <code className="text-xs text-gray-300 font-mono">
                                  {proof.stats.fieldSize}
                                </code>
                              </div>

                              {/* Generated At */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Generated</p>
                                <p className="text-xs text-gray-300">
                                  {new Date(proof.generatedAt).toLocaleString()} ({formatTimeAgo(proof.generatedAt)})
                                </p>
                              </div>

                              {/* Error Message (if failed) */}
                              {proof.status === "failed" && proof.errorMessage && (
                                <div className="col-span-2">
                                  <p className="text-xs text-gray-500 mb-1">Error</p>
                                  <p className="text-xs text-red-400">
                                    {proof.errorMessage}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-surface-border/50">
                              <Link
                                href={`/proofs/${proof.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="btn-primary text-sm flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Full Details
                              </Link>
                              {proof.status === "verified" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadProof(proof.id);
                                  }}
                                  className="btn-secondary text-sm flex items-center gap-2"
                                >
                                  <FileJson className="w-4 h-4" />
                                  Download JSON
                                </button>
                              )}
                              {proof.txHash && (
                                <a
                                  href={`https://sepolia.starkscan.co/tx/${proof.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-secondary text-sm flex items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Starkscan
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {mockHistoricalProofs.length === 0 && (
              <div className="p-12 text-center">
                <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No proof history yet</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
