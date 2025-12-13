"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

// Types
export interface ObelyskBalance {
  public: string;
  private: string; // Encrypted - only revealed with signature
  pending: string; // GPU earnings waiting to be rolled over
}

export interface ObelyskTransaction {
  id: string;
  type: "send" | "receive" | "rollover" | "ragequit" | "gpu_earning" | "stake" | "unstake";
  amount: string;
  from?: string;
  to?: string;
  timestamp: number;
  isPrivate: boolean;
  status: "pending" | "proving" | "sending" | "confirmed" | "failed";
  proofTime?: number; // ms
  txHash?: string;
}

export interface EncryptionKeys {
  publicKey: string | null;
  // Private key is never stored - derived from signature each time
  isInitialized: boolean;
}

export type ProvingState = "idle" | "proving" | "sending" | "confirming" | "confirmed" | "error";

interface ObelyskWalletContextType {
  // Balances
  balance: ObelyskBalance;
  totalBalanceUsd: string;
  
  // Privacy state
  isPrivateRevealed: boolean;
  encryptionKeys: EncryptionKeys;
  
  // Actions
  revealPrivateBalance: () => Promise<void>;
  hidePrivateBalance: () => void;
  initializeEncryption: () => Promise<void>;
  
  // Transactions
  transactions: ObelyskTransaction[];
  
  // Flows
  rollover: () => Promise<void>;
  ragequit: () => Promise<void>;
  sendPrivate: (to: string, amount: string) => Promise<void>;
  sendPublic: (to: string, amount: string) => Promise<void>;
  
  // Proving state
  provingState: ProvingState;
  provingTime: number | null;
  resetProvingState: () => void;
  
  // Wallet connection
  isConnected: boolean;
  connectorId: string | null;
}

const ObelyskWalletContext = createContext<ObelyskWalletContextType | null>(null);

// Mock data for demo
const MOCK_BALANCE: ObelyskBalance = {
  public: "210.8093",
  private: "47.25",
  pending: "15.00",
};

const MOCK_TRANSACTIONS: ObelyskTransaction[] = [
  {
    id: "tx_001",
    type: "send",
    amount: "5",
    to: "0x0724...123b",
    timestamp: Date.now() - 60000,
    isPrivate: true,
    status: "confirmed",
    proofTime: 2,
  },
  {
    id: "tx_002",
    type: "send",
    amount: "5",
    to: "0x0724...123b",
    timestamp: Date.now() - 120000,
    isPrivate: true,
    status: "confirmed",
    proofTime: 3,
  },
  {
    id: "tx_003",
    type: "rollover",
    amount: "12.5",
    timestamp: Date.now() - 180000,
    isPrivate: false,
    status: "confirmed",
    proofTime: 148,
  },
  {
    id: "tx_004",
    type: "receive",
    amount: "25",
    from: "0x8a3f...e7b2",
    timestamp: Date.now() - 300000,
    isPrivate: true,
    status: "confirmed",
  },
  {
    id: "tx_005",
    type: "gpu_earning",
    amount: "3.2",
    timestamp: Date.now() - 600000,
    isPrivate: false,
    status: "pending",
  },
];

