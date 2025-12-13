"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Download,
  Copy,
  Check,
  Cpu,
  Activity,
  Zap,
  Hash,
  Layers,
  Timer,
  Server,
  FileJson,
  Code,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Link as LinkIcon,
  Box,
  Binary,
  Fingerprint,
  Lock,
  Unlock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PrivacyModeToggle } from "@/components/privacy/PrivacyToggle";

// Mock proof data - in production this would come from API
const getMockProofData = (id: string) => {
  const proofs: Record<string, any> = {
    "proof_0x4e5f6a": {
      id: "proof_0x4e5f6a",
      jobId: "job_0x7a2f3b",
      circuitType: "stwo_ml_inference",
      circuitLabel: "ML Inference",
      status: "verified",
      gpu: { id: "gpu_001", name: "NVIDIA H100", memory: "80GB" },
      generatedAt: Date.now() - 300000,
      verifiedAt: Date.now() - 295000,
      duration: "5m 12s",
      durationMs: 312000,
      verifiedOnChain: true,
      txHash: "0x04a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef12345678",
      blockNumber: 1245678,
      proofSize: "1.2 MB",
      proofSizeBytes: 1258291,
      client: "0x04f2a8b3c9d1e5f67890abcdef1234567890abcdef",
      reward: "1.20",
      isPrivate: true, // This job used privacy mode
      
      // Input/Output Data
      input: {
        hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
        // Encrypted input ciphertext (L, R points)
        encryptedHash: { L: "0x04a8c3f2e7b91d4a...", R: "0x07b2e1f9a3c8d5b2..." },
        dataType: "tensor",
        shape: "[1, 3, 224, 224]",
        description: "Image tensor input for ResNet50 inference",
      },
      output: {
        hash: "0x9876543210fedcba0987654321fedcba09876543210fedcba0987654321fedcba",
        // Encrypted output ciphertext
        encryptedHash: { L: "0x09f1c8d5a7b2e4f3...", R: "0x02c4e9f8b1a3d6c7..." },
        dataType: "tensor",
        shape: "[1, 1000]",
        description: "Classification probabilities (1000 classes)",
        preview: {
          topPredictions: [
            { class: "golden_retriever", confidence: 0.892 },
            { class: "labrador", confidence: 0.067 },
            { class: "cocker_spaniel", confidence: 0.023 },
          ],
        },
      },
      
      // Circuit Stats (matches STWO FriConfig + AIR)
      circuit: {
        constraintCount: 2456789,
        traceLength: "2^20",
        traceRows: 1048576,
        fieldSize: "M31 / QM31", // M31 base field, QM31 extension field
        blowupFactor: 2, // log_blowup_factor = 2 means 4x expansion
        numQueries: 100, // n_queries in FriConfig
        friLayers: 15, // first_layer + inner_layers.len() + last_layer
        securityBits: 100, // ~queries * log2(blowup) soundness
      },
      
      // Proof Components (matches STWO CommitmentSchemeProof + FriProof)
      proofComponents: {
        // First layer Merkle root (first_layer.commitment)
        firstLayerCommitment: "0xabc123def456789012345678901234567890123456789012345678901234abcd",
        // Inner FRI layer commitments (inner_layers[i].commitment)
        friCommitments: [
          "0x111222333444555666777888999000aaabbbcccdddeeefff000111222333444555",
          "0x222333444555666777888999000aaabbbcccdddeeefff000111222333444555666",
          "0x333444555666777888999000aaabbbcccdddeeefff000111222333444555666777",
        ],
        // Trace polynomial commitments (commitments in CommitmentSchemeProof)
        traceCommitments: [
          "0xdef789abc123456789012345678901234567890123456789012345678901234def",
          "0xfed321cba987654321fedcba987654321fedcba987654321fedcba987654321fed",
        ],
        // Last layer polynomial degree
        lastLayerDegree: 8,
        // Proof of work nonce (grinding)
        proofOfWork: "0x7a3f8c2d",
        queryResponses: 100,
      },
      
      // Verification Details
      verification: {
        verifierContract: "0x0123456789abcdef0123456789abcdef01234567",
        verificationGas: 1245000,
        verificationTime: "2.3s",
        // Fiat-Shamir: challenge derived from channel state, not explicit seed
        channelState: "Fiat-Shamir (Blake2s)",
      },
      
      // TEE Attestation (if applicable)
      teeAttestation: {
        enclaveId: "0x1234567890abcdef1234567890abcdef",
        mrEnclave: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        mrSigner: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
        reportData: "0x...",
        timestamp: Date.now() - 300000,
      },
      
      // Execution Trace (simplified)
      executionPhases: [
        { name: "Setup", duration: 12000, status: "completed" },
        { name: "Witness Generation", duration: 45000, status: "completed" },
        { name: "Commitment", duration: 120000, status: "completed" },
        { name: "FRI Computation", duration: 105000, status: "completed" },
        { name: "Proof Composition", duration: 30000, status: "completed" },
      ],
    },
    "proof_0x8a9b0c": {
      id: "proof_0x8a9b0c",
      jobId: "job_0x6e7f8a",
      circuitType: "stwo_etl",
      circuitLabel: "ETL Pipeline",
      status: "verified",
      gpu: { id: "gpu_002", name: "NVIDIA A100", memory: "80GB" },
      generatedAt: Date.now() - 1800000,
      verifiedAt: Date.now() - 1795000,
      duration: "8m 22s",
      durationMs: 502000,
      verifiedOnChain: true,
      txHash: "0x05b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef123456789a",
      blockNumber: 1245234,
      proofSize: "2.1 MB",
      proofSizeBytes: 2202009,
      client: "0x09e4b7c6d5f8a9012345678901234567890abcdef",
      isPrivate: false, // Public job
      reward: "2.15",
      input: {
        hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
        dataType: "structured_data",
        shape: "10,000 rows × 45 columns",
        description: "Customer transaction data for aggregation",
      },
      output: {
        hash: "0xa765432109fedcba0987654321fedcba09876543210fedcba0987654321fedcba",
        dataType: "aggregated_metrics",
        shape: "Summary statistics",
        description: "Aggregated metrics and computed KPIs",
        preview: {
          metrics: {
            totalTransactions: 10000,
            totalVolume: "$1,245,678.90",
            avgTransactionSize: "$124.57",
          },
        },
      },
      circuit: {
        constraintCount: 4892156,
        traceLength: "2^22",
        traceRows: 4194304,
        fieldSize: "M31 / QM31",
        blowupFactor: 2,
        numQueries: 120,
        friLayers: 18,
        securityBits: 100,
      },
      proofComponents: {
        firstLayerCommitment: "0xbcd234efg567890123456789012345678901234567890123456789012345bcde",
        friCommitments: [
          "0x444555666777888999000aaabbbcccdddeeefff000111222333444555666777888",
          "0x555666777888999000aaabbbcccdddeeefff000111222333444555666777888999",
        ],
        traceCommitments: [
          "0xefg890bcd234567890123456789012345678901234567890123456789012345efg",
        ],
        lastLayerDegree: 16,
        proofOfWork: "0x2b4e8f1a",
        queryResponses: 120,
      },
      verification: {
        verifierContract: "0x0123456789abcdef0123456789abcdef01234567",
        verificationGas: 2156000,
        verificationTime: "3.8s",
        channelState: "Fiat-Shamir (Blake2s)",
      },
      teeAttestation: null,
      executionPhases: [
        { name: "Setup", duration: 15000, status: "completed" },
        { name: "Witness Generation", duration: 90000, status: "completed" },
        { name: "Commitment", duration: 180000, status: "completed" },
        { name: "FRI Computation", duration: 170000, status: "completed" },
        { name: "Proof Composition", duration: 47000, status: "completed" },
      ],
    },
    // Live proofs (in progress)
    "proof_live_001": {
      id: "proof_live_001",
      jobId: "job_0x9d4e5f",
      circuitType: "stwo_ml_inference",
      circuitLabel: "ML Inference",
      status: "generating",
      gpu: { id: "gpu_001", name: "NVIDIA H100", memory: "80GB" },
      generatedAt: Date.now() - 180000,
      verifiedAt: null,
      duration: "~8m estimated",
      durationMs: 480000,
      verifiedOnChain: false,
      txHash: null,
      blockNumber: null,
      proofSize: "—",
      proofSizeBytes: 0,
      client: "0x07d1a8c3e5f29b4678901234567890abcdef1234",
      reward: "—",
      progress: 65,
      currentPhase: "Commitment Generation",
      isPrivate: true, // Private job
      input: {
        hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
        encryptedHash: { L: "0x08d7c4a3b2e1f5...", R: "0x03f9e8d7c6b5a4..." },
        dataType: "tensor",
        shape: "[1, 3, 512, 512]",
        description: "High-resolution image for ML classification",
      },
      output: {
        hash: "—",
        encryptedHash: { L: "pending...", R: "pending..." },
        dataType: "tensor",
        shape: "[1, 1000]",
        description: "Output pending...",
        preview: null,
      },
      circuit: {
        constraintCount: 2456789,
        traceLength: "2^20",
        traceRows: 1048576,
        fieldSize: "M31",
        blowupFactor: 2,
        numQueries: 100,
        friLayers: 15,
        securityBits: 100,
      },
      proofComponents: {
        commitment: "0x... (generating)",
        friCommitments: [],
        oracleCommitment: "—",
        queryResponses: 0,
      },
      verification: {
        verifierContract: "0x0123456789abcdef0123456789abcdef01234567",
        verificationGas: 0,
        verificationTime: "—",
        challengeSeed: "—",
      },
      teeAttestation: null,
      executionPhases: [
        { name: "Setup", duration: 12000, status: "completed" },
        { name: "Witness Generation", duration: 45000, status: "completed" },
        { name: "Commitment", duration: 0, status: "in_progress" },
        { name: "FRI Computation", duration: 0, status: "pending" },
        { name: "Proof Composition", duration: 0, status: "pending" },
      ],
    },
    "proof_live_002": {
      id: "proof_live_002",
      jobId: "job_0x1a2b3c",
      circuitType: "stwo_fibonacci",
      circuitLabel: "STWO Fibonacci",
      status: "generating",
      gpu: { id: "gpu_002", name: "NVIDIA A100", memory: "80GB" },
      generatedAt: Date.now() - 45000,
      verifiedAt: null,
      duration: "~2m estimated",
      durationMs: 120000,
      verifiedOnChain: false,
      txHash: null,
      blockNumber: null,
      proofSize: "—",
      proofSizeBytes: 0,
      client: "0x02a3b4c5d6e7f8901234567890abcdef12345678",
      reward: "—",
      progress: 22,
      currentPhase: "Witness Generation",
      isPrivate: false, // Public job (for comparison)
      input: {
        hash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
        dataType: "integer",
        shape: "n = 1000",
        description: "Fibonacci sequence computation up to n=1000",
      },
      output: {
        hash: "—",
        dataType: "integer",
        shape: "fib(1000)",
        description: "Output pending...",
        preview: null,
      },
      circuit: {
        constraintCount: 65536,
        traceLength: "2^16",
        traceRows: 65536,
        fieldSize: "M31",
        blowupFactor: 2,
        numQueries: 80,
        friLayers: 12,
        securityBits: 100,
      },
      proofComponents: {
        commitment: "—",
        friCommitments: [],
        oracleCommitment: "—",
        queryResponses: 0,
      },
      verification: {
        verifierContract: "0x0123456789abcdef0123456789abcdef01234567",
        verificationGas: 0,
        verificationTime: "—",
        challengeSeed: "—",
      },
      teeAttestation: null,
      executionPhases: [
        { name: "Setup", duration: 8000, status: "completed" },
        { name: "Witness Generation", duration: 0, status: "in_progress" },
        { name: "Commitment", duration: 0, status: "pending" },
        { name: "FRI Computation", duration: 0, status: "pending" },
        { name: "Proof Composition", duration: 0, status: "pending" },
      ],
    },
  };

  return proofs[id] || null;
};

