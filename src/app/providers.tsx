"use client";
import { WagmiConfig, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

const qc = new QueryClient();
const config = createConfig({ chains: [sepolia], transports: { [sepolia.id]: http() } });

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={qc}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}