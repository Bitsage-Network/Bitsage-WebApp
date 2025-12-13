import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "@/lib/starknet/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BitSage Network - Decentralized GPU Compute",
  description: "Run AI workloads on decentralized GPU infrastructure with cryptographic proofs on Starknet",
  keywords: ["GPU", "AI", "decentralized", "compute", "Starknet", "ZK proofs", "SAGE", "validator"],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "BitSage Network",
    description: "Decentralized GPU Compute on Starknet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BitSage Network",
    description: "Decentralized GPU Compute on Starknet",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <StarknetProvider>
          {children}
        </StarknetProvider>
      </body>
    </html>
  );
}
