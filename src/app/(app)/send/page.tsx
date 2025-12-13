"use client";

import { useState } from "react";
import {
  Send,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Clock,
  CheckCircle2,
  Loader2,
  Info,
  User,
  Copy,
  ExternalLink,
  Zap,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PrivacyBalanceCard, PrivacyModeToggle } from "@/components/privacy/PrivacyToggle";
import { useObelyskWallet } from "@/lib/obelysk/ObelyskWalletContext";
import Link from "next/link";

// Mock recent transfers
const recentTransfers = [
  {
    id: "tx_001",
    to: "0x04f3...8a2c",
    amount: "250.00",
    status: "completed",
    time: "10 min ago",
    private: true,
    txHash: null, // Private = no visible hash
  },
  {
    id: "tx_002",
    to: "0x07b2...1e4f",
    amount: "1,000.00",
    status: "completed",
    time: "2h ago",
    private: false,
    txHash: "0x07a8...3f2b",
  },
  {
    id: "tx_003",
    to: "0x03c1...9d8e",
    amount: "75.50",
    status: "pending",
    time: "Just now",
    private: true,
    txHash: null,
  },
];

// Mock contacts
const savedContacts = [
  { name: "Alice", address: "0x04f3...8a2c" },
  { name: "Bob", address: "0x07b2...1e4f" },
  { name: "Treasury", address: "0x03c1...9d8e" },
];