export function ObelyskWalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connector } = useConnect();
  
  // State
  const [balance, setBalance] = useState<ObelyskBalance>(MOCK_BALANCE);
  const [isPrivateRevealed, setIsPrivateRevealed] = useState(false);
  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKeys>({
    publicKey: null,
    isInitialized: false,
  });
  const [transactions, setTransactions] = useState<ObelyskTransaction[]>(MOCK_TRANSACTIONS);
  const [provingState, setProvingState] = useState<ProvingState>("idle");
  const [provingTime, setProvingTime] = useState<number | null>(null);

  // Calculate total USD value (mock price: $4.55 per SAGE)
  const totalBalanceUsd = `$${(
    (parseFloat(balance.public) + parseFloat(balance.private) + parseFloat(balance.pending)) * 4.55
  ).toFixed(2)}`;

  // Reset private reveal when disconnecting
  useEffect(() => {
    if (!isConnected) {
      setIsPrivateRevealed(false);
      setEncryptionKeys({ publicKey: null, isInitialized: false });
    }
  }, [isConnected]);

  // Initialize encryption keys (derived from wallet signature)
  const initializeEncryption = useCallback(async () => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }
    
    // In production, this would:
    // 1. Request a specific message signature from the wallet
    // 2. Derive ElGamal keys from the signature
    // 3. Store the public key (private key is derived each time)
    
    // For demo, simulate the process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock public key
    const mockPublicKey = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;
    
    setEncryptionKeys({
      publicKey: mockPublicKey,
      isInitialized: true,
    });
  }, [isConnected, address]);

  // Reveal private balance (requires signature)
  const revealPrivateBalance = useCallback(async () => {
    if (!encryptionKeys.isInitialized) {
      await initializeEncryption();
    }
    
    // In production, this would:
    // 1. Request signature to derive decryption key
    // 2. Decrypt the balance ciphertext
    
    // For demo, simulate the process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPrivateRevealed(true);
  }, [encryptionKeys.isInitialized, initializeEncryption]);

  // Hide private balance
  const hidePrivateBalance = useCallback(() => {
    setIsPrivateRevealed(false);
  }, []);

  // Reset proving state
  const resetProvingState = useCallback(() => {
    setProvingState("idle");
    setProvingTime(null);
  }, []);

  // Rollover pending earnings to private balance
  const rollover = useCallback(async () => {
    if (parseFloat(balance.pending) <= 0) {
      throw new Error("No pending balance to rollover");
    }

    setProvingState("proving");
    const startTime = Date.now();
    
    // Simulate ZK proof generation (~148ms like Tongo)
    await new Promise(resolve => setTimeout(resolve, 150));
    const proofTimeMs = Date.now() - startTime;
    setProvingTime(proofTimeMs);
    
    setProvingState("sending");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setProvingState("confirming");
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Update balances
    const pendingAmount = parseFloat(balance.pending);
    setBalance(prev => ({
      ...prev,
      private: (parseFloat(prev.private) + pendingAmount).toFixed(2),
      pending: "0.00",
    }));
    
    // Add transaction
    const newTx: ObelyskTransaction = {
      id: `tx_${Date.now()}`,
      type: "rollover",
      amount: pendingAmount.toString(),
      timestamp: Date.now(),
      isPrivate: false,
      status: "confirmed",
      proofTime: proofTimeMs,
    };
    setTransactions(prev => [newTx, ...prev]);
    
    setProvingState("confirmed");
  }, [balance.pending]);

  // Ragequit - withdraw entire private balance to public
  const ragequit = useCallback(async () => {
    if (parseFloat(balance.private) <= 0) {
      throw new Error("No private balance to withdraw");
    }

    setProvingState("proving");
    const startTime = Date.now();
    
    // Simulate ZK proof generation
    await new Promise(resolve => setTimeout(resolve, 200));
    const proofTimeMs = Date.now() - startTime;
    setProvingTime(proofTimeMs);
    
    setProvingState("sending");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProvingState("confirming");
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update balances
    const privateAmount = parseFloat(balance.private);
    setBalance(prev => ({
      ...prev,
      public: (parseFloat(prev.public) + privateAmount).toFixed(4),
      private: "0.00",
    }));
    
    // Add transaction
    const newTx: ObelyskTransaction = {
      id: `tx_${Date.now()}`,
      type: "ragequit",
      amount: privateAmount.toString(),
      timestamp: Date.now(),
      isPrivate: false,
      status: "confirmed",
      proofTime: proofTimeMs,
    };
    setTransactions(prev => [newTx, ...prev]);
    
    setProvingState("confirmed");
  }, [balance.private]);

  // Send private transfer
  const sendPrivate = useCallback(async (to: string, amount: string) => {
    const amountNum = parseFloat(amount);
    if (amountNum <= 0 || amountNum > parseFloat(balance.private)) {
      throw new Error("Invalid amount");
    }

    setProvingState("proving");
    const startTime = Date.now();
    
    // Simulate ZK proof generation (~2ms for simple transfer)
    await new Promise(resolve => setTimeout(resolve, 50));
    const proofTimeMs = Date.now() - startTime;
    setProvingTime(proofTimeMs);
    
    setProvingState("sending");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setProvingState("confirming");
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Update balance
    setBalance(prev => ({
      ...prev,
      private: (parseFloat(prev.private) - amountNum).toFixed(2),
    }));
    
    // Add transaction
    const newTx: ObelyskTransaction = {
      id: `tx_${Date.now()}`,
      type: "send",
      amount,
      to,
      timestamp: Date.now(),
      isPrivate: true,
      status: "confirmed",
      proofTime: proofTimeMs,
    };
    setTransactions(prev => [newTx, ...prev]);
    
    setProvingState("confirmed");
  }, [balance.private]);

  // Send public transfer
  const sendPublic = useCallback(async (to: string, amount: string) => {
    const amountNum = parseFloat(amount);
    if (amountNum <= 0 || amountNum > parseFloat(balance.public)) {
      throw new Error("Invalid amount");
    }

    setProvingState("sending");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setProvingState("confirming");
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Update balance
    setBalance(prev => ({
      ...prev,
      public: (parseFloat(prev.public) - amountNum).toFixed(4),
    }));
    
    // Add transaction
    const newTx: ObelyskTransaction = {
      id: `tx_${Date.now()}`,
      type: "send",
      amount,
      to,
      timestamp: Date.now(),
      isPrivate: false,
      status: "confirmed",
    };
    setTransactions(prev => [newTx, ...prev]);
    
    setProvingState("confirmed");
  }, [balance.public]);

  const value: ObelyskWalletContextType = {
    balance,
    totalBalanceUsd,
    isPrivateRevealed,
    encryptionKeys,
    revealPrivateBalance,
    hidePrivateBalance,
    initializeEncryption,
    transactions,
    rollover,
    ragequit,
    sendPrivate,
    sendPublic,
    provingState,
    provingTime,
    resetProvingState,
    isConnected: isConnected || false,
    connectorId: connector?.id || null,
  };

  return (
    <ObelyskWalletContext.Provider value={value}>
      {children}
    </ObelyskWalletContext.Provider>
  );
}

export function useObelyskWallet() {
  const context = useContext(ObelyskWalletContext);
  if (!context) {
    throw new Error("useObelyskWallet must be used within ObelyskWalletProvider");
  }
  return context;
}

// Helper hook for just balances
export function useObelyskBalance() {
  const { balance, isPrivateRevealed, revealPrivateBalance, hidePrivateBalance } = useObelyskWallet();
  return { balance, isPrivateRevealed, revealPrivateBalance, hidePrivateBalance };
}

// Helper hook for transactions
export function useObelyskTransactions() {
  const { transactions, provingState, provingTime, resetProvingState } = useObelyskWallet();
  return { transactions, provingState, provingTime, resetProvingState };
}
