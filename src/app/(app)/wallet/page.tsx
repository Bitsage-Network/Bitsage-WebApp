"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAccount } from "@starknet-react/core";
import {
  Wallet,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertTriangle,
  Check,
  CheckCircle2,
  Loader2,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Zap,
  Clock,
  ChevronRight,
  Shield,
  X,
  Fingerprint,
  Activity,
  Network,
  Search,
  Filter,
  MoreHorizontal,
  Server,
  Users,
  Layers,
  MousePointer,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/ui/Logo";
import Link from "next/link";
import { 
  formatObelyskAddress, 
  getCopyableAddress, 
  createPaymentUri,
  OBELYSK_PREFIX 
} from "@/lib/obelysk/address";

// ============================================================================
// TYPES
// ============================================================================

type TabType = "overview" | "activity" | "explorer";
type ProvingState = "idle" | "proving" | "sending" | "confirming" | "confirmed" | "error";

interface NetworkNode {
  id: string;
  type: "you" | "pool" | "validator" | "client";
  label: string;
  x: number;
  y: number;
  [key: string]: any;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockWalletData = {
  publicBalance: "210.8093",
  privateBalance: "47.25",
  pendingEarnings: "15.00",
  totalUsdValue: "$1,245.50",
};

const mockTransactions = [
  {
    id: "tx_001",
    type: "send",
    amount: "-5",
    recipient: "0x0724...123b",
    recipientName: "Teddy",
    timestamp: Date.now() - 60000,
    isPrivate: true,
    status: "confirmed",
    txHash: "0x8a3f...e7b2",
  },
  {
    id: "tx_002",
    type: "send",
    amount: "-5",
    recipient: "0x0724...123b",
    recipientName: "Teddy",
    timestamp: Date.now() - 120000,
    isPrivate: true,
    status: "confirmed",
    txHash: "0x7b2c...f3a1",
  },
  {
    id: "tx_003",
    type: "rollover",
    amount: "+12.5",
    recipient: null,
    recipientName: null,
    timestamp: Date.now() - 180000,
    isPrivate: false,
    status: "confirmed",
    txHash: "0x6c1d...a4b2",
  },
  {
    id: "tx_004",
    type: "receive",
    amount: "+25",
    recipient: "0x8a3f...e7b2",
    recipientName: null,
    timestamp: Date.now() - 300000,
    isPrivate: true,
    status: "confirmed",
    txHash: "0x5d0e...b5c3",
  },
  {
    id: "tx_005",
    type: "gpu_earning",
    amount: "+3.2",
    recipient: null,
    recipientName: "GPU Job #1245",
    timestamp: Date.now() - 600000,
    isPrivate: false,
    status: "pending",
    txHash: null,
  },
  {
    id: "tx_006",
    type: "stake",
    amount: "-100",
    recipient: null,
    recipientName: "Staking Pool",
    timestamp: Date.now() - 900000,
    isPrivate: true,
    status: "confirmed",
    txHash: "0x4e1f...c6d4",
  },
  {
    id: "tx_007",
    type: "receive",
    amount: "+50",
    recipient: "0x2b4a...d8f1",
    recipientName: "Alice",
    timestamp: Date.now() - 1200000,
    isPrivate: false,
    status: "confirmed",
    txHash: "0x3f2g...d7e5",
  },
];

// Network graph mock data - Compact layout with better connections
const mockNetworkNodes: NetworkNode[] = [
  // Your node (center-left)
  { id: "you", type: "you", label: "0x06df...fefe", x: 300, y: 300, balance: "258.06", isPrivate: true },
  // Pools connected to you (green) - close to you
  { id: "pool_1", type: "pool", label: "0x04a2...3b1c", x: 200, y: 220, tvl: "125,430", validators: 24 },
  { id: "pool_2", type: "pool", label: "0x07c1...8f2d", x: 380, y: 240, tvl: "89,200", validators: 18 },
  { id: "pool_3", type: "pool", label: "0x03e5...1a4b", x: 180, y: 380, tvl: "67,800", validators: 12 },
  { id: "pool_4", type: "pool", label: "0x09f3...5c2e", x: 400, y: 380, tvl: "234,500", validators: 35 },
  // Validators connected to pools
  { id: "validator_1", type: "validator", label: "0x0812...4f3a", x: 120, y: 160, earnings: "12.5/day", uptime: "99.8%" },
  { id: "validator_2", type: "validator", label: "0x0a34...7e1c", x: 260, y: 140, earnings: "45.2/day", uptime: "99.9%" },
  { id: "validator_3", type: "validator", label: "0x0c56...9d2b", x: 440, y: 160, earnings: "78.3/day", uptime: "100%" },
  { id: "validator_4", type: "validator", label: "0x0e78...1f4d", x: 500, y: 280, earnings: "23.1/day", uptime: "99.5%" },
  { id: "validator_5", type: "validator", label: "0x0291...3a5e", x: 100, y: 300, earnings: "56.7/day", uptime: "99.7%" },
  { id: "validator_6", type: "validator", label: "0x04b3...5c7f", x: 100, y: 440, earnings: "89.2/day", uptime: "100%" },
  { id: "validator_7", type: "validator", label: "0x06d5...7e91", x: 480, y: 440, earnings: "34.5/day", uptime: "99.9%" },
  { id: "validator_8", type: "validator", label: "0x08f7...9f02", x: 280, y: 460, earnings: "67.8/day", uptime: "99.6%" },
  // Clients sending jobs
  { id: "client_1", type: "client", label: "0x0a19...1234", x: 520, y: 180, jobs: 156, spent: "2,340", isPrivate: true },
  { id: "client_2", type: "client", label: "0x0c3b...3456", x: 580, y: 340, jobs: 89, spent: "1,205", isPrivate: true },
  { id: "client_3", type: "client", label: "0x0e5d...5678", x: 380, y: 520, jobs: 234, spent: "4,567", isPrivate: false },
  { id: "client_4", type: "client", label: "0x0f7f...7890", x: 600, y: 240, jobs: 45, spent: "890", isPrivate: true },
  // Separate cluster (right side)
  { id: "pool_5", type: "pool", label: "0x06f7...4578", x: 700, y: 200, tvl: "156,200", validators: 28 },
  { id: "pool_6", type: "pool", label: "0x0c5d...0134", x: 720, y: 380, tvl: "98,400", validators: 19 },
  { id: "validator_9", type: "validator", label: "0x02b3...0134", x: 780, y: 140, earnings: "12.3/day", uptime: "99.8%" },
  { id: "validator_10", type: "validator", label: "0x04d5...2356", x: 820, y: 260, earnings: "45.6/day", uptime: "99.9%" },
  { id: "validator_11", type: "validator", label: "0x0a3b...8912", x: 800, y: 440, earnings: "78.9/day", uptime: "100%" },
  { id: "client_5", type: "client", label: "0x0191...9012", x: 660, y: 300, jobs: 312, spent: "6,780", isPrivate: false },
  { id: "client_6", type: "client", label: "0x0819...6790", x: 880, y: 340, jobs: 78, spent: "1,560", isPrivate: true },
  { id: "validator_12", type: "validator", label: "0x0f91...4578", x: 640, y: 460, earnings: "23.4/day", uptime: "99.7%" },
  { id: "client_7", type: "client", label: "0x0e7f...2356", x: 760, y: 520, jobs: 167, spent: "3,340", isPrivate: true },
];

const mockNetworkEdges = [
  // === YOUR CONNECTIONS (blue highlight) ===
  { from: "you", to: "pool_1", type: "stake", amount: "100", isPrivate: true, isYourActivity: true },
  { from: "you", to: "pool_2", type: "stake", amount: "50", isPrivate: true, isYourActivity: true },
  { from: "you", to: "pool_3", type: "stake", amount: "75", isPrivate: true, isYourActivity: true },
  { from: "you", to: "pool_4", type: "delegation", amount: "200", isPrivate: true, isYourActivity: true },
  { from: "you", to: "validator_5", type: "ownership", amount: "500", isPrivate: true, isYourActivity: true },
  { from: "client_1", to: "you", type: "payment", amount: "25", isPrivate: true, isYourActivity: true },
  
  // === POOL 1 DELEGATIONS ===
  { from: "pool_1", to: "validator_1", type: "delegation", amount: "5,000", isPrivate: false, isYourActivity: false },
  { from: "pool_1", to: "validator_2", type: "delegation", amount: "8,000", isPrivate: false, isYourActivity: false },
  { from: "pool_1", to: "validator_5", type: "delegation", amount: "3,000", isPrivate: false, isYourActivity: false },
  
  // === POOL 2 DELEGATIONS ===
  { from: "pool_2", to: "validator_2", type: "delegation", amount: "6,000", isPrivate: false, isYourActivity: false },
  { from: "pool_2", to: "validator_3", type: "delegation", amount: "15,000", isPrivate: false, isYourActivity: false },
  { from: "pool_2", to: "validator_4", type: "delegation", amount: "12,000", isPrivate: false, isYourActivity: false },
  
  // === POOL 3 DELEGATIONS ===
  { from: "pool_3", to: "validator_5", type: "delegation", amount: "4,000", isPrivate: false, isYourActivity: false },
  { from: "pool_3", to: "validator_6", type: "delegation", amount: "9,000", isPrivate: false, isYourActivity: false },
  { from: "pool_3", to: "validator_8", type: "delegation", amount: "5,500", isPrivate: false, isYourActivity: false },
  
  // === POOL 4 DELEGATIONS ===
  { from: "pool_4", to: "validator_7", type: "delegation", amount: "18,000", isPrivate: false, isYourActivity: false },
  { from: "pool_4", to: "validator_8", type: "delegation", amount: "7,000", isPrivate: false, isYourActivity: false },
  { from: "pool_4", to: "validator_3", type: "delegation", amount: "4,500", isPrivate: false, isYourActivity: false },
  
  // === CLIENT JOBS (left cluster) ===
  { from: "client_1", to: "validator_3", type: "job", amount: "45.2", isPrivate: true, isYourActivity: false },
  { from: "client_1", to: "validator_4", type: "job", amount: "23.1", isPrivate: true, isYourActivity: false },
  { from: "client_2", to: "validator_4", type: "job", amount: "67.8", isPrivate: true, isYourActivity: false },
  { from: "client_2", to: "validator_7", type: "job", amount: "34.5", isPrivate: true, isYourActivity: false },
  { from: "client_3", to: "validator_6", type: "job", amount: "12.5", isPrivate: false, isYourActivity: false },
  { from: "client_3", to: "validator_8", type: "job", amount: "56.7", isPrivate: false, isYourActivity: false },
  { from: "client_4", to: "validator_3", type: "job", amount: "89.3", isPrivate: true, isYourActivity: false },
  
  // === RIGHT CLUSTER - POOL 5 ===
  { from: "pool_5", to: "validator_9", type: "delegation", amount: "22,000", isPrivate: false, isYourActivity: false },
  { from: "pool_5", to: "validator_10", type: "delegation", amount: "16,000", isPrivate: false, isYourActivity: false },
  { from: "pool_5", to: "client_5", type: "rewards", amount: "1,200", isPrivate: false, isYourActivity: false },
  
  // === RIGHT CLUSTER - POOL 6 ===
  { from: "pool_6", to: "validator_10", type: "delegation", amount: "8,000", isPrivate: false, isYourActivity: false },
  { from: "pool_6", to: "validator_11", type: "delegation", amount: "11,000", isPrivate: false, isYourActivity: false },
  { from: "pool_6", to: "validator_12", type: "delegation", amount: "8,500", isPrivate: false, isYourActivity: false },
  
  // === RIGHT CLUSTER - CLIENT JOBS ===
  { from: "client_5", to: "validator_9", type: "job", amount: "78.9", isPrivate: false, isYourActivity: false },
  { from: "client_5", to: "validator_10", type: "job", amount: "45.6", isPrivate: false, isYourActivity: false },
  { from: "client_6", to: "validator_10", type: "job", amount: "34.5", isPrivate: true, isYourActivity: false },
  { from: "client_6", to: "validator_11", type: "job", amount: "56.7", isPrivate: true, isYourActivity: false },
  { from: "client_7", to: "validator_11", type: "job", amount: "23.4", isPrivate: true, isYourActivity: false },
  { from: "client_7", to: "validator_12", type: "job", amount: "67.8", isPrivate: true, isYourActivity: false },
  
  // === CROSS-CLUSTER CONNECTIONS ===
  { from: "validator_4", to: "pool_5", type: "stake", amount: "2,000", isPrivate: false, isYourActivity: false },
  { from: "validator_7", to: "pool_6", type: "stake", amount: "1,500", isPrivate: false, isYourActivity: false },
  { from: "client_3", to: "validator_12", type: "job", amount: "45.0", isPrivate: false, isYourActivity: false },
];

const mockPoolStats = {
  totalDeposits: "1,245,678 SAGE",
  totalWithdrawals: "234,567 SAGE",
  activeValidators: 156,
  avgAPR: "24.5%",
  yourStake: "100 SAGE",
  yourEarnings: "+15.2 SAGE",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ObelyskWalletPage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showPrivateBalance, setShowPrivateBalance] = useState(false);
  const [isSigningToReveal, setIsSigningToReveal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Modal states
  const [showPayModal, setShowPayModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRolloverModal, setShowRolloverModal] = useState(false);
  const [showRagequitModal, setShowRagequitModal] = useState(false);
  
  // Proving flow
  const [provingState, setProvingState] = useState<ProvingState>("idle");
  const [provingTime, setProvingTime] = useState<number | null>(null);

  // Explorer state
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRevealPrivate = async () => {
    setIsSigningToReveal(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowPrivateBalance(true);
    setIsSigningToReveal(false);
  };

  const handleRollover = async () => {
    setProvingState("proving");
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 150));
    setProvingTime(Date.now() - startTime);
    setProvingState("sending");
    await new Promise(resolve => setTimeout(resolve, 800));
    setProvingState("confirming");
    await new Promise(resolve => setTimeout(resolve, 1200));
    setProvingState("confirmed");
  };

  const handleRagequit = async () => {
    setProvingState("proving");
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 200));
    setProvingTime(Date.now() - startTime);
    setProvingState("sending");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProvingState("confirming");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProvingState("confirmed");
  };

  const resetProvingState = () => {
    setProvingState("idle");
    setProvingTime(null);
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Wallet },
    { id: "activity" as TabType, label: "Activity", icon: Activity },
    { id: "explorer" as TabType, label: "Explorer", icon: Network },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Obelysk Wallet</h1>
            <p className="text-sm text-gray-400">Privacy-first GPU earnings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400">Connected</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-surface-card rounded-xl border border-surface-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-surface-elevated"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <OverviewTab
            key="overview"
            address={address}
            showPrivateBalance={showPrivateBalance}
            isSigningToReveal={isSigningToReveal}
            copiedField={copiedField}
            onRevealPrivate={handleRevealPrivate}
            onHidePrivate={() => setShowPrivateBalance(false)}
            onCopy={copyToClipboard}
            onShowPayModal={() => setShowPayModal(true)}
            onShowRequestModal={() => setShowRequestModal(true)}
            onShowRolloverModal={() => setShowRolloverModal(true)}
            onShowRagequitModal={() => setShowRagequitModal(true)}
            formatAddress={formatAddress}
            formatTimeAgo={formatTimeAgo}
          />
        )}
        
        {activeTab === "activity" && (
          <ActivityTab
            key="activity"
            transactions={mockTransactions}
            formatAddress={formatAddress}
            formatTimeAgo={formatTimeAgo}
          />
        )}
        
        {activeTab === "explorer" && (
          <ExplorerTab
            key="explorer"
            nodes={mockNetworkNodes}
            edges={mockNetworkEdges}
            poolStats={mockPoolStats}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <RolloverModal
        show={showRolloverModal}
        onClose={() => { setShowRolloverModal(false); resetProvingState(); }}
        provingState={provingState}
        provingTime={provingTime}
        onRollover={handleRollover}
      />
      
      <RagequitModal
        show={showRagequitModal}
        onClose={() => { setShowRagequitModal(false); resetProvingState(); }}
        provingState={provingState}
        provingTime={provingTime}
        showPrivateBalance={showPrivateBalance}
        onRagequit={handleRagequit}
        address={address}
        formatAddress={formatAddress}
      />

      <PayModal
        show={showPayModal}
        onClose={() => setShowPayModal(false)}
      />

      <RequestModal
        show={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        address={address}
        copiedField={copiedField}
        onCopy={copyToClipboard}
        formatAddress={formatAddress}
      />
    </div>
  );
}

// ============================================================================
// OVERVIEW TAB
// ============================================================================

function OverviewTab({
  address,
  showPrivateBalance,
  isSigningToReveal,
  copiedField,
  onRevealPrivate,
  onHidePrivate,
  onCopy,
  onShowPayModal,
  onShowRequestModal,
  onShowRolloverModal,
  onShowRagequitModal,
  formatAddress,
  formatTimeAgo,
}: {
  address: string | undefined;
  showPrivateBalance: boolean;
  isSigningToReveal: boolean;
  copiedField: string | null;
  onRevealPrivate: () => void;
  onHidePrivate: () => void;
  onCopy: (text: string, field: string) => void;
  onShowPayModal: () => void;
  onShowRequestModal: () => void;
  onShowRolloverModal: () => void;
  onShowRagequitModal: () => void;
  formatAddress: (addr: string) => string;
  formatTimeAgo: (timestamp: number) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Main Balance Card */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 text-center bg-gradient-to-b from-surface-card to-surface-elevated">
          <p className="text-4xl font-bold text-white mb-2">
            {mockWalletData.totalUsdValue}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            {showPrivateBalance ? (
              <span className="text-lg text-white">
                {mockWalletData.privateBalance} SAGE
              </span>
            ) : (
              <span className="text-lg text-brand-400 font-mono tracking-wider">
                ••••••• SAGE
              </span>
            )}
            <span className="text-sm text-brand-400">(Private)</span>
            <button
              onClick={() => showPrivateBalance ? onHidePrivate() : onRevealPrivate()}
              disabled={isSigningToReveal}
              className="p-1 rounded hover:bg-surface-elevated transition-colors"
            >
              {isSigningToReveal ? (
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
              ) : showPrivateBalance ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-brand-400" />
              )}
            </button>
          </div>

          {parseFloat(mockWalletData.pendingEarnings) > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 mb-4">
              <RefreshCw className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-sm text-brand-400">
                +{mockWalletData.pendingEarnings} SAGE pending
              </span>
            </div>
          )}

          <p className="text-sm text-gray-500">
            {mockWalletData.publicBalance} SAGE available to fund
          </p>
        </div>

        <div className="p-4 border-t border-surface-border grid grid-cols-2 gap-3">
          <button
            onClick={onShowPayModal}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
            Pay
          </button>
          <button
            onClick={onShowRequestModal}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface-elevated hover:bg-surface-border text-white font-medium transition-colors border border-surface-border"
          >
            <ArrowDownLeft className="w-5 h-5" />
            Request
          </button>
        </div>

        <div className="p-4 border-t border-surface-border grid grid-cols-2 gap-3">
          <button
            onClick={onShowRolloverModal}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium transition-colors border border-emerald-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Rollover
          </button>
          <button
            onClick={onShowRagequitModal}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/20"
          >
            <AlertTriangle className="w-4 h-4" />
            Ragequit
          </button>
        </div>
      </div>

      {/* Balance Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Public</span>
          </div>
          <p className="text-lg font-bold text-white">{mockWalletData.publicBalance}</p>
          <p className="text-xs text-gray-500">SAGE</p>
        </div>
        
        <div className="glass-card p-4 bg-gradient-to-br from-brand-600/10 to-purple-600/10 border-brand-500/30">
          <div className="flex items-center gap-2 mb-2">
            <EyeOff className="w-4 h-4 text-brand-400" />
            <span className="text-xs text-brand-400">Private</span>
          </div>
          <p className="text-lg font-bold text-brand-400 font-mono">
            {showPrivateBalance ? mockWalletData.privateBalance : "•••••"}
          </p>
          <p className="text-xs text-gray-500">SAGE</p>
        </div>
        
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-400">Pending</span>
          </div>
          <p className="text-lg font-bold text-orange-400">+{mockWalletData.pendingEarnings}</p>
          <p className="text-xs text-gray-500">SAGE</p>
        </div>
      </div>

      {/* Connected Address */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <LogoIcon className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Obelysk Address</p>
              <code className="text-white font-mono text-sm">
                <span className="text-brand-400">{OBELYSK_PREFIX}</span>
                {address ? formatAddress(address) : "0x06df2d05...1865fefe"}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopy(
                getCopyableAddress(address || "0x06df2d051234567890abcdef1865fefe"), 
                "address"
              )}
              className="p-2 rounded-lg hover:bg-surface-elevated transition-colors"
              title="Copy Obelysk address"
            >
              {copiedField === "address" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <a
              href={`https://sepolia.starkscan.co/contract/${address || "0x06df2d05"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-surface-elevated transition-colors"
              title="View on Starkscan"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="glass-card">
        <div className="p-4 border-b border-surface-border">
          <h2 className="font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-surface-border">
          {mockTransactions.slice(0, 3).map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              formatAddress={formatAddress}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>
        <div className="p-4 border-t border-surface-border">
          <button
            onClick={() => {}}
            className="text-sm text-brand-400 hover:text-brand-300 flex items-center justify-center gap-1 w-full"
          >
            View All Transactions <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// ACTIVITY TAB
// ============================================================================

function ActivityTab({
  transactions,
  formatAddress,
  formatTimeAgo,
}: {
  transactions: typeof mockTransactions;
  formatAddress: (addr: string) => string;
  formatTimeAgo: (timestamp: number) => string;
}) {
  const [filter, setFilter] = useState<"all" | "sent" | "received" | "earnings">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTx = transactions.filter(tx => {
    if (filter === "sent" && tx.type !== "send") return false;
    if (filter === "received" && tx.type !== "receive") return false;
    if (filter === "earnings" && !["gpu_earning", "rollover"].includes(tx.type)) return false;
    if (searchQuery && !tx.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tx.recipient?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "sent", "received", "earnings"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                filter === f
                  ? "bg-brand-600 text-white"
                  : "bg-surface-elevated text-gray-400 hover:text-white"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-card divide-y divide-surface-border">
        {filteredTx.length > 0 ? (
          filteredTx.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              formatAddress={formatAddress}
              formatTimeAgo={formatTimeAgo}
              expanded
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// EXPLORER TAB
// ============================================================================

// Layout calculation functions
function calculateCircularLayout(
  nodes: NetworkNode[],
  centerX: number,
  centerY: number,
  radius: number
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const angleStep = (2 * Math.PI) / nodes.length;
  
  // Put "you" at the top
  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.type === "you") return -1;
    if (b.type === "you") return 1;
    // Group by type
    const typeOrder = { pool: 0, validator: 1, client: 2 };
    return (typeOrder[a.type as keyof typeof typeOrder] ?? 3) - (typeOrder[b.type as keyof typeof typeOrder] ?? 3);
  });
  
  sortedNodes.forEach((node, i) => {
    const angle = -Math.PI / 2 + i * angleStep; // Start from top
    positions.set(node.id, {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  });
  
  return positions;
}

function calculateHierarchicalLayout(
  nodes: NetworkNode[],
  edges: typeof mockNetworkEdges,
  startX: number,
  startY: number,
  width: number,
  height: number
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  
  // Group nodes by type (hierarchy levels)
  const levels: Record<string, NetworkNode[]> = {
    you: [],
    pool: [],
    validator: [],
    client: [],
  };
  
  nodes.forEach(node => {
    if (levels[node.type]) {
      levels[node.type].push(node);
    }
  });
  
  // Calculate vertical spacing
  const levelHeight = height / 4;
  const levelY = {
    you: startY + 50,
    pool: startY + levelHeight,
    validator: startY + levelHeight * 2,
    client: startY + levelHeight * 3,
  };
  
  // Position each level horizontally centered
  Object.entries(levels).forEach(([type, levelNodes]) => {
    const levelWidth = width - 100;
    const spacing = levelNodes.length > 1 ? levelWidth / (levelNodes.length - 1) : 0;
    const offsetX = levelNodes.length > 1 ? startX + 50 : startX + width / 2;
    
    levelNodes.forEach((node, i) => {
      positions.set(node.id, {
        x: levelNodes.length > 1 ? offsetX + i * spacing : offsetX,
        y: levelY[type as keyof typeof levelY],
      });
    });
  });
  
  return positions;
}

function calculateForceDirectedLayout(
  nodes: NetworkNode[],
  edges: typeof mockNetworkEdges,
  centerX: number,
  centerY: number,
  iterations: number = 150
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  
  // Group nodes by type for better initial positioning
  const typeGroups: Record<string, number[]> = { you: [], pool: [], validator: [], client: [] };
  nodes.forEach((node, i) => {
    if (typeGroups[node.type]) typeGroups[node.type].push(i);
  });
  
  // Initialize with clustered positions by type
  const nodeData = nodes.map((node, i) => {
    let x = centerX;
    let y = centerY;
    
    if (node.type === "you") {
      // "You" at center
      x = centerX;
      y = centerY;
    } else if (node.type === "pool") {
      // Pools in inner ring around "you"
      const poolIndex = typeGroups.pool.indexOf(i);
      const poolCount = typeGroups.pool.length;
      const angle = (2 * Math.PI * poolIndex) / poolCount - Math.PI / 2;
      x = centerX + 120 * Math.cos(angle);
      y = centerY + 120 * Math.sin(angle);
    } else if (node.type === "validator") {
      // Validators in outer ring
      const valIndex = typeGroups.validator.indexOf(i);
      const valCount = typeGroups.validator.length;
      const angle = (2 * Math.PI * valIndex) / valCount;
      x = centerX + 220 * Math.cos(angle);
      y = centerY + 220 * Math.sin(angle);
    } else {
      // Clients scattered on the outside
      const clientIndex = typeGroups.client.indexOf(i);
      const clientCount = typeGroups.client.length;
      const angle = (2 * Math.PI * clientIndex) / clientCount + Math.PI / 4;
      x = centerX + 280 * Math.cos(angle);
      y = centerY + 280 * Math.sin(angle);
    }
    
    return {
      id: node.id,
      type: node.type,
      x,
      y,
      vx: 0,
      vy: 0,
    };
  });
  
  const getNode = (id: string) => nodeData.find(n => n.id === id);
  
  // Build adjacency for faster lookups
  const adjacency = new Map<string, Set<string>>();
  edges.forEach(edge => {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, new Set());
    if (!adjacency.has(edge.to)) adjacency.set(edge.to, new Set());
    adjacency.get(edge.from)!.add(edge.to);
    adjacency.get(edge.to)!.add(edge.from);
  });
  
  // Force simulation with better parameters
  const repulsionStrength = 2500;
  const attractionStrength = 0.15;
  const idealEdgeLength = 80;
  const centerGravity = 0.008;
  const dampening = 0.9;
  
  for (let iter = 0; iter < iterations; iter++) {
    const cooling = Math.pow(1 - iter / iterations, 1.5); // Smoother cooling curve
    
    // Repulsion between all nodes
    for (let i = 0; i < nodeData.length; i++) {
      for (let j = i + 1; j < nodeData.length; j++) {
        const dx = nodeData[j].x - nodeData[i].x;
        const dy = nodeData[j].y - nodeData[i].y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq) || 1;
        
        // Stronger repulsion for close nodes
        const minDist = 50;
        const effectiveDist = Math.max(dist, minDist);
        const force = (repulsionStrength / (effectiveDist * effectiveDist)) * cooling;
        
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        
        nodeData[i].vx -= fx;
        nodeData[i].vy -= fy;
        nodeData[j].vx += fx;
        nodeData[j].vy += fy;
      }
    }
    
    // Attraction along edges (stronger pull for connected nodes)
    edges.forEach(edge => {
      const from = getNode(edge.from);
      const to = getNode(edge.to);
      if (!from || !to) return;
      
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Pull towards ideal edge length
      const displacement = dist - idealEdgeLength;
      const force = displacement * attractionStrength * cooling;
      
      // Stronger attraction for "your activity" edges
      const multiplier = edge.isYourActivity ? 1.5 : 1;
      
      const fx = (dx / dist) * force * multiplier;
      const fy = (dy / dist) * force * multiplier;
      
      from.vx += fx;
      from.vy += fy;
      to.vx -= fx;
      to.vy -= fy;
    });
    
    // Center gravity (pull everything towards center)
    nodeData.forEach(node => {
      const dx = centerX - node.x;
      const dy = centerY - node.y;
      node.vx += dx * centerGravity * cooling;
      node.vy += dy * centerGravity * cooling;
    });
    
    // Apply velocities with dampening
    nodeData.forEach(node => {
      // Keep "you" strongly centered
      if (node.type === "you") {
        node.vx *= 0.1;
        node.vy *= 0.1;
        // Pull back to center
        node.vx += (centerX - node.x) * 0.1;
        node.vy += (centerY - node.y) * 0.1;
      }
      
      node.x += node.vx;
      node.y += node.vy;
      node.vx *= dampening;
      node.vy *= dampening;
      
      // Boundary constraints - keep nodes in view
      const margin = 50;
      const maxX = centerX * 2 - margin;
      const maxY = centerY * 2 - margin;
      node.x = Math.max(margin, Math.min(maxX, node.x));
      node.y = Math.max(margin, Math.min(maxY, node.y));
    });
  }
  
  nodeData.forEach(node => {
    positions.set(node.id, { x: node.x, y: node.y });
  });
  
  return positions;
}

function ExplorerTab({
  nodes,
  edges,
  poolStats,
  selectedNode,
  onSelectNode,
}: {
  nodes: typeof mockNetworkNodes;
  edges: typeof mockNetworkEdges;
  poolStats: typeof mockPoolStats;
  selectedNode: NetworkNode | null;
  onSelectNode: (node: NetworkNode | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"global" | "personal">("personal");
  const [layout, setLayout] = useState("force-directed");

  // Calculate node positions based on layout
  const layoutPositions = useMemo(() => {
    const centerX = 500;
    const centerY = 300;
    
    switch (layout) {
      case "circular":
        return calculateCircularLayout(nodes, centerX, centerY, 220);
      case "hierarchical":
        return calculateHierarchicalLayout(nodes, edges, 50, 30, 900, 550);
      case "force-directed":
      default:
        return calculateForceDirectedLayout(nodes, edges, centerX, centerY, 100);
    }
  }, [nodes, edges, layout]);

  // Apply layout positions to nodes
  const positionedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      x: layoutPositions.get(node.id)?.x ?? node.x,
      y: layoutPositions.get(node.id)?.y ?? node.y,
    }));
  }, [nodes, layoutPositions]);

  // Calculate graph stats
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
  const density = maxEdges > 0 ? (edgeCount / maxEdges).toFixed(4) : "0";
  const avgDegree = nodeCount > 0 ? ((2 * edgeCount) / nodeCount).toFixed(2) : "0";

  // Count private transactions
  const privateEdges = edges.filter(e => e.isPrivate).length;

  // Draw network graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Apply transformations
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Clear with dark background
    ctx.fillStyle = "#0a0b0f";
    ctx.fillRect(-pan.x / zoom, -pan.y / zoom, canvas.width / zoom + 100, canvas.height / zoom + 100);

    // Draw ALL edges (not filtered) - show full network
    edges.forEach(edge => {
      const fromNode = positionedNodes.find((n: NetworkNode) => n.id === edge.from);
      const toNode = positionedNodes.find((n: NetworkNode) => n.id === edge.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      // Style based on privacy and ownership
      if (edge.isYourActivity) {
        // Your activity = blue, thicker
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
      } else if (edge.isPrivate) {
        // Private = purple dashed
        ctx.strokeStyle = "rgba(139, 92, 246, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      } else {
        // Public = gray solid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw nodes - SMALLER sizes
    positionedNodes.forEach((node: NetworkNode) => {
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode?.id === node.id;
      const isYou = node.type === "you";
      const isConnectedToYou = edges.some(e => 
        (e.from === "you" && e.to === node.id) || 
        (e.to === "you" && e.from === node.id)
      );
      
      // Smaller node sizes
      let radius = 10; // Default
      if (isYou) radius = 16;
      else if (node.type === "pool") radius = 12;
      
      if (isHovered || isSelected) radius += 2;

      // Draw outer glow for "you" node
      if (isYou) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
        ctx.fill();
      }
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      
      // Fill color based on type and connection
      let fillColor = "#6b7280";
      if (isYou) {
        fillColor = "#3b82f6"; // Blue for you
      } else if (node.type === "pool") {
        fillColor = "#10b981"; // Green for pools
      } else if (isConnectedToYou && viewMode === "personal") {
        fillColor = "#a3e635"; // Bright green for connected
      } else {
        fillColor = "#d1d5db"; // Light gray for others
      }
      
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Border for selected/hovered
      if (isSelected) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (isHovered) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Label - show encrypted for private nodes
      ctx.font = "9px ui-monospace, monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.textAlign = "center";
      
      // Privacy masking: show "encrypted" for non-you nodes in personal view
      const displayLabel = (viewMode === "personal" && !isYou && node.isPrivate) 
        ? "•••••••" 
        : node.label;
      ctx.fillText(displayLabel, node.x, node.y + radius + 10);
    });

    // Draw privacy indicator for private edges (? → ?)
    if (viewMode === "personal") {
      edges.filter(e => e.isPrivate && e.isYourActivity).forEach(edge => {
        const fromNode = positionedNodes.find((n: NetworkNode) => n.id === edge.from);
        const toNode = positionedNodes.find((n: NetworkNode) => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        ctx.font = "bold 8px ui-monospace";
        ctx.fillStyle = "#8b5cf6";
        ctx.textAlign = "center";
        ctx.fillText("? → ?", midX, midY - 4);
      });
    }
  }, [positionedNodes, edges, zoom, pan, hoveredNode, selectedNode, viewMode]);

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for panning and hover
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isPanning) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const hovered = positionedNodes.find((node: NetworkNode) => {
      let radius = 10;
      if (node.type === "you") radius = 16;
      else if (node.type === "pool") radius = 12;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < radius;
    });

    setHoveredNode(hovered?.id || null);
    canvas.style.cursor = hovered ? "pointer" : isPanning ? "grabbing" : "grab";
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const clickedNode = positionedNodes.find((node: NetworkNode) => {
      let radius = 10;
      if (node.type === "you") radius = 16;
      else if (node.type === "pool") radius = 12;
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < radius;
    });

    onSelectNode(clickedNode || null);
  };

  // Handle wheel for zoom - less sensitive
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    // Require minimum scroll amount to trigger zoom (reduces accidental zooms)
    const threshold = 20;
    if (Math.abs(e.deltaY) < threshold) return;
    
    // Smaller zoom steps for finer control
    const zoomStep = 0.05;
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    
    setZoom(z => {
      const newZoom = z + delta;
      // Clamp between 0.4 and 1.8 for usable range
      return Math.min(1.8, Math.max(0.4, newZoom));
    });
  }, []);

  // Reset view
  const resetView = () => {
    setZoom(0.8);
    setPan({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Network Graph Canvas - Full Height with Floating Controls */}
      <div className="glass-card overflow-hidden rounded-xl relative" style={{ height: "calc(100vh - 240px)", minHeight: 500 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
        
        {/* Floating Top Bar - Compact Stats + Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Left: Stats Pills */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
              <span className="text-[10px] text-gray-400 uppercase">Nodes</span>
              <span className="text-sm font-bold text-white">{nodeCount}</span>
              <span className="text-gray-600">|</span>
              <span className="text-[10px] text-gray-400 uppercase">Edges</span>
              <span className="text-sm font-bold text-white">{edgeCount}</span>
              <span className="text-gray-600">|</span>
              <span className="text-[10px] text-purple-400 uppercase">Private</span>
              <span className="text-sm font-bold text-purple-400">{privateEdges}</span>
            </div>
          </div>
          
          {/* Right: Layout + View Toggle */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="force-directed">Force</option>
              <option value="circular">Circular</option>
              <option value="hierarchical">Tree</option>
            </select>
            
            <div className="flex items-center gap-0.5 p-0.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg">
              <button
                onClick={() => setViewMode("global")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-medium transition-all",
                  viewMode === "global"
                    ? "bg-white/20 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                All
              </button>
              <button
                onClick={() => setViewMode("personal")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-medium transition-all",
                  viewMode === "personal"
                    ? "bg-brand-600 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                You
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Bottom Left - Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[10px] text-gray-300">You</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-gray-300">Pools</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="text-[10px] text-gray-300">Accounts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 border-t border-dashed border-purple-400" />
            <span className="text-[10px] text-purple-400">Private</span>
          </div>
        </div>
        
        {/* Floating Bottom Right - Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 p-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
          <button
            onClick={() => setZoom(z => Math.max(0.4, z - 0.15))}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5 text-gray-300" />
          </button>
          <span className="text-[10px] text-gray-400 min-w-[32px] text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(1.8, z + 0.15))}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-gray-300" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            title="Reset view"
          >
            <Maximize2 className="w-3.5 h-3.5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Selected Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-4"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  selectedNode.type === "you" && "bg-blue-500/20",
                  selectedNode.type === "pool" && "bg-emerald-500/20",
                  selectedNode.type === "validator" && "bg-gray-500/20",
                  selectedNode.type === "client" && "bg-gray-500/20"
                )}>
                  {selectedNode.type === "you" && <Wallet className="w-6 h-6 text-blue-400" />}
                  {selectedNode.type === "pool" && <Layers className="w-6 h-6 text-emerald-400" />}
                  {selectedNode.type === "validator" && <Server className="w-6 h-6 text-gray-400" />}
                  {selectedNode.type === "client" && <Users className="w-6 h-6 text-gray-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedNode.label}</h3>
                  <p className="text-xs text-gray-500 capitalize">{selectedNode.type}</p>
                </div>
              </div>
              <button
                onClick={() => onSelectNode(null)}
                className="p-2 rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedNode.type === "you" && (
                <>
                  <div className="p-3 rounded-lg bg-surface-elevated">
                    <p className="text-xs text-gray-500 mb-1">Balance</p>
                    <p className="text-sm font-medium text-brand-400 font-mono">
                      {selectedNode.isPrivate ? "•••••" : selectedNode.balance} SAGE
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-elevated">
                    <p className="text-xs text-gray-500 mb-1">Privacy</p>
                    <p className="text-sm font-medium text-brand-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Enabled
                    </p>
                  </div>
                </>
              )}
              {selectedNode.type === "pool" && (
                <>
                  <div className="p-3 rounded-lg bg-surface-elevated">
                    <p className="text-xs text-gray-500 mb-1">TVL</p>
                    <p className="text-sm font-medium text-white">{selectedNode.tvl} SAGE</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-elevated">
                    <p className="text-xs text-gray-500 mb-1">Validators</p>
                    <p className="text-sm font-medium text-white">{selectedNode.validators}</p>
                  </div>
                </>
              )}
              {selectedNode.type === "validator" && (
                <>
                  <div className="p-3 rounded-lg bg-surface-elevated">
                    <p className="text-xs text-gray-500 mb-1">Earnings</p>
                    <p className="text-sm font-medium text-emerald-400">{selectedNode.earnings}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-elevated">
                    <p className="text-xs text-gray-500 mb-1">Uptime</p>
                    <p className="text-sm font-medium text-white">{selectedNode.uptime}</p>
                  </div>
                </>
              )}
              {selectedNode.type === "client" && (
                <>
                  <div className="p-3 rounded-lg bg-surface-elevated">
                    <p className="text-xs text-gray-500 mb-1">Jobs</p>
                    <p className="text-sm font-medium text-white">{selectedNode.jobs}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-elevated">
                    <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                    <p className="text-sm font-medium text-white">{selectedNode.spent} SAGE</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

function TransactionRow({
  tx,
  formatAddress,
  formatTimeAgo,
  expanded = false,
}: {
  tx: typeof mockTransactions[0];
  formatAddress: (addr: string) => string;
  formatTimeAgo: (timestamp: number) => string;
  expanded?: boolean;
}) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-surface-elevated/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          tx.type === "send" && "bg-red-500/10",
          tx.type === "receive" && "bg-emerald-500/10",
          tx.type === "rollover" && "bg-brand-500/10",
          tx.type === "gpu_earning" && "bg-orange-500/10",
          tx.type === "stake" && "bg-purple-500/10"
        )}>
          {tx.type === "send" && <ArrowUpRight className="w-5 h-5 text-red-400" />}
          {tx.type === "receive" && <ArrowDownLeft className="w-5 h-5 text-emerald-400" />}
          {tx.type === "rollover" && <RefreshCw className="w-5 h-5 text-brand-400" />}
          {tx.type === "gpu_earning" && <Zap className="w-5 h-5 text-orange-400" />}
          {tx.type === "stake" && <Lock className="w-5 h-5 text-purple-400" />}
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {tx.type === "send" && `To ${tx.recipientName || formatObelyskAddress(tx.recipient!, { truncate: true, prefix: false })}`}
            {tx.type === "receive" && `From ${tx.recipientName || formatAddress(tx.recipient!)}`}
            {tx.type === "rollover" && "Rollover"}
            {tx.type === "gpu_earning" && tx.recipientName}
            {tx.type === "stake" && tx.recipientName}
          </p>
          <p className="text-xs text-gray-500">
            {tx.isPrivate ? (
              <span className="text-brand-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Private
              </span>
            ) : tx.recipient ? (
              <span className="font-mono">
                <span className="text-brand-400/60">{OBELYSK_PREFIX}</span>
                {formatAddress(tx.recipient)}
              </span>
            ) : (
              tx.status === "pending" ? "Pending confirmation" : "Claimed to private"
            )}
          </p>
        </div>
      </div>
      <div className="text-right flex items-center gap-3">
        <div>
          <p className={cn(
            "text-sm font-medium",
            tx.amount.startsWith("+") ? "text-emerald-400" : "text-white"
          )}>
            {tx.isPrivate ? (
              <span className="text-brand-400 font-mono">? → ?</span>
            ) : (
              `${tx.amount} SAGE`
            )}
          </p>
          <p className="text-xs text-gray-500">{formatTimeAgo(tx.timestamp)}</p>
        </div>
        {expanded && tx.txHash && (
          <a
            href={`https://sepolia.starkscan.co/tx/${tx.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </a>
        )}
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </div>
    </div>
  );
}

