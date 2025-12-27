"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import {
  Droplets,
  Wallet,
  CheckCircle2,
  Loader2,
  ExternalLink,
  AlertCircle,
  Gift,
  Clock,
  Coins,
  Twitter,
  Users,
  WifiOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { LogoIcon } from "@/components/ui/Logo";
import { EXTERNAL_LINKS } from "@/lib/contracts/addresses";
import { useFaucetStatus, useFaucetConfig, useClaimFaucet, useApiHealth } from "@/lib/hooks/useApiData";

// Social tasks for earning extra tokens
const socialTasks = [
  {
    id: "twitter_follow",
    title: "Follow on Twitter",
    description: "Follow @BitSageNetwork",
    reward: "10",
    icon: Twitter,
    link: "https://twitter.com/BitSageNetwork",
    oneTimeOnly: true,
  },
  {
    id: "discord_join",
    title: "Join Discord",
    description: "Join our community",
    reward: "10",
    icon: Users,
    link: "https://discord.gg/bitsage",
    oneTimeOnly: true,
  },
];

export default function FaucetPage() {
  const { address } = useAccount();
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // API hooks
  const { isOnline } = useApiHealth();
  const { data: faucetStatus, isLoading: statusLoading, refetch: refetchStatus } = useFaucetStatus(address);
  const { data: faucetConfig } = useFaucetConfig();
  const claimMutation = useClaimFaucet();

  // Load completed tasks from localStorage
  useEffect(() => {
    if (address) {
      const tasks = localStorage.getItem(`faucet_tasks_${address}`);
      if (tasks) {
        setCompletedTasks(JSON.parse(tasks));
      }
    }
  }, [address]);

  // Update countdown timer
  useEffect(() => {
    if (!faucetStatus || faucetStatus.can_claim) {
      setTimeRemaining("");
      return;
    }

    const updateTimer = () => {
      const secs = faucetStatus.time_until_next_claim_secs;
      if (secs <= 0) {
        refetchStatus();
        setTimeRemaining("");
        return;
      }

      const hours = Math.floor(secs / 3600);
      const minutes = Math.floor((secs % 3600) / 60);
      const seconds = secs % 60;
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [faucetStatus, refetchStatus]);

  const handleRequestTokens = async () => {
    if (!address || !faucetStatus?.can_claim) return;

    setSuccess(false);
    setTxHash(null);

    try {
      const result = await claimMutation.mutateAsync({ address });
      if (result.success) {
        setTxHash(result.transaction_hash);
        setSuccess(true);
      }
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleTaskComplete = (taskId: string) => {
    if (completedTasks.includes(taskId)) return;

    const newCompleted = [...completedTasks, taskId];
    setCompletedTasks(newCompleted);
    if (address) {
      localStorage.setItem(`faucet_tasks_${address}`, JSON.stringify(newCompleted));
    }
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 10)}...${addr.slice(-8)}`;

  const isLoading = claimMutation.isPending;
  const error = claimMutation.error?.message;
  const canClaim = faucetStatus?.can_claim && !isLoading;
  const cooldownActive = faucetStatus && !faucetStatus.can_claim;
  const claimAmount = faucetStatus?.claim_amount_formatted || faucetConfig?.claim_amount_formatted || "20 SAGE";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-cyan/20 border border-brand-500/30 mb-4"
        >
          <Droplets className="w-10 h-10 text-brand-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white">Testnet Faucet</h1>
        <p className="text-gray-400 mt-2">
          Get SAGE tokens for testing on Sepolia. Earn more by joining our community!
        </p>
      </div>

      {/* Connection Status */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30"
        >
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-sm font-medium text-orange-400">API Unavailable</p>
              <p className="text-sm text-gray-400">
                Unable to connect to the faucet API. Please try again later.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Faucet Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-brand-600/20 to-accent-purple/20 border-b border-surface-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-surface-card/50">
                <LogoIcon className="text-brand-400" size={32} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">SAGE Token Faucet</h2>
                <p className="text-sm text-gray-400">
                  {faucetConfig?.network || "Sepolia"} Testnet
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{claimAmount.replace(" SAGE", "")}</p>
              <p className="text-sm text-gray-400">SAGE per request</p>
              <p className="text-xs text-gray-500 mt-1">
                {faucetConfig?.cooldown_formatted || "24 hours"} cooldown
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Connected Wallet */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Receiving Address</label>
            <div className="flex items-center gap-3 p-4 bg-surface-elevated rounded-xl border border-surface-border">
              <Wallet className="w-5 h-5 text-brand-400" />
              <code className="text-sm text-white font-mono flex-1 truncate">
                {address ? formatAddress(address) : "Connect wallet to continue"}
              </code>
              {address && (
                <a
                  href={`https://sepolia.starkscan.co/contract/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-400"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Token Amount & Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border">
              <div className="flex items-center gap-2 mb-2">
                <LogoIcon className="text-brand-400" size={20} />
                <span className="text-sm text-gray-400">Claim Amount</span>
              </div>
              <p className="text-2xl font-bold text-white">{claimAmount}</p>
            </div>
            {faucetStatus && (
              <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-brand-400" />
                  <span className="text-sm text-gray-400">Total Claimed</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {faucetStatus.total_claimed_formatted || "0 SAGE"}
                </p>
              </div>
            )}
          </div>

          {/* Cooldown Notice */}
          {cooldownActive && timeRemaining && (
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-orange-400">Cooldown Active</p>
                  <p className="text-sm text-gray-400">
                    Next claim available in: <span className="text-white font-mono">{timeRemaining}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Faucet Disabled Notice */}
          {faucetConfig && !faucetConfig.enabled && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-400">Faucet Disabled</p>
                  <p className="text-sm text-gray-400">
                    The faucet is currently disabled. Please check back later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Request Button */}
          <button
            onClick={handleRequestTokens}
            disabled={isLoading || !address || !canClaim || statusLoading || !isOnline}
            className="btn-glow w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Requesting Tokens...
              </>
            ) : statusLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking Status...
              </>
            ) : cooldownActive ? (
              <>
                <Clock className="w-5 h-5" />
                Cooldown Active
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                Request {claimAmount}
              </>
            )}
          </button>

          {/* Success Message */}
          {success && txHash && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-emerald-400">Tokens Sent Successfully!</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {claimAmount} have been sent to your wallet.
                  </p>
                  <a
                    href={`https://sepolia.starkscan.co/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-400 hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    View transaction <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium text-red-400">Request Failed</p>
                  <p className="text-sm text-gray-400 mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Bonus Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-brand-400" />
          Earn More Tokens
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Complete social tasks to earn more SAGE tokens for testing
        </p>
        <div className="space-y-3">
          {socialTasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-surface-border"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isCompleted ? "bg-emerald-500/20" : "bg-surface-card"}`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <task.icon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-400">+{task.reward} SAGE</span>
                  {task.oneTimeOnly && (
                    <span className="text-xs text-gray-500">(one-time)</span>
                  )}
                  {isCompleted ? (
                    <span className="badge badge-success">Done</span>
                  ) : (
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTaskComplete(task.id)}
                      className="btn-secondary text-sm py-2 px-3"
                    >
                      Complete
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="font-medium text-white mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            Daily Limit
          </h3>
          <p className="text-sm text-gray-400">
            You can request {claimAmount} once every {faucetConfig?.cooldown_formatted || "24 hours"}.
            Complete social tasks above to earn +10 SAGE each (one-time per wallet).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="font-medium text-white mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-brand-400" />
            Need More?
          </h3>
          <p className="text-sm text-gray-400">
            Complete the social tasks above to earn +10 SAGE each, or join our{" "}
            <a href={EXTERNAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
              Discord
            </a>{" "}
            to request additional testnet tokens for development and testing.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