// Status configuration
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  verified: { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-500/20", icon: CheckCircle2 },
  generating: { label: "Generating", color: "text-brand-400", bg: "bg-brand-500/20", icon: Activity },
  pending: { label: "Pending", color: "text-orange-400", bg: "bg-orange-500/20", icon: Clock },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/20", icon: XCircle },
};

export default function ProofDetailPage() {
  const params = useParams();
  const router = useRouter();
  const proofId = params.id as string;
  
  const [proof, setProof] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview", "io", "circuit", "verification"])
  );
  const [privacyMode, setPrivacyMode] = useState(true); // Default to showing encrypted view for private proofs
  const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());

  const toggleReveal = (field: string) => {
    setRevealedFields(prev => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  useEffect(() => {
    // Simulate API fetch
    const fetchProof = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = getMockProofData(proofId);
      setProof(data);
      setLoading(false);
    };
    fetchProof();
  }, [proofId]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const downloadProof = () => {
    if (!proof) return;
    const proofData = {
      proof_id: proof.id,
      job_id: proof.jobId,
      circuit_type: proof.circuitType,
      status: proof.status,
      generated_at: new Date(proof.generatedAt).toISOString(),
      verified_at: proof.verifiedAt ? new Date(proof.verifiedAt).toISOString() : null,
      tx_hash: proof.txHash,
      input_hash: proof.input.hash,
      output_hash: proof.output.hash,
      first_layer_commitment: proof.proofComponents.firstLayerCommitment || proof.proofComponents.commitment,
      fri_commitments: proof.proofComponents.friCommitments,
      trace_commitments: proof.proofComponents.traceCommitments,
      proof_of_work: proof.proofComponents.proofOfWork,
      circuit_stats: proof.circuit,
      verification: proof.verification,
    };
    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${proof.id}.json`;
    a.click();
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading proof details...</p>
        </div>
      </div>
    );
  }

  if (!proof) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="w-12 h-12 text-orange-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Proof Not Found</h2>
        <p className="text-gray-400 mb-4">The proof "{proofId}" could not be found.</p>
        <Link href="/proofs" className="btn-primary">
          Back to Proofs
        </Link>
      </div>
    );
  }

  const status = statusConfig[proof.status];
  const StatusIcon = status?.icon || Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-border transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white font-mono">{proof.id}</h1>
              <span className={cn("badge flex items-center gap-1", status?.bg, status?.color)}>
                <StatusIcon className="w-3 h-3" />
                {status?.label}
              </span>
              {proof.verifiedOnChain && (
                <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  On-chain Verified
                </span>
              )}
              {proof.isPrivate && (
                <span className="badge bg-brand-500/10 text-brand-400 border border-brand-500/30 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  Private Job
                </span>
              )}
            </div>
            <p className="text-gray-400 mt-1">
              {proof.circuitLabel} • Generated {formatTimeAgo(proof.generatedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={downloadProof} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
          {proof.txHash && (
            <a
              href={`https://sepolia.starkscan.co/tx/${proof.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Starkscan
            </a>
          )}
        </div>
      </div>

      {/* Live Progress Bar (for generating proofs) */}
      {proof.status === "generating" && proof.progress !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400 animate-pulse" />
              <span className="text-sm text-white font-medium">Proof Generation in Progress</span>
            </div>
            <span className="text-2xl font-bold text-brand-400">{proof.progress}%</span>
          </div>
          <div className="h-3 bg-surface-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${proof.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Current Phase: <span className="text-white">{proof.currentPhase}</span>
          </p>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">Duration</p>
          <p className="text-lg font-semibold text-white">{proof.duration}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">Proof Size</p>
          <p className="text-lg font-semibold text-white">{proof.proofSize}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">Constraints</p>
          <p className="text-lg font-semibold text-white">{proof.circuit.constraintCount.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">Security</p>
          <p className="text-lg font-semibold text-white">{proof.circuit.securityBits} bits</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
          <p className="text-xs text-gray-500 mb-1">Reward</p>
          {proof.isPrivate && privacyMode ? (
            <p className="text-lg font-semibold text-brand-400 font-mono tracking-wider">+•••••</p>
          ) : (
            <p className="text-lg font-semibold text-emerald-400">+{proof.reward} SAGE</p>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Input/Output Section */}
          <CollapsibleSection
            title="Input / Output"
            icon={<Box className="w-5 h-5" />}
            isExpanded={expandedSections.has("io")}
            onToggle={() => toggleSection("io")}
            badge={proof.isPrivate && privacyMode ? (
              <span className="badge bg-brand-500/20 text-brand-400 text-xs flex items-center gap-1">
                <Lock className="w-3 h-3" /> Encrypted
              </span>
            ) : undefined}
          >
            {/* Privacy Toggle for this proof */}
            {proof.isPrivate && (
              <div className="mb-4">
                <PrivacyModeToggle
                  enabled={privacyMode}
                  onToggle={setPrivacyMode}
                />
                {privacyMode && (
                  <p className="text-xs text-brand-400/70 mt-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    This job used privacy mode. Input/output data is ElGamal encrypted on-chain.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input */}
              <div className={cn(
                "p-4 rounded-xl border transition-all",
                proof.isPrivate && privacyMode 
                  ? "bg-gradient-to-br from-brand-600/10 to-accent-purple/10 border-brand-500/30"
                  : "bg-surface-elevated/50 border-surface-border"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      proof.isPrivate && privacyMode ? "bg-brand-500/20" : "bg-cyan-500/20"
                    )}>
                      {proof.isPrivate && privacyMode ? (
                        <Lock className="w-4 h-4 text-brand-400" />
                      ) : (
                        <Binary className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <span className="font-medium text-white">Input</span>
                    {proof.isPrivate && privacyMode && (
                      <span className="text-xs text-brand-400">(encrypted)</span>
                    )}
                  </div>
                  {proof.isPrivate && privacyMode && (
                    <button
                      onClick={() => toggleReveal("input")}
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                      {revealedFields.has("input") ? (
                        <><EyeOff className="w-3 h-3" /> Hide</>
                      ) : (
                        <><Eye className="w-3 h-3" /> Reveal</>
                      )}
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {proof.isPrivate && privacyMode ? "Ciphertext" : "Hash"}
                    </p>
                    {proof.isPrivate && privacyMode && !revealedFields.has("input") ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">L:</span>
                          <code className="text-xs text-brand-400 font-mono tracking-wider">
                            •••••••••••••••••••••
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">R:</span>
                          <code className="text-xs text-brand-400 font-mono tracking-wider">
                            •••••••••••••••••••••
                          </code>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-300 font-mono truncate flex-1">
                          {proof.input.hash.slice(0, 24)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(proof.input.hash, "input-hash")}
                          className="text-gray-500 hover:text-white flex-shrink-0"
                        >
                          {copiedField === "input-hash" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-sm text-white">{proof.input.dataType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shape</p>
                    {proof.isPrivate && privacyMode && !revealedFields.has("input") ? (
                      <code className="text-sm text-brand-400 font-mono tracking-wider">•••••••</code>
                    ) : (
                      <code className="text-sm text-brand-400 font-mono">{proof.input.shape}</code>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    {proof.isPrivate && privacyMode && !revealedFields.has("input") ? (
                      <p className="text-sm text-brand-400/70 italic">[ description encrypted ]</p>
                    ) : (
                      <p className="text-sm text-gray-300">{proof.input.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className={cn(
                "p-4 rounded-xl border transition-all",
                proof.isPrivate && privacyMode 
                  ? "bg-gradient-to-br from-brand-600/10 to-accent-purple/10 border-brand-500/30"
                  : "bg-surface-elevated/50 border-surface-border"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      proof.isPrivate && privacyMode ? "bg-brand-500/20" : "bg-emerald-500/20"
                    )}>
                      {proof.isPrivate && privacyMode ? (
                        <Lock className="w-4 h-4 text-brand-400" />
                      ) : (
                        <Binary className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <span className="font-medium text-white">Output</span>
                    {proof.isPrivate && privacyMode && (
                      <span className="text-xs text-brand-400">(encrypted)</span>
                    )}
                  </div>
                  {proof.isPrivate && privacyMode && proof.output.hash && proof.output.hash !== "—" && (
                    <button
                      onClick={() => toggleReveal("output")}
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                      {revealedFields.has("output") ? (
                        <><EyeOff className="w-3 h-3" /> Hide</>
                      ) : (
                        <><Eye className="w-3 h-3" /> Reveal</>
                      )}
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {proof.isPrivate && privacyMode ? "Ciphertext" : "Hash"}
                    </p>
                    {proof.output.hash && proof.output.hash !== "—" ? (
                      proof.isPrivate && privacyMode && !revealedFields.has("output") ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">L:</span>
                            <code className="text-xs text-brand-400 font-mono tracking-wider">
                              •••••••••••••••••••••
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">R:</span>
                            <code className="text-xs text-brand-400 font-mono tracking-wider">
                              •••••••••••••••••••••
                            </code>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-gray-300 font-mono truncate flex-1">
                            {proof.output.hash.slice(0, 24)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(proof.output.hash, "output-hash")}
                            className="text-gray-500 hover:text-white flex-shrink-0"
                          >
                            {copiedField === "output-hash" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )
                    ) : (
                      <span className="text-xs text-gray-500">Pending...</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-sm text-white">{proof.output.dataType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Shape</p>
                    {proof.isPrivate && privacyMode && !revealedFields.has("output") ? (
                      <code className="text-sm text-brand-400 font-mono tracking-wider">•••••••</code>
                    ) : (
                      <code className="text-sm text-brand-400 font-mono">{proof.output.shape}</code>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    {proof.isPrivate && privacyMode && !revealedFields.has("output") ? (
                      <p className="text-sm text-brand-400/70 italic">[ description encrypted ]</p>
                    ) : (
                      <p className="text-sm text-gray-300">{proof.output.description}</p>
                    )}
                  </div>
                </div>

                {/* Output Preview - Only show if NOT in privacy mode or revealed */}
                {proof.output.preview && (!proof.isPrivate || !privacyMode || revealedFields.has("output")) && (
                  <div className="mt-4 pt-4 border-t border-surface-border/50">
                    <p className="text-xs text-gray-500 mb-2">Preview</p>
                    {proof.output.preview.topPredictions && (
                      <div className="space-y-2">
                        {proof.output.preview.topPredictions.map((pred: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">{pred.class}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-brand-500 rounded-full"
                                  style={{ width: `${pred.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-12 text-right">
                                {(pred.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {proof.output.preview.metrics && (
                      <div className="space-y-2">
                        {Object.entries(proof.output.preview.metrics).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">{key}</span>
                            <span className="text-sm text-white font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Encrypted Preview Placeholder */}
                {proof.output.preview && proof.isPrivate && privacyMode && !revealedFields.has("output") && (
                  <div className="mt-4 pt-4 border-t border-brand-500/20">
                    <p className="text-xs text-gray-500 mb-2">Preview</p>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-brand-400 font-mono">•••••••••</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-brand-500/20 rounded-full" />
                            <span className="text-xs text-brand-400/50 w-12 text-right">
                              ••.•%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-brand-400/50 mt-3 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Click "Reveal" to decrypt (requires signature)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>

          {/* Circuit Details */}
          <CollapsibleSection
            title="Circuit Details"
            icon={<Layers className="w-5 h-5" />}
            isExpanded={expandedSections.has("circuit")}
            onToggle={() => toggleSection("circuit")}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="Constraint Count" value={proof.circuit.constraintCount.toLocaleString()} />
              <StatItem label="Trace Length" value={proof.circuit.traceLength} />
              <StatItem label="Trace Rows" value={proof.circuit.traceRows.toLocaleString()} />
              <StatItem label="Field" value={proof.circuit.fieldSize} highlight />
              <StatItem label="Blowup Factor" value={`${proof.circuit.blowupFactor}x`} />
              <StatItem label="FRI Queries" value={proof.circuit.numQueries.toString()} />
              <StatItem label="FRI Layers" value={proof.circuit.friLayers.toString()} />
              <StatItem label="Security Bits" value={`${proof.circuit.securityBits} bits`} highlight />
            </div>
          </CollapsibleSection>

          {/* Proof Components */}
          <CollapsibleSection
            title="Proof Components"
            icon={<Fingerprint className="w-5 h-5" />}
            isExpanded={expandedSections.has("components")}
            onToggle={() => toggleSection("components")}
            badge={proof.isPrivate ? (
              <span className="badge bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1">
                <Eye className="w-3 h-3" /> Public (ZK)
              </span>
            ) : undefined}
          >
            {proof.isPrivate && (
              <div className="mb-4 p-3 rounded-lg bg-surface-elevated/50 border border-surface-border">
                <p className="text-xs text-gray-400 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-emerald-400">Zero-Knowledge:</strong> These cryptographic commitments 
                    are designed to be public. They prove the computation is valid without revealing 
                    any information about the actual input/output values.
                  </span>
                </p>
              </div>
            )}
            <div className="space-y-4">
              {/* First Layer Commitment (first_layer.commitment in FriProof) */}
              <HashField
                label="First Layer Commitment"
                value={proof.proofComponents.firstLayerCommitment || proof.proofComponents.commitment}
                onCopy={() => copyToClipboard(proof.proofComponents.firstLayerCommitment || proof.proofComponents.commitment, "commitment")}
                copied={copiedField === "commitment"}
              />
              
              {/* FRI Inner Layer Commitments */}
              <div>
                <p className="text-xs text-gray-500 mb-2">FRI Layer Commitments ({proof.proofComponents.friCommitments.length})</p>
                <div className="space-y-2">
                  {proof.proofComponents.friCommitments.map((commit: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-elevated/50">
                      <span className="text-xs text-gray-500 w-8">L{i + 1}</span>
                      <code className="text-xs text-gray-300 font-mono truncate flex-1">
                        {commit.slice(0, 32)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(commit, `fri-${i}`)}
                        className="text-gray-500 hover:text-white"
                      >
                        {copiedField === `fri-${i}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Trace Commitments (Merkle roots for trace polynomials) */}
              {proof.proofComponents.traceCommitments && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Trace Commitments ({proof.proofComponents.traceCommitments.length})</p>
                  <div className="space-y-2">
                    {proof.proofComponents.traceCommitments.map((commit: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-elevated/50">
                        <span className="text-xs text-gray-500 w-8">T{i}</span>
                        <code className="text-xs text-gray-300 font-mono truncate flex-1">
                          {commit.slice(0, 32)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(commit, `trace-${i}`)}
                          className="text-gray-500 hover:text-white"
                        >
                          {copiedField === `trace-${i}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional STWO-specific fields */}
              <div className="grid grid-cols-2 gap-3">
                <StatItem label="Last Layer Degree" value={proof.proofComponents.lastLayerDegree?.toString() || "—"} />
                <StatItem label="Query Count" value={proof.proofComponents.queryResponses.toString()} />
              </div>
              
              {/* Proof of Work (grinding nonce) */}
              {proof.proofComponents.proofOfWork && (
                <div className="p-3 rounded-lg bg-surface-elevated/50">
                  <p className="text-xs text-gray-500 mb-1">Proof of Work (Grinding)</p>
                  <code className="text-sm text-brand-400 font-mono">{proof.proofComponents.proofOfWork}</code>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Verification Details */}
          <CollapsibleSection
            title="Verification"
            icon={<CheckCircle2 className="w-5 h-5" />}
            isExpanded={expandedSections.has("verification")}
            onToggle={() => toggleSection("verification")}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatItem 
                  label="Verification Gas" 
                  value={proof.verification.verificationGas ? `${proof.verification.verificationGas.toLocaleString()} (sponsored)` : "—"} 
                />
                <StatItem label="Verification Time" value={proof.verification.verificationTime || "—"} />
                <StatItem label="Block Number" value={proof.blockNumber ? `#${proof.blockNumber.toLocaleString()}` : "—"} />
              </div>
              <HashField
                label="Verifier Contract"
                value={proof.verification.verifierContract}
                onCopy={() => copyToClipboard(proof.verification.verifierContract, "verifier")}
                copied={copiedField === "verifier"}
                link={`https://sepolia.starkscan.co/contract/${proof.verification.verifierContract}`}
              />
              {/* Fiat-Shamir: challenges derived from channel state, not explicit seed */}
              <div className="p-3 rounded-lg bg-surface-elevated/50">
                <p className="text-xs text-gray-500 mb-1">Challenge Generation</p>
                <p className="text-sm text-white">{proof.verification.channelState || "Fiat-Shamir (Blake2s)"}</p>
                <p className="text-xs text-gray-500 mt-1">Challenges derived from Merkle channel state</p>
              </div>
            </div>
          </CollapsibleSection>

          {/* TEE Attestation (if available) */}
          {proof.teeAttestation && (
            <CollapsibleSection
              title="TEE Attestation"
              icon={<Shield className="w-5 h-5" />}
              isExpanded={expandedSections.has("tee")}
              onToggle={() => toggleSection("tee")}
            >
              <div className="space-y-4">
                <HashField
                  label="Enclave ID"
                  value={proof.teeAttestation.enclaveId}
                  onCopy={() => copyToClipboard(proof.teeAttestation.enclaveId, "enclave")}
                  copied={copiedField === "enclave"}
                />
                <HashField
                  label="MR Enclave"
                  value={proof.teeAttestation.mrEnclave}
                  onCopy={() => copyToClipboard(proof.teeAttestation.mrEnclave, "mrenclave")}
                  copied={copiedField === "mrenclave"}
                />
                <HashField
                  label="MR Signer"
                  value={proof.teeAttestation.mrSigner}
                  onCopy={() => copyToClipboard(proof.teeAttestation.mrSigner, "mrsigner")}
                  copied={copiedField === "mrsigner"}
                />
              </div>
            </CollapsibleSection>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Job Info */}
          <div className={cn(
            "glass-card p-4",
            proof.isPrivate && privacyMode && "border-brand-500/20"
          )}>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              Related
              {proof.isPrivate && privacyMode && (
                <Lock className="w-3 h-3 text-brand-400" />
              )}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Job ID</p>
                {proof.isPrivate && privacyMode ? (
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-brand-400 font-mono tracking-wider">job_••••••••</code>
                    <Lock className="w-3 h-3 text-brand-400/50" />
                  </div>
                ) : (
                  <Link
                    href={`/jobs?search=${proof.jobId}`}
                    className="text-brand-400 hover:text-brand-300 text-sm font-mono flex items-center gap-1"
                  >
                    {proof.jobId}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Client</p>
                {proof.isPrivate && privacyMode ? (
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-brand-400 font-mono tracking-wider">0x••••••••••••</code>
                    <span className="text-[10px] text-brand-400/50">(sender hidden)</span>
                  </div>
                ) : (
                  <code className="text-sm text-gray-300 font-mono">{proof.client.slice(0, 12)}...{proof.client.slice(-8)}</code>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">GPU</p>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-white">{proof.gpu.name}</span>
                  <span className="text-xs text-gray-500">({proof.gpu.memory})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Timeline */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Timer className="w-4 h-4 text-gray-400" />
              Execution Timeline
            </h3>
            <div className="space-y-3">
              {proof.executionPhases.map((phase: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                    phase.status === "completed" && "bg-emerald-500/20",
                    phase.status === "in_progress" && "bg-brand-500/20 ring-2 ring-brand-500/50",
                    phase.status === "pending" && "bg-surface-elevated"
                  )}>
                    {phase.status === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : phase.status === "in_progress" ? (
                      <Activity className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm",
                      phase.status === "in_progress" ? "text-brand-400 font-medium" : 
                      phase.status === "pending" ? "text-gray-500" : "text-white"
                    )}>{phase.name}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {phase.status === "completed" ? `${(phase.duration / 1000).toFixed(1)}s` :
                     phase.status === "in_progress" ? "..." : "—"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-surface-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Time</span>
                <span className="text-sm font-semibold text-white">{proof.duration}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Timestamps
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Generated</span>
                <span className="text-white">{new Date(proof.generatedAt).toLocaleString()}</span>
              </div>
              {proof.verifiedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Verified</span>
                  <span className="text-white">{new Date(proof.verifiedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function CollapsibleSection({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  badge,
}: {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-surface-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-brand-400">{icon}</div>
          <h3 className="font-semibold text-white">{title}</h3>
          {badge}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-surface-border/50 pt-4">
          {children}
        </div>
      )}
    </motion.div>
  );
}

function StatItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="p-3 rounded-lg bg-surface-elevated/50">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={cn("text-sm font-mono", highlight ? "text-brand-400" : "text-white")}>{value}</p>
    </div>
  );
}

function HashField({
  label,
  value,
  onCopy,
  copied,
  link,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  link?: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-elevated/50">
        <code className="text-xs text-gray-300 font-mono truncate flex-1">
          {value}
        </code>
        <button onClick={onCopy} className="text-gray-500 hover:text-white flex-shrink-0">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-brand-400 flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
