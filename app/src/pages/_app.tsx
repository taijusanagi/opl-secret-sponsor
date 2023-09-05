import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { AppProps } from "next/app";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

import { publicProvider } from "wagmi/providers/public";

export const oasisSapphireTestnet = {
  id: 23295,
  name: "Oasis Sapphire Testnet",
  network: "testnet",
  nativeCurrency: {
    name: "ROSE",
    symbol: "ROSE",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.sapphire.oasis.dev"],
    },
    public: {
      http: ["https://testnet.sapphire.oasis.dev"],
    },
  },
  testnet: true,
  blockExplorers: {
    default: {
      name: "Sapphire Testnet Sapphire Explorer",
      url: "https://testnet.explorer.sapphire.oasis.dev",
    },
  },
};

const { chains, publicClient } = configureChains([oasisSapphireTestnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "SecretSponsor",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
