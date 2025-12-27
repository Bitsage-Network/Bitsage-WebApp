/**
 * Custom hooks for API data fetching with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  getValidatorStatus,
  getGPUMetrics,
  getJobs,
  getJobStatus,
  getProofs,
  getProof,
  getNetworkStats,
  getFaucetStatus,
  getFaucetConfig,
  claimFaucet,
  getStakeInfo,
  claimRewards,
  submitJob,
  cancelJob,
  wsClient,
  WebSocketMessage,
  ValidatorStatus,
  GPUMetrics,
  JobInfo,
  ProofInfo,
  NetworkStats,
  FaucetStatus,
  FaucetConfig,
} from '../api/client';

// ============================================================================
// Validator Hooks
// ============================================================================

export function useValidatorStatus() {
  return useQuery({
    queryKey: ['validatorStatus'],
    queryFn: async () => {
      const response = await getValidatorStatus();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });
}

export function useGPUMetrics() {
  return useQuery({
    queryKey: ['gpuMetrics'],
    queryFn: async () => {
      const response = await getGPUMetrics();
      return response.data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds for real-time GPU stats
    staleTime: 3000,
  });
}

// ============================================================================
// Jobs Hooks
// ============================================================================

export function useJobs(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: async () => {
      const response = await getJobs(params);
      return response.data;
    },
    refetchInterval: 15000,
    staleTime: 5000,
  });
}

export function useJobStatus(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await getJobStatus(jobId);
      return response.data;
    },
    enabled: !!jobId,
    refetchInterval: 5000, // More frequent refresh for active job monitoring
  });
}

export function useSubmitJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      job_type: string;
      input_data: string;
      max_cost_sage?: number;
      priority?: number;
      require_tee?: boolean;
    }) => {
      const response = await submitJob(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate jobs list to show new job
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useCancelJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await cancelJob(jobId);
      return response.data;
    },
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    },
  });
}

// ============================================================================
// Proofs Hooks
// ============================================================================

export function useProofs(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ['proofs', params],
    queryFn: async () => {
      const response = await getProofs(params);
      return response.data;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });
}

export function useProof(proofId: string) {
  return useQuery({
    queryKey: ['proof', proofId],
    queryFn: async () => {
      const response = await getProof(proofId);
      return response.data;
    },
    enabled: !!proofId,
  });
}

// ============================================================================
// Network Hooks
// ============================================================================

export function useNetworkStats() {
  return useQuery({
    queryKey: ['networkStats'],
    queryFn: async () => {
      const response = await getNetworkStats();
      return response.data;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

// ============================================================================
// Faucet Hooks
// ============================================================================

export function useFaucetStatus(address: string | undefined) {
  return useQuery({
    queryKey: ['faucetStatus', address],
    queryFn: async () => {
      if (!address) throw new Error('No address provided');
      const response = await getFaucetStatus(address);
      return response.data;
    },
    enabled: !!address,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });
}

export function useFaucetConfig() {
  return useQuery({
    queryKey: ['faucetConfig'],
    queryFn: async () => {
      const response = await getFaucetConfig();
      return response.data;
    },
    staleTime: 300000, // 5 minutes - config doesn't change often
  });
}

export function useClaimFaucet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address, captchaToken }: { address: string; captchaToken?: string }) => {
      const response = await claimFaucet(address, captchaToken);
      return response.data;
    },
    onSuccess: (_, { address }) => {
      // Invalidate faucet status to refresh cooldown
      queryClient.invalidateQueries({ queryKey: ['faucetStatus', address] });
    },
  });
}

// ============================================================================
// Staking Hooks
// ============================================================================

export function useStakeInfo(address: string | undefined) {
  return useQuery({
    queryKey: ['stakeInfo', address],
    queryFn: async () => {
      if (!address) throw new Error('No address provided');
      const response = await getStakeInfo(address);
      return response.data;
    },
    enabled: !!address,
    refetchInterval: 60000,
  });
}

export function useClaimRewards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await claimRewards();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stakeInfo'] });
      queryClient.invalidateQueries({ queryKey: ['validatorStatus'] });
    },
  });
}

// ============================================================================
// WebSocket Hook
// ============================================================================

export function useWebSocket() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    wsClient.connect();

    // Subscribe to updates
    const unsubscribe = wsClient.subscribe((message: WebSocketMessage) => {
      switch (message.type) {
        case 'job_update':
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
          if (message.data.job_id) {
            queryClient.invalidateQueries({ queryKey: ['job', message.data.job_id] });
          }
          break;
        case 'proof_update':
          queryClient.invalidateQueries({ queryKey: ['proofs'] });
          if (message.data.proof_id) {
            queryClient.invalidateQueries({ queryKey: ['proof', message.data.proof_id] });
          }
          break;
        case 'worker_status':
          queryClient.invalidateQueries({ queryKey: ['gpuMetrics'] });
          queryClient.invalidateQueries({ queryKey: ['validatorStatus'] });
          break;
        case 'network_stats':
          queryClient.invalidateQueries({ queryKey: ['networkStats'] });
          break;
      }
    });

    // Check connection status
    const checkConnection = setInterval(() => {
      setIsConnected(wsClient.isConnected());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(checkConnection);
      wsClient.disconnect();
    };
  }, [queryClient]);

  return { isConnected };
}

// ============================================================================
// Combined Dashboard Hook
// ============================================================================

export function useDashboardData() {
  const validatorStatus = useValidatorStatus();
  const gpuMetrics = useGPUMetrics();
  const { isConnected } = useWebSocket();

  return {
    validatorStatus: validatorStatus.data,
    gpuMetrics: gpuMetrics.data,
    isLoading: validatorStatus.isLoading || gpuMetrics.isLoading,
    isError: validatorStatus.isError || gpuMetrics.isError,
    isConnected,
    refetch: () => {
      validatorStatus.refetch();
      gpuMetrics.refetch();
    },
  };
}

// ============================================================================
// Utility Hook for Connection Status
// ============================================================================

export function useApiHealth() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/health`);
        setIsOnline(response.ok);
        setLastCheck(new Date());
      } catch {
        setIsOnline(false);
        setLastCheck(new Date());
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isOnline, lastCheck };
}
