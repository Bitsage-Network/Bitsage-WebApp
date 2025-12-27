/**
 * BitSage API Client
 *
 * Centralized API client for communicating with the BitSage Network coordinator.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// API configuration from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

// Create axios instance with defaults
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add wallet address to headers if available (for authenticated requests)
    const walletAddress = typeof window !== 'undefined'
      ? localStorage.getItem('wallet_address')
      : null;

    if (walletAddress) {
      config.headers['X-Wallet-Address'] = walletAddress;
    }

    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = (error.response?.data as { error?: string })?.error || error.message;

    console.error(`[API] Error ${status}: ${message}`);

    // Handle specific error codes
    if (status === 401) {
      // Handle unauthorized - could redirect to login
      console.warn('[API] Unauthorized request');
    } else if (status === 429) {
      // Handle rate limiting
      console.warn('[API] Rate limited');
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// API Response Types
// ============================================================================

export interface ValidatorStatus {
  is_active: boolean;
  staked_amount: string;
  total_earnings: string;
  pending_rewards: string;
  jobs_completed: number;
  jobs_in_progress: number;
  reputation: number;
}

export interface GPUMetrics {
  id: string;
  name: string;
  model: string;
  vram: number;
  temperature: number;
  utilization: number;
  power_draw: number;
  memory_used: number;
  memory_total: number;
  status: 'active' | 'idle' | 'offline';
  current_job?: string;
}

export interface JobInfo {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: number;
  worker_id?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  proof_hash?: string;
  earnings?: string;
  gpu_used?: string;
  duration_secs?: number;
  error?: string;
}

export interface JobsResponse {
  jobs: JobInfo[];
  total: number;
  page: number;
  per_page: number;
}

export interface ProofInfo {
  id: string;
  job_id: string;
  status: 'generating' | 'verifying' | 'verified' | 'failed';
  proof_hash: string;
  verification_tx?: string;
  created_at: string;
  verified_at?: string;
  proof_size_bytes: number;
  generation_time_ms: number;
  fri_layers: number;
  circuit_type: string;
}

export interface NetworkStats {
  total_workers: number;
  active_workers: number;
  total_jobs_completed: number;
  jobs_in_progress: number;
  total_proofs_verified: number;
  average_proof_time_ms: number;
  network_utilization: number;
  total_staked: string;
}

export interface FaucetStatus {
  can_claim: boolean;
  time_until_next_claim_secs: number;
  claim_amount: string;
  claim_amount_formatted: string;
  total_claimed: string;
  total_claimed_formatted: string;
}

export interface FaucetClaimResponse {
  success: boolean;
  amount: string;
  amount_formatted: string;
  transaction_hash: string;
  message: string;
}

export interface FaucetConfig {
  enabled: boolean;
  claim_amount: string;
  claim_amount_formatted: string;
  cooldown_secs: number;
  cooldown_formatted: string;
  network: string;
}

export interface StakingInfo {
  staked_amount: string;
  stake_tier: string;
  pending_rewards: string;
  lock_end_timestamp?: number;
  can_unstake: boolean;
}

export interface RewardsInfo {
  pending: string;
  claimed_total: string;
  last_claim_timestamp?: number;
  estimated_daily: string;
}

// ============================================================================
// API Functions
// ============================================================================

// Health & Stats
export const getHealth = () => apiClient.get('/api/health');
export const getStats = () => apiClient.get<NetworkStats>('/api/stats');
export const getNetworkStats = () => apiClient.get<NetworkStats>('/api/network/stats');

// Validator
export const getValidatorStatus = () => apiClient.get<ValidatorStatus>('/api/validator/status');
export const getGPUMetrics = () => apiClient.get<GPUMetrics[]>('/api/validator/gpus');
export const getRewards = () => apiClient.get<RewardsInfo>('/api/validator/rewards');

// Jobs
export const getJobs = (params?: {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}) => apiClient.get<JobsResponse>('/api/jobs', { params });

export const getJobStatus = (jobId: string) => apiClient.get<JobInfo>(`/api/jobs/${jobId}`);
export const getJobResult = (jobId: string) => apiClient.get(`/api/jobs/${jobId}/result`);
export const cancelJob = (jobId: string) => apiClient.post(`/api/jobs/${jobId}/cancel`);

export const submitJob = (data: {
  job_type: string;
  input_data: string;
  max_cost_sage?: number;
  priority?: number;
  require_tee?: boolean;
}) => apiClient.post<{ job_id: string; status: string; estimated_cost: string }>('/api/submit', data);

// Proofs
export const getProofs = (params?: {
  page?: number;
  per_page?: number;
  status?: string;
}) => apiClient.get<{ proofs: ProofInfo[]; total: number }>('/api/proofs', { params });

export const getProof = (proofId: string) => apiClient.get<ProofInfo>(`/api/proofs/${proofId}`);
export const verifyProof = (proofHash: string) => apiClient.post(`/api/proofs/${proofHash}/verify`);

// Faucet
export const getFaucetStatus = (address: string) =>
  apiClient.get<FaucetStatus>(`/api/faucet/status/${address}`);

export const claimFaucet = (address: string, captchaToken?: string) =>
  apiClient.post<FaucetClaimResponse>('/api/faucet/claim', {
    address,
    captcha_token: captchaToken
  });

export const getFaucetConfig = () => apiClient.get<FaucetConfig>('/api/faucet/config');

// Staking
export const getStakeInfo = (address: string) =>
  apiClient.get<StakingInfo>(`/api/staking/${address}`);

export const stake = (amount: string) =>
  apiClient.post<{ transaction_hash: string }>('/api/staking/stake', { amount });

export const unstake = (amount: string) =>
  apiClient.post<{ transaction_hash: string }>('/api/staking/unstake', { amount });

export const claimRewards = () =>
  apiClient.post<{ amount: string; transaction_hash: string }>('/api/staking/claim');

// Workers
export const getWorkers = () => apiClient.get<{ workers: any[] }>('/api/workers');
export const getWorker = (workerId: string) => apiClient.get(`/api/workers/${workerId}`);

// ============================================================================
// WebSocket Client
// ============================================================================

export interface WebSocketMessage {
  type: 'job_update' | 'proof_update' | 'worker_status' | 'network_stats';
  data: any;
  timestamp: string;
}

export type WebSocketCallback = (message: WebSocketMessage) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private callbacks: Set<WebSocketCallback> = new Set();

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WS] Already connected');
      return;
    }

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('[WS] Connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.callbacks.forEach(callback => callback(message));
        } catch (error) {
          console.error('[WS] Failed to parse message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('[WS] Disconnected');
        this.tryReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[WS] Error:', error);
      };
    } catch (error) {
      console.error('[WS] Failed to connect:', error);
      this.tryReconnect();
    }
  }

  private tryReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[WS] Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('[WS] Max reconnection attempts reached');
    }
  }

  subscribe(callback: WebSocketCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks.clear();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton WebSocket client
export const wsClient = new WebSocketClient();

// ============================================================================
// Utility Functions
// ============================================================================

export function formatSageAmount(wei: string | number): string {
  const sage = Number(wei) / 1e18;
  if (sage >= 1) {
    return `${sage.toFixed(2)} SAGE`;
  } else if (sage >= 0.001) {
    return `${sage.toFixed(4)} SAGE`;
  } else {
    return `${wei} wei`;
  }
}

export function formatDuration(secs: number): string {
  if (secs >= 86400) {
    const days = Math.floor(secs / 86400);
    return `${days} day${days === 1 ? '' : 's'}`;
  } else if (secs >= 3600) {
    const hours = Math.floor(secs / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  } else if (secs >= 60) {
    const mins = Math.floor(secs / 60);
    return `${mins} minute${mins === 1 ? '' : 's'}`;
  } else {
    return `${secs} second${secs === 1 ? '' : 's'}`;
  }
}

export { API_BASE_URL, WS_URL };
