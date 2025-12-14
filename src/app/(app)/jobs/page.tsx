"use client";

import { useState } from "react";
import {
  Briefcase,
  Filter,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Cpu,
  Clock,
  Zap,
  Shield,
  Database,
  Brain,
  BarChart3,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Job type configuration
const jobTypeConfig = {
  ai_inference: { 
    icon: Brain, 
    label: "AI Inference", 
    color: "text-purple-400", 
    bg: "bg-purple-500/20" 
  },
  zk_proof: { 
    icon: Shield, 
    label: "ZK Proof", 
    color: "text-brand-400", 
    bg: "bg-brand-500/20" 
  },
  data_pipeline: { 
    icon: Database, 
    label: "Data Pipeline", 
    color: "text-cyan-400", 
    bg: "bg-cyan-500/20" 
  },
  ml_training: { 
    icon: Cpu, 
    label: "ML Training", 
    color: "text-orange-400", 
    bg: "bg-orange-500/20" 
  },
  rendering: { 
    icon: BarChart3, 
    label: "Rendering", 
    color: "text-pink-400", 
    bg: "bg-pink-500/20" 
  },
};

const statusConfig: Record<string, { 
  icon: typeof CheckCircle2; 
  label: string; 
  color: string; 
  bg: string;
  animate?: boolean;
}> = {
  completed: { 
    icon: CheckCircle2, 
    label: "Completed", 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/20" 
  },
  running: { 
    icon: Loader2, 
    label: "Running", 
    color: "text-brand-400", 
    bg: "bg-brand-500/20",
    animate: true 
  },
  failed: { 
    icon: XCircle, 
    label: "Failed", 
    color: "text-red-400", 
    bg: "bg-red-500/20" 
  },
  pending: { 
    icon: Clock, 
    label: "Pending", 
    color: "text-orange-400", 
    bg: "bg-orange-500/20" 
  },
};

// Extended mock data for job history
const mockJobs = [
  {
    id: "job_0x7a2f3b",
    type: "zk_proof",
    status: "completed",
    gpu: { id: "gpu_001", name: "NVIDIA H100" },
    duration: "5m 12s",
    durationMs: 312000,
    earned: "1.20",
    timestamp: Date.now() - 300000,
    inputHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    outputHash: "0x9876543210fedcba0987654321fedcba09876543",
    proofId: "proof_0x4e5f6a",
    gasUsed: "1,245,000",
    client: "0x04f2...3a1b",
  },
  {
    id: "job_0x3b1c4d",
    type: "ai_inference",
    status: "completed",
    gpu: { id: "gpu_001", name: "NVIDIA H100" },
    duration: "2m 34s",
    durationMs: 154000,
    earned: "0.85",
    timestamp: Date.now() - 900000,
    inputHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    outputHash: "0xa987654321fedcba0987654321fedcba09876543",
    proofId: null,
    gasUsed: "892,000",
    client: "0x07d1...8c2e",
  },
  {
    id: "job_0x9d4e5f",
    type: "data_pipeline",
    status: "running",
    gpu: { id: "gpu_002", name: "NVIDIA A100" },
    duration: "3m 45s",
    durationMs: 225000,
    earned: "—",
    timestamp: Date.now() - 225000,
    inputHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
    outputHash: null,
    proofId: null,
    gasUsed: "—",
    client: "0x02a3...5f4d",
  },
  {
    id: "job_0x6e7f8a",
    type: "zk_proof",
    status: "completed",
    gpu: { id: "gpu_002", name: "NVIDIA A100" },
    duration: "8m 22s",
    durationMs: 502000,
    earned: "2.15",
    timestamp: Date.now() - 1800000,
    inputHash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
    outputHash: "0xb876543210fedcba0987654321fedcba09876543",
    proofId: "proof_0x8a9b0c",
    gasUsed: "2,156,000",
    client: "0x09e4...1a7b",
  },
  {
    id: "job_0x1b2c3d",
    type: "ml_training",
    status: "completed",
    gpu: { id: "gpu_001", name: "NVIDIA H100" },
    duration: "45m 18s",
    durationMs: 2718000,
    earned: "8.50",
    timestamp: Date.now() - 3600000,
    inputHash: "0x5e6f7890abcdef1234567890abcdef1234567890",
    outputHash: "0xc765432109fedcba0987654321fedcba09876543",
    proofId: null,
    gasUsed: "12,450,000",
    client: "0x03b2...6e9c",
  },
  {
    id: "job_0x4c5d6e",
    type: "ai_inference",
    status: "failed",
    gpu: { id: "gpu_003", name: "NVIDIA RTX 4090" },
    duration: "0m 45s",
    durationMs: 45000,
    earned: "0.00",
    timestamp: Date.now() - 5400000,
    inputHash: "0x6f7890abcdef1234567890abcdef123456789012",
    outputHash: null,
    proofId: null,
    gasUsed: "125,000",
    client: "0x05c3...7d8e",
    errorMessage: "Out of memory",
  },
  {
    id: "job_0x7d8e9f",
    type: "rendering",
    status: "completed",
    gpu: { id: "gpu_001", name: "NVIDIA H100" },
    duration: "12m 05s",
    durationMs: 725000,
    earned: "3.25",
    timestamp: Date.now() - 7200000,
    inputHash: "0x7890abcdef1234567890abcdef12345678901234",
    outputHash: "0xd654321098fedcba0987654321fedcba09876543",
    proofId: null,
    gasUsed: "4,125,000",
    client: "0x08f5...2a9d",
  },
  {
    id: "job_0x8e9f0a",
    type: "zk_proof",
    status: "completed",
    gpu: { id: "gpu_002", name: "NVIDIA A100" },
    duration: "6m 33s",
    durationMs: 393000,
    earned: "1.65",
    timestamp: Date.now() - 10800000,
    inputHash: "0x890abcdef1234567890abcdef1234567890123456",
    outputHash: "0xe543210987fedcba0987654321fedcba09876543",
    proofId: "proof_0x2d3e4f",
    gasUsed: "1,890,000",
    client: "0x01d4...8b3c",
  },
];

// Analytics calculations
const analytics = {
  totalJobs: mockJobs.length,
  completedJobs: mockJobs.filter(j => j.status === "completed").length,
  totalEarnings: mockJobs
    .filter(j => j.earned !== "—" && j.earned !== "0.00")
    .reduce((sum, j) => sum + parseFloat(j.earned), 0)
    .toFixed(2),
  avgDuration: Math.round(
    mockJobs
      .filter(j => j.status === "completed")
      .reduce((sum, j) => sum + j.durationMs, 0) / 
    mockJobs.filter(j => j.status === "completed").length / 1000
  ),
  successRate: Math.round(
    (mockJobs.filter(j => j.status === "completed").length / 
    mockJobs.filter(j => j.status !== "running" && j.status !== "pending").length) * 100
  ),
};

// Chart data for last 7 days
const chartData = [
  { day: "Mon", jobs: 18, earnings: 15.5 },
  { day: "Tue", jobs: 24, earnings: 22.3 },
  { day: "Wed", jobs: 12, earnings: 10.8 },
  { day: "Thu", jobs: 32, earnings: 28.5 },
  { day: "Fri", jobs: 28, earnings: 25.2 },
  { day: "Sat", jobs: 15, earnings: 12.4 },
  { day: "Sun", jobs: 22, earnings: 18.9 },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gpuFilter, setGpuFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("7d");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Filter jobs
  const filteredJobs = mockJobs.filter(job => {
    if (searchQuery && !job.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (typeFilter !== "all" && job.type !== typeFilter) return false;
    if (statusFilter !== "all" && job.status !== statusFilter) return false;
    if (gpuFilter !== "all" && job.gpu.id !== gpuFilter) return false;
    return true;
  });

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const exportToCSV = () => {
    const headers = ["Job ID", "Type", "Status", "GPU", "Duration", "Earned (SAGE)", "Timestamp"];
    const rows = filteredJobs.map(job => [
      job.id,
      jobTypeConfig[job.type as keyof typeof jobTypeConfig]?.label || job.type,
      job.status,
      job.gpu.name,
      job.duration,
      job.earned,
      new Date(job.timestamp).toISOString(),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bitsage-jobs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const maxJobs = Math.max(...chartData.map(d => d.jobs));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Job History</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">View all jobs processed by your GPUs</p>
        </div>
        <button
          onClick={exportToCSV}
          className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-3 sm:p-4"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
            Total Jobs
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{analytics.totalJobs}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-3 sm:p-4"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Completed
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">{analytics.completedJobs}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-3 sm:p-4 col-span-2 sm:col-span-1"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            Total Earned
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{analytics.totalEarnings} <span className="text-xs sm:text-sm text-gray-400">SAGE</span></p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-3 sm:p-4"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            Avg Duration
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{Math.floor(analytics.avgDuration / 60)}m {analytics.avgDuration % 60}s</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-3 sm:p-4"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            Success Rate
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">{analytics.successRate}%</p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Jobs This Week</h3>
          <div className="flex gap-2">
            {["24h", "7d", "30d", "all"].map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors",
                  dateFilter === filter
                    ? "bg-brand-600 text-white"
                    : "bg-surface-elevated text-gray-400 hover:text-white"
                )}
              >
                {filter === "all" ? "All" : filter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-32 flex items-end gap-3">
          {chartData.map((data, idx) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-gray-500">{data.jobs}</div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.jobs / maxJobs) * 100}%` }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg min-h-[4px]"
              />
              <span className="text-xs text-gray-500">{data.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-3 sm:p-4"
      >
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-full sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Job ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full text-sm"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field min-w-0 flex-1 sm:min-w-[150px] text-sm"
          >
            <option value="all">All Types</option>
            {Object.entries(jobTypeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field min-w-0 flex-1 sm:min-w-[140px] text-sm"
          >
            <option value="all">All Status</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* GPU Filter */}
          <select
            value={gpuFilter}
            onChange={(e) => setGpuFilter(e.target.value)}
            className="input-field min-w-0 flex-1 sm:min-w-[160px] text-sm"
          >
            <option value="all">All GPUs</option>
            <option value="gpu_001">NVIDIA H100</option>
            <option value="gpu_002">NVIDIA A100</option>
            <option value="gpu_003">NVIDIA RTX 4090</option>
          </select>

          <div className="text-xs sm:text-sm text-gray-400 sm:ml-auto">
            {filteredJobs.length} jobs
          </div>
        </div>
      </motion.div>

      {/* Job List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card overflow-hidden"
      >
        {/* Table Header - Hidden on mobile */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-surface-border text-sm font-medium text-gray-400 bg-surface-elevated/50">
          <div className="col-span-2">Job ID</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">GPU</div>
          <div className="col-span-1">Duration</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Earned</div>
          <div className="col-span-1 text-right">Proof</div>
        </div>

        {/* Job Rows */}
        <div className="divide-y divide-surface-border/50">
          {filteredJobs.map((job, idx) => {
            const typeConfig = jobTypeConfig[job.type as keyof typeof jobTypeConfig];
            const status = statusConfig[job.status as keyof typeof statusConfig];
            const TypeIcon = typeConfig?.icon || Briefcase;
            const StatusIcon = status?.icon || Clock;
            const isExpanded = expandedJob === job.id;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
              >
                {/* Desktop Table Row - Hidden on mobile */}
                <div
                  className={cn(
                    "hidden lg:grid grid-cols-12 gap-4 p-4 items-center cursor-pointer transition-colors",
                    isExpanded ? "bg-surface-elevated" : "hover:bg-surface-elevated/50"
                  )}
                  onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <code className="text-sm text-white font-mono">{job.id}</code>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="col-span-2 flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", typeConfig?.bg)}>
                      <TypeIcon className={cn("w-4 h-4", typeConfig?.color)} />
                    </div>
                    <span className="text-white text-sm">{typeConfig?.label}</span>
                  </div>
                  
                  <div className="col-span-2 text-gray-300 text-sm">
                    {job.gpu.name}
                  </div>
                  
                  <div className="col-span-1 text-gray-300 text-sm">
                    {job.duration}
                  </div>
                  
                  <div className="col-span-2 flex items-center gap-2">
                    <span className={cn(
                      "badge flex items-center gap-1",
                      status?.bg,
                      status?.color
                    )}>
                      <StatusIcon className={cn("w-3 h-3", status?.animate && "animate-spin")} />
                      {status?.label}
                    </span>
                  </div>
                  
                  <div className="col-span-2">
                    {job.earned !== "—" && job.earned !== "0.00" ? (
                      <span className="text-emerald-400 font-medium">+{job.earned} SAGE</span>
                    ) : job.earned === "0.00" ? (
                      <span className="text-red-400">0.00 SAGE</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </div>
                  
                  <div className="col-span-1 text-right">
                    {job.proofId ? (
                      <a
                        href={`https://sepolia.starkscan.co/tx/${job.proofId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-400 hover:text-brand-300 flex items-center gap-1 justify-end text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Shield className="w-3 h-3" />
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </div>
                </div>

                {/* Mobile Card View - Hidden on desktop */}
                <div
                  className={cn(
                    "lg:hidden p-3 sm:p-4 cursor-pointer transition-colors",
                    isExpanded ? "bg-surface-elevated" : "hover:bg-surface-elevated/50"
                  )}
                  onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={cn("p-1.5 rounded-lg flex-shrink-0", typeConfig?.bg)}>
                        <TypeIcon className={cn("w-4 h-4", typeConfig?.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <code className="text-xs text-white font-mono block truncate">{job.id}</code>
                        <span className="text-xs text-gray-400 block">{typeConfig?.label}</span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">GPU:</span>
                      <span className="text-white ml-1">{job.gpu.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-white ml-1">{job.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border">
                    <span className={cn(
                      "badge text-[10px] flex items-center gap-1",
                      status?.bg,
                      status?.color
                    )}>
                      <StatusIcon className={cn("w-3 h-3", status?.animate && "animate-spin")} />
                      {status?.label}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      {job.earned !== "—" && job.earned !== "0.00" ? (
                        <span className="text-emerald-400 font-medium text-sm">+{job.earned} SAGE</span>
                      ) : job.earned === "0.00" ? (
                        <span className="text-red-400 text-sm">0.00 SAGE</span>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                      
                      {job.proofId && (
                        <a
                          href={`https://sepolia.starkscan.co/tx/${job.proofId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-400 hover:text-brand-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
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
                          {/* Input Hash */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Input Hash</p>
                            <div className="flex items-center gap-2">
                              <code className="text-xs text-gray-300 font-mono truncate">
                                {job.inputHash?.slice(0, 18)}...
                              </code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(job.inputHash || "", `input-${job.id}`);
                                }}
                                className="text-gray-500 hover:text-white"
                              >
                                {copiedHash === `input-${job.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Output Hash */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Output Hash</p>
                            {job.outputHash ? (
                              <div className="flex items-center gap-2">
                                <code className="text-xs text-gray-300 font-mono truncate">
                                  {job.outputHash.slice(0, 18)}...
                                </code>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(job.outputHash || "", `output-${job.id}`);
                                  }}
                                  className="text-gray-500 hover:text-white"
                                >
                                  {copiedHash === `output-${job.id}` ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-600">—</span>
                            )}
                          </div>

                          {/* Gas Used (historical on-chain data) */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Gas Used</p>
                            <code className="text-xs text-gray-300 font-mono">
                              {job.gasUsed}
                            </code>
                            <p className="text-[10px] text-gray-600 mt-0.5">(sponsored via AA)</p>
                          </div>

                          {/* Client */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Client</p>
                            <code className="text-xs text-gray-300 font-mono">
                              {job.client}
                            </code>
                          </div>

                          {/* Timestamp */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                            <p className="text-xs text-gray-300">
                              {new Date(job.timestamp).toLocaleString()} ({formatTimeAgo(job.timestamp)})
                            </p>
                          </div>

                          {/* Proof ID */}
                          {job.proofId && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Proof ID</p>
                              <a
                                href={`https://sepolia.starkscan.co/tx/${job.proofId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {job.proofId}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          {/* Error Message (if failed) */}
                          {job.status === "failed" && (job as any).errorMessage && (
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500 mb-1">Error</p>
                              <p className="text-xs text-red-400">
                                {(job as any).errorMessage}
                              </p>
                            </div>
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
        {filteredJobs.length === 0 && (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No jobs found matching your filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
