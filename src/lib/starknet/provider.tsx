"use client";

import { ReactNode } from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { ObelyskWalletProvider } from "@/lib/obelysk/ObelyskWalletContext";

interface StarknetProviderProps {
  children: ReactNode;
}

export function StarknetProvider({ children }: StarknetProviderProps) {
  // Use injected connectors (ArgentX, Braavos, etc.)
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  return (
    <StarknetConfig
      chains={[sepolia, mainnet]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      <ObelyskWalletProvider>
        {children}
      </ObelyskWalletProvider>
    </StarknetConfig>
  );
}