// ============================================================================
// MODALS
// ============================================================================

function RolloverModal({
  show,
  onClose,
  provingState,
  provingTime,
  onRollover,
}: {
  show: boolean;
  onClose: () => void;
  provingState: ProvingState;
  provingTime: number | null;
  onRollover: () => void;
}) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-card border border-white/10 rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-brand-400" />
            Rollover
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {provingState === "idle" ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-brand-400" />
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Claim your pending GPU earnings to your private balance.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Pending Earnings</span>
                  <span className="text-lg font-bold text-emerald-400">
                    +{mockWalletData.pendingEarnings} SAGE
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Destination</span>
                  <span className="text-brand-400">Private Balance</span>
                </div>
              </div>
              
              <button
                onClick={onRollover}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-medium transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Rollover to Private
              </button>
            </div>
          ) : (
            <ProvingFlow
              state={provingState}
              provingTime={provingTime}
              title="Rolling Over"
              onComplete={onClose}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RagequitModal({
  show,
  onClose,
  provingState,
  provingTime,
  showPrivateBalance,
  onRagequit,
  address,
  formatAddress,
}: {
  show: boolean;
  onClose: () => void;
  provingState: ProvingState;
  provingTime: number | null;
  showPrivateBalance: boolean;
  onRagequit: () => void;
  address: string | undefined;
  formatAddress: (addr: string) => string;
}) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-card border border-white/10 rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Ragequit
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {provingState === "idle" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-400 mb-1">Full Exit Warning</p>
                    <p className="text-xs text-gray-400">
                      This withdraws your <strong className="text-white">entire</strong> private balance to public.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border">
                <p className="text-xs text-gray-500 mb-1">BALANCE TO WITHDRAW</p>
                <p className="text-2xl font-bold text-white">
                  {showPrivateBalance ? mockWalletData.privateBalance : "••••"} SAGE
                </p>
              </div>
              
              <button
                onClick={onRagequit}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Unlock className="w-5 h-5" />
                Ragequit - Withdraw All
              </button>
            </div>
          ) : (
            <ProvingFlow
              state={provingState}
              provingTime={provingTime}
              title="Withdrawing"
              onComplete={onClose}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PayModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-card border border-white/10 rounded-2xl p-6 w-full max-w-md text-center"
      >
        <ArrowUpRight className="w-12 h-12 text-brand-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Send Payment</h3>
        <p className="text-gray-400 mb-4">
          Use the dedicated <Link href="/send" className="text-brand-400 hover:underline">Send page</Link> for transfers.
        </p>
        <Link
          href="/send"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
        >
          Go to Send <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

function RequestModal({
  show,
  onClose,
  address,
  copiedField,
  onCopy,
  formatAddress,
}: {
  show: boolean;
  onClose: () => void;
  address: string | undefined;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
  formatAddress: (addr: string) => string;
}) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-card border border-white/10 rounded-2xl p-6 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <ArrowDownLeft className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Request Payment</h3>
          <p className="text-gray-400 text-sm">Share your Obelysk address or payment link.</p>
        </div>
        
        <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border mb-3">
          <p className="text-xs text-gray-500 mb-2">Your Obelysk Address</p>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono flex-1 truncate">
              <span className="text-brand-400">{OBELYSK_PREFIX}</span>
              <span className="text-white">{formatAddress(address || "0x06df2d051234567890abcdef1865fefe")}</span>
            </code>
            <button
              onClick={() => onCopy(getCopyableAddress(address || "0x06df2d051234567890abcdef1865fefe"), "request")}
              className="p-2 rounded-lg bg-surface-card hover:bg-surface-border transition-colors"
            >
              {copiedField === "request" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-600/10 border border-brand-500/30 mb-4">
          <p className="text-xs text-brand-400 mb-2">Payment Link (Private)</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-gray-300 font-mono flex-1 truncate">
              {createPaymentUri(address || "0x06df2d051234567890abcdef1865fefe", { private: true })}
            </code>
            <button
              onClick={() => onCopy(createPaymentUri(address || "0x06df2d051234567890abcdef1865fefe", { private: true }), "paymentUri")}
              className="p-2 rounded-lg bg-surface-card hover:bg-surface-border transition-colors"
            >
              {copiedField === "paymentUri" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Share this link for private payments</p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-surface-elevated hover:bg-surface-border text-white font-medium transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

function ProvingFlow({
  state,
  provingTime,
  title,
  onComplete,
}: {
  state: ProvingState;
  provingTime: number | null;
  title: string;
  onComplete: () => void;
}) {
  const steps = [
    { key: "proving", label: "Proving" },
    { key: "sending", label: "Sending" },
    { key: "confirming", label: "Confirming" },
    { key: "confirmed", label: "Confirmed" },
  ];

  const currentIndex = steps.findIndex(s => s.key === state);

  return (
    <div className="py-8">
      {state !== "confirmed" ? (
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
        </div>
      ) : (
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
        </div>
      )}
      
      <p className="text-center text-lg font-medium text-white mb-8">
        {state === "confirmed" ? "Complete!" : title}
      </p>
      
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex || state === "confirmed";
          const isCurrent = step.key === state && state !== "confirmed";
          const isPending = idx > currentIndex && state !== "confirmed";
          
          return (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isCompleted && "bg-emerald-500",
                  isCurrent && "bg-brand-500 animate-pulse",
                  isPending && "bg-surface-border"
                )}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <div className={cn("w-3 h-3 rounded-full", isCurrent ? "bg-white" : "bg-gray-600")} />
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn("w-0.5 h-12", isCompleted ? "bg-emerald-500" : "bg-surface-border")} />
                )}
              </div>
              
              <div className="pt-1">
                <p className={cn("font-medium", isCompleted || isCurrent ? "text-white" : "text-gray-600")}>
                  {step.label}
                </p>
                {isCompleted && step.key === "proving" && provingTime && (
                  <p className="text-xs text-emerald-400">Proved in {provingTime}ms</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {state === "confirmed" && (
        <button
          onClick={onComplete}
          className="mt-8 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
        >
          Done
        </button>
      )}
    </div>
  );
}