export default function SendPage() {
  const { 
    balance, 
    isPrivateRevealed, 
    sendPrivate, 
    sendPublic, 
    provingState, 
    provingTime,
    resetProvingState 
  } = useObelyskWallet();
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [privacyMode, setPrivacyMode] = useState(false);
  const [usePrivateBalance, setUsePrivateBalance] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const handleWrap = async (amount: string) => {
    console.log("Wrapping", amount, "SAGE to private");
    await new Promise((r) => setTimeout(r, 2000));
  };

  const handleUnwrap = async (amount: string) => {
    console.log("Unwrapping", amount, "SAGE to public");
    await new Promise((r) => setTimeout(r, 2000));
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      if (privacyMode || usePrivateBalance) {
        await sendPrivate(recipient, amount);
      } else {
        await sendPublic(recipient, amount);
      }
      setSendSuccess(true);
      setTimeout(() => {
        setShowConfirm(false);
        setSendSuccess(false);
        setAmount("");
        setRecipient("");
        resetProvingState();
      }, 2000);
    } catch (error) {
      console.error("Send failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Use balances from Obelysk wallet
  const availableBalance = usePrivateBalance 
    ? balance.private 
    : balance.public;

  const isValidAmount = amount && parseFloat(amount) > 0;
  const isValidRecipient = recipient.length > 10;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Send SAGE</h1>
        <p className="text-gray-400 mt-1">
          Transfer tokens publicly or privately
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

      {/* Balance Card */}
      <PrivacyBalanceCard
        publicBalance={balance.public}
        privateBalance={balance.private}
        onWrap={handleWrap}
        onUnwrap={handleUnwrap}
      />

      {/* Send Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="p-6 space-y-5">
          {/* Privacy Mode Toggle */}
          <PrivacyModeToggle
            enabled={privacyMode}
            onToggle={(enabled) => {
              setPrivacyMode(enabled);
              if (enabled) setUsePrivateBalance(true);
            }}
          />

          {/* Source Balance Toggle */}
          <div className={cn(
            "flex items-center justify-between p-3 rounded-xl border transition-all",
            usePrivateBalance 
              ? "bg-brand-600/10 border-brand-500/30" 
              : "bg-surface-elevated/50 border-surface-border"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                usePrivateBalance ? "bg-brand-500/30" : "bg-surface-elevated"
              )}>
                {usePrivateBalance ? (
                  <EyeOff className="w-4 h-4 text-brand-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Send from</p>
                <p className="text-xs text-gray-500">
                  {usePrivateBalance ? "Private balance" : "Public balance"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {usePrivateBalance ? (
                <span className="text-brand-400 font-mono">•••••</span>
              ) : (
                <span className="text-white font-medium">{balance.public}</span>
              )}
              <span className="text-sm text-gray-400">SAGE</span>
              <button
                onClick={() => setUsePrivateBalance(!usePrivateBalance)}
                className="text-xs text-brand-400 hover:text-brand-300"
              >
                Switch
              </button>
            </div>
          </div>

          {/* Recipient Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recipient</label>
            <div className="relative">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                onFocus={() => setShowContacts(true)}
                onBlur={() => setTimeout(() => setShowContacts(false), 200)}
                placeholder="0x... or select contact"
                className="input-field pr-24"
              />
              <button
                onClick={() => navigator.clipboard.readText().then(setRecipient)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Paste
              </button>
              
              {/* Contacts Dropdown */}
              <AnimatePresence>
                {showContacts && savedContacts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-surface-card border border-surface-border rounded-xl shadow-xl z-10 overflow-hidden"
                  >
                    <p className="text-xs text-gray-500 px-4 py-2 border-b border-surface-border">
                      Saved Contacts
                    </p>
                    {savedContacts.map((contact) => (
                      <button
                        key={contact.address}
                        onClick={() => {
                          setRecipient(contact.address);
                          setShowContacts(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-brand-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-white">{contact.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{contact.address}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount</label>
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
                  onClick={() => setAmount(availableBalance.replace(/,/g, ""))}
                  className="text-xs text-brand-400 hover:text-brand-300"
                >
                  MAX
                </button>
                <span className="text-gray-400">SAGE</span>
              </div>
            </div>
          </div>

          {/* Transaction Preview */}
          <div className={cn(
            "p-4 rounded-xl border space-y-3",
            privacyMode 
              ? "bg-gradient-to-r from-brand-600/10 to-accent-purple/10 border-brand-500/30" 
              : "bg-surface-elevated/50 border-surface-border"
          )}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">You send</span>
              {privacyMode ? (
                <span className="text-brand-400 font-mono tracking-wider">••••••• SAGE</span>
              ) : (
                <span className="text-white">{amount || "0.00"} SAGE</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Recipient sees</span>
              {privacyMode ? (
                <span className="text-brand-400 font-mono tracking-wider">••••••• SAGE</span>
              ) : (
                <span className="text-white">{amount || "0.00"} SAGE</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Transaction fee</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Sponsored (AA)
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Privacy</span>
              {privacyMode ? (
                <span className="text-brand-400 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> End-to-end encrypted
                </span>
              ) : (
                <span className="text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Public on-chain
                </span>
              )}
            </div>
          </div>

          {/* Privacy Info */}
          {privacyMode && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-600/10 border border-brand-500/20">
              <Shield className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-400">
                <strong className="text-brand-400">Private Transfer:</strong> This transaction will 
                generate a ZK proof (~2ms). The amount and recipient will show as{" "}
                <span className="font-mono text-brand-400">? → ?</span> on block explorers. 
                Only you and the recipient can see the actual values.
              </div>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!isValidAmount || !isValidRecipient}
            className={cn(
              "w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all",
              !isValidAmount || !isValidRecipient
                ? "bg-surface-elevated text-gray-500 cursor-not-allowed"
                : privacyMode
                  ? "bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-500 hover:to-accent-purple/90 text-white"
                  : "btn-glow"
            )}
          >
            {privacyMode ? (
              <>
                <EyeOff className="w-5 h-5" />
                Send Privately
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send SAGE
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Recent Transfers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-medium text-white">Recent Transfers</h3>
          <span className="text-xs text-gray-500">{recentTransfers.length} transactions</span>
        </div>
        <div className="divide-y divide-surface-border">
          {recentTransfers.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  tx.status === "completed" 
                    ? "bg-emerald-500/20" 
                    : "bg-orange-500/20"
                )}>
                  {tx.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">{tx.to}</span>
                    {tx.private && (
                      <span className="text-brand-400">
                        <EyeOff className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{tx.time}</span>
                    {tx.txHash && !tx.private && (
                      <a 
                        href="#" 
                        className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                      >
                        {tx.txHash} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {tx.private && (
                      <span className="text-xs text-brand-400/60 font-mono">encrypted</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {tx.private ? (
                  <span className="text-brand-400 font-mono tracking-wider">•••••</span>
                ) : (
                  <span className="text-white font-medium">{tx.amount}</span>
                )}
                <p className="text-xs text-gray-500">SAGE</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isSending && !sendSuccess && setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {sendSuccess ? (
                /* Success State */
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Transfer {privacyMode ? "Sent Privately" : "Complete"}!
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {privacyMode 
                      ? "Your private transfer has been sent. The transaction appears as ? → ? on-chain."
                      : `${amount} SAGE sent successfully.`
                    }
                  </p>
                </div>
              ) : isSending ? (
                /* Sending State - like Tongo's rollover */
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white text-center mb-6">
                    {privacyMode ? "Private Transfer" : "Sending"}
                  </h3>
                  <div className="space-y-4">
                    {/* Progress Steps */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {privacyMode ? "Proving" : "Preparing"}
                        </p>
                        <p className="text-xs text-emerald-400">
                          {privacyMode ? "Proved in 2ms" : "Transaction prepared"}
                        </p>
                      </div>
                    </div>
                    <div className="w-0.5 h-6 bg-emerald-500/30 ml-5" />
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Sending</p>
                        <p className="text-xs text-gray-500">Broadcasting to network...</p>
                      </div>
                    </div>
                    <div className="w-0.5 h-6 bg-surface-border ml-5" />
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-500">Confirming</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Confirmation State */
                <>
                  <div className="p-4 border-b border-surface-border">
                    <h3 className="font-semibold text-white text-center flex items-center justify-center gap-2">
                      {privacyMode ? (
                        <>
                          <EyeOff className="w-5 h-5 text-brand-400" />
                          Confirm Private Transfer
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Confirm Transfer
                        </>
                      )}
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Visual Flow */}
                    <div className="flex items-center justify-center gap-4 py-4">
                      <div className="text-center">
                        <div className="text-2xl mb-1">👤</div>
                        <span className="text-xs text-gray-400">You</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <ArrowRight className="w-6 h-6 text-brand-400" />
                        {privacyMode ? (
                          <span className="text-xs text-brand-400 font-mono mt-1">? → ?</span>
                        ) : (
                          <span className="text-xs text-gray-400 mt-1">{amount} SAGE</span>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-1">👤</div>
                        <span className="text-xs text-gray-400 font-mono">{recipient.slice(0, 8)}...</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className={cn(
                      "p-4 rounded-xl border space-y-2",
                      privacyMode ? "bg-brand-600/10 border-brand-500/20" : "bg-surface-elevated border-surface-border"
                    )}>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Amount</span>
                        {privacyMode ? (
                          <span className="text-brand-400 font-mono">•••••••</span>
                        ) : (
                          <span className="text-white">{amount} SAGE</span>
                        )}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Recipient</span>
                        <span className="text-white font-mono text-xs">{recipient}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">From</span>
                        <span className={cn(
                          "flex items-center gap-1",
                          usePrivateBalance ? "text-brand-400" : "text-white"
                        )}>
                          {usePrivateBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {usePrivateBalance ? "Private" : "Public"} balance
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fee</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Sponsored
                        </span>
                      </div>
                    </div>

                    {privacyMode && (
                      <div className="flex items-center gap-2 text-xs text-brand-400">
                        <Zap className="w-3 h-3" />
                        ZK proof will be generated (~2ms)
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-surface-border flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 rounded-lg border border-surface-border text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSend}
                      className={cn(
                        "flex-1 py-3 rounded-lg font-medium transition-all",
                        privacyMode
                          ? "bg-gradient-to-r from-brand-600 to-accent-purple text-white"
                          : "bg-brand-600 hover:bg-brand-500 text-white"
                      )}
                    >
                      {privacyMode ? "Send Privately" : "Confirm Send"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
