<div align="center">
  <img src="public/brand/logo.svg" alt="BitSage Logo" width="200"/>
  
  # BitSage Network WebApp
  
  **Starknet-Native Validator Interface with Advanced Privacy**
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Starknet](https://img.shields.io/badge/Starknet-Native-purple)](https://www.starknet.io/)
  
  [Live Demo](https://bitsage.network) • [Documentation](https://docs.bitsage.network) • [Twitter](https://twitter.com/bitsagenetwork)
</div>

---

## 🌟 Overview

BitSage WebApp is a **validator-first, privacy-focused** decentralized GPU compute network interface built on Starknet. It features the **Obelysk Wallet** - a revolutionary privacy layer for GPU earnings with ElGamal encryption and zero-knowledge proofs.

### Key Features

- 🔐 **Obelysk Privacy Wallet** - Private GPU earnings with homomorphic encryption
- 🕸️ **Interactive Privacy Explorer** - Network graph with 3 layout algorithms
- ⚡ **Account Abstraction** - Gasless transactions for seamless UX
- 🎨 **Modern Glass UI** - Beautiful dark theme with glass morphism
- 🔗 **Multi-Wallet Support** - Argent X, Braavos, WalletConnect integration
- 📊 **Real-time Analytics** - Live proof verification and job monitoring

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Starknet wallet (Argent X or Braavos)

### Installation

```bash
# Clone the repository
git clone https://github.com/Bitsage-Network/Bitsage-WebApp.git
cd Bitsage-WebApp

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

---

## 🏗️ Architecture

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | TailwindCSS 3 + Glass Morphism |
| **Blockchain** | Starknet.js + @starknet-react/core |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **State** | React Context + Hooks |

### Project Structure

```
BitSage-WebApp/
├── src/
│   ├── app/
│   │   ├── (app)/              # Authenticated pages
│   │   │   ├── dashboard/      # Validator dashboard
│   │   │   ├── wallet/         # Obelysk privacy wallet
│   │   │   ├── stake/          # Staking interface
│   │   │   ├── send/           # Private transfers
│   │   │   ├── bridge/         # Cross-chain bridge
│   │   │   ├── jobs/           # GPU job history
│   │   │   ├── proofs/         # Proof explorer
│   │   │   ├── workloads/      # AI model marketplace
│   │   │   └── faucet/         # Testnet token faucet
│   │   └── (auth)/             # Authentication pages
│   │       └── connect/        # Wallet connection
│   │
│   ├── components/
│   │   ├── layout/             # Sidebar, TopBar
│   │   ├── privacy/            # Privacy UI components
│   │   └── ui/                 # Reusable UI elements
│   │
│   └── lib/
│       ├── obelysk/            # Obelysk wallet logic
│       ├── starknet/           # Blockchain integration
│       └── contracts/          # Contract addresses
│
├── public/
│   └── brand/                  # Logos and branding
│
└── ...config files
```

---

## 🔐 Obelysk Privacy Wallet

The **Obelysk Wallet** is a privacy layer built on top of Starknet wallets, providing:

### Features

- **Private Balances**: ElGamal encryption over the Stark curve
- **GPU Earnings Tracking**: Monitor pending validator rewards
- **Rollover Function**: Claim pending earnings to private balance
- **Ragequit**: Emergency exit to public funds with warnings
- **Custom Addresses**: `obelysk:0x...` branding with payment URIs
- **Privacy Masking**: Transaction history with `? → ?` for encrypted flows
- **Signature Reveals**: Cryptographic proof required to view private values

### Privacy Architecture

```
┌─────────────────────────────────────────────────┐
│            Obelysk Privacy Layer                │
│  • ElGamal Encryption (additively homomorphic)  │
│  • Zero-Knowledge Proofs (Sigma protocols)      │
│  • Homomorphic Scalar Multiplication            │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│         Starknet Wallet Provider                │
│     (Argent X / Braavos / WalletConnect)        │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              Starknet L2                        │
│        On-chain Privacy with STWO               │
└─────────────────────────────────────────────────┘
```

**Learn more**: [Privacy Architecture Docs](https://docs.bitsage.network/privacy)

---

## 🕸️ Privacy Explorer

Interactive network graph visualization showing:

- **26 Nodes**: Your account, pools, validators, and clients
- **40+ Edges**: Job flows, delegations, and payments
- **Privacy Indicators**: Private transactions shown as dashed purple lines with `? → ?` labels
- **Real-time Stats**: Nodes, edges, density, and private transaction count

### Layout Algorithms

| Layout | Description | Use Case |
|--------|-------------|----------|
| **Force-Directed** | Physics-based organic clustering | Discover relationships naturally |
| **Circular** | Nodes on circle perimeter | See all connections at once |
| **Hierarchical** | Tree structure top-to-bottom | Understand delegation flow |

**Controls**:
- **Drag** to pan the graph
- **Scroll** to zoom in/out
- **Click** nodes for detailed information
- Toggle between **Global** (all network) and **Personal** (your activity only)

---

## 💎 Key Pages

### Dashboard
Validator overview with GPU stats, earnings breakdown, and network health.

### Stake
Public and private staking with real-time APR calculation and privacy toggles.

### Send
Private token transfers with proving animations and signature-based reveals.

### Bridge
Multi-chain liquidity bridge with Obelysk balance integration.

### Jobs
GPU job history with sponsored gas fees (Account Abstraction).

### Proofs
Live and verified proof explorer with privacy masking for encrypted proofs.

### Workloads
AI model marketplace featuring Llama, Qwen, SDXL, and other GPU workloads.

### Faucet
Testnet SAGE token distribution with anti-bot measures.

---

## 🎨 Design System

### Colors

```css
Brand Purple:  #7c3aed  /* Primary actions */
Brand Blue:    #3b82f6  /* You/active states */
Emerald:       #10b981  /* Pools/success */
Dark:          #0a0b0f  /* Background */
```

### Glass Morphism

All cards use backdrop blur with semi-transparent backgrounds:

```tsx
className="glass-card"  // Predefined glass effect
```

### Typography

- **Headings**: Inter (System Font)
- **Monospace**: `ui-monospace` for addresses and values

---

## 🔗 Starknet Integration

### Wallet Connection

Supports all major Starknet wallet providers:

```tsx
import { useAccount, useConnect } from '@starknet-react/core';

// Argent X
// Braavos
// WalletConnect
// MetaMask Snap (coming soon)
```

### Smart Contracts

| Contract | Address | Network |
|----------|---------|---------|
| SAGE Token | `0x...` | Starknet Sepolia |
| Staking | `0x...` | Starknet Sepolia |
| Faucet | `0x...` | Starknet Sepolia |
| Obelysk Privacy | `0x...` | Starknet Sepolia |

**View all contracts**: [`src/lib/contracts/addresses.ts`](src/lib/contracts/addresses.ts)

---

## 🧪 Development

### Run Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

### Environment Variables

Create a `.env.local` file (see `.env.example`):

```env
NEXT_PUBLIC_STARKNET_NETWORK=sepolia
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ENABLE_TESTNETS=true
NEXT_PUBLIC_DEMO_MODE=true
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bitsage-Network/Bitsage-WebApp)

**Steps**:

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Configure environment variables (optional)
4. Click "Deploy"

**Password Protection**: The demo is password-protected with the password `Obelysk`. Users will see an auth page before accessing the application.

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd BitSage-WebApp
vercel

# Deploy to production
vercel --prod
```

### Other Platforms

**Netlify**:
```bash
npm run build
# Deploy the .next folder
```

**Self-Hosted**:
```bash
npm run build
npm start
# Runs on port 3000
```

---

## 📚 Documentation

- **[Getting Started Guide](https://docs.bitsage.network/getting-started)** - Setup and first steps
- **[Privacy Architecture](https://docs.bitsage.network/privacy)** - How Obelysk works
- **[API Reference](https://docs.bitsage.network/api)** - Integration docs
- **[Smart Contracts](https://docs.bitsage.network/contracts)** - On-chain logic

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript strict mode
- Follow existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [bitsage.network](https://bitsage.network)
- **Documentation**: [docs.bitsage.network](https://docs.bitsage.network)
- **Twitter**: [@bitsagenetwork](https://twitter.com/bitsagenetwork)
- **Discord**: [Join our community](https://discord.gg/bitsage)
- **GitHub**: [Bitsage-Network](https://github.com/Bitsage-Network)

---

## 🙏 Acknowledgments

Built with ❤️ by the BitSage team.

Special thanks to:
- [Starknet](https://starknet.io) - L2 scaling solution
- [Next.js](https://nextjs.org) - React framework
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS
- [Lucide](https://lucide.dev) - Beautiful icons

---

<div align="center">
  <strong>Made with privacy in mind 🔐</strong>
  
  Star ⭐ this repo if you find it useful!
</div>
