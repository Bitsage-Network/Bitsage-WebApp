// Contract addresses for BitSage Network
// These will be updated when contracts are deployed

export const CONTRACTS = {
  // Sepolia Testnet
  sepolia: {
    SAGE_TOKEN: "0x0", // TODO: Deploy and update
    STAKING: "0x0", // TODO: Deploy and update  
    JOB_MANAGER: "0x0", // TODO: Deploy and update
    FAUCET: "0x0", // TODO: Deploy and update
    REPUTATION: "0x0", // TODO: Deploy and update
  },
  // Mainnet
  mainnet: {
    SAGE_TOKEN: "0x0",
    STAKING: "0x0",
    JOB_MANAGER: "0x0",
    FAUCET: "0x0",
    REPUTATION: "0x0",
  },
} as const;

// Token decimals
export const SAGE_DECIMALS = 18;

// Faucet configuration - Anti-bot protection system
// Calculation: 0.02 SAGE/request × 1 request/day × 365 days × 5 years = 36.5 SAGE max per user
// With social rewards (2 × 0.5 SAGE one-time): +1 SAGE = 37.5 SAGE max per user over 5 years
export const FAUCET_CONFIG = {
  // Base amounts (minimal to prevent abuse)
  baseAmount: "0.02", // 0.02 SAGE per request (testnet only - minimal amount)
  socialTaskReward: "0.5", // 0.5 SAGE per social task (reduced to prevent bot abuse)
  
  // Cooldowns
  cooldown: 24 * 60 * 60 * 1000, // 24 hours in milliseconds for base request
  socialTaskCooldown: 7 * 24 * 60 * 60 * 1000, // 7 days for social tasks (one-time per wallet)
  
  // Anti-bot protection
  maxRequestsPerIP: 3, // Max 3 requests per IP per day
  requireHumanVerification: true, // CAPTCHA/proof-of-humanity required
  
  // Max supply protection (1B SAGE total)
  // Max per user over 5 years: ~37.5 SAGE (base + social)
  // This ensures sustainable distribution within max supply
};

// Staking configuration
export const STAKING_CONFIG = {
  minStake: "100", // Minimum 100 SAGE
  lockPeriod: 7 * 24 * 60 * 60, // 7 days in seconds
  tiers: [
    { name: "Bronze", min: 100, max: 999, apr: 18 },
    { name: "Silver", min: 1000, max: 4999, apr: 21 },
    { name: "Gold", min: 5000, max: 24999, apr: 24 },
    { name: "Diamond", min: 25000, max: Infinity, apr: 30 },
  ],
};

// Network configuration
export const NETWORK_CONFIG = {
  sepolia: {
    chainId: "0x534e5f5345504f4c4941", // SN_SEPOLIA
    name: "Starknet Sepolia",
    rpcUrl: "https://starknet-sepolia.public.blastapi.io",
    explorerUrl: "https://sepolia.starkscan.co",
  },
  mainnet: {
    chainId: "0x534e5f4d41494e", // SN_MAIN
    name: "Starknet Mainnet",
    rpcUrl: "https://starknet-mainnet.public.blastapi.io",
    explorerUrl: "https://starkscan.co",
  },
};

// External links
export const EXTERNAL_LINKS = {
  starkgate: "https://starkgate.starknet.io",
  avnu: "https://app.avnu.fi",
  starkscan: "https://sepolia.starkscan.co",
  docs: "https://docs.bitsage.network",
  discord: "https://discord.gg/bitsage",
  twitter: "https://twitter.com/bitsage",
  github: "https://github.com/bitsage-network",
};
