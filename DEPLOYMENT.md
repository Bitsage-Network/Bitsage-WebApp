# 🚀 BitSage WebApp Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy Button (Recommended)

Click the button below to deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bitsage-Network/Bitsage-WebApp)

### Option 2: Manual Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd BitSage-WebApp

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 🔐 Password Protection

The demo is automatically password-protected. Users must enter the password to access:

- **Password**: `Obelysk`
- **Session Duration**: 24 hours
- **Cookie-based**: Secure, HTTP-only cookies

### How It Works

1. User visits the site → Redirected to `/auth`
2. User enters password "Obelysk"
3. Middleware validates and sets secure cookie
4. User can access all pages for 24 hours
5. Cookie expires → Redirected back to `/auth`

---

## ⚙️ Environment Variables

Optional environment variables (set in Vercel dashboard):

```env
# Starknet Network
NEXT_PUBLIC_STARKNET_NETWORK=sepolia

# WalletConnect Project ID (for WalletConnect support)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Enable testnets
NEXT_PUBLIC_ENABLE_TESTNETS=true

# Demo mode
NEXT_PUBLIC_DEMO_MODE=true
```

---

## 🔧 Build Configuration

Vercel will automatically detect Next.js and use these settings:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x

These are configured in `vercel.json`.

---

## 🌐 Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain (e.g., `demo.bitsage.network`)
4. Update DNS records as instructed
5. SSL certificate is automatically provisioned

---

## 🔒 Security Headers

The following security headers are automatically applied (via `vercel.json`):

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 📊 Monitoring

Vercel provides built-in:

- **Analytics**: Page views, performance metrics
- **Logs**: Real-time function logs
- **Speed Insights**: Core Web Vitals
- **Error Tracking**: Runtime error monitoring

Access these in your Vercel dashboard.

---

## 🧪 Preview Deployments

Every push to a branch creates a preview deployment:

```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
```

Vercel will comment on the GitHub PR with a preview URL.

---

## 🔄 Continuous Deployment

Automatic deployments are configured:

- **Production**: Deploys on push to `main` branch
- **Preview**: Deploys on push to any other branch
- **Pull Requests**: Creates preview for each PR

---

## 📦 Alternative Platforms

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

### Self-Hosted (Docker)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t bitsage-webapp .
docker run -p 3000:3000 bitsage-webapp
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Password Not Working

- Ensure middleware is deployed: Check `src/middleware.ts`
- Clear cookies and try again
- Check browser console for errors

### Wallet Connection Issues

- Ensure you're on Starknet Sepolia testnet
- Check that wallet extension is installed
- Try refreshing the page

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Bitsage-Network/Bitsage-WebApp/issues)
- **Discord**: [Join our community](https://discord.gg/bitsage)
- **Email**: support@bitsage.network

---

**Ready to deploy?** Click the Vercel button above! 🚀
