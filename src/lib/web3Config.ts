
import { createConfig, http } from 'wagmi';
import { mainnet, optimism, base, linea } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

const chains = [mainnet, optimism, base, linea] as const;

export const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    walletConnectProjectId: "6191fb10b1dcb3d4f3c12d53c6af9e0e",
    chains,
    transports: {
      [mainnet.id]: http(),
      [optimism.id]: http(),
      [base.id]: http(),
      [linea.id]: http(),
    },

    // Required
    appName: "Records.xyz",
    
    // Optional
    appDescription: "The go-to platform for managing your ENS records across multiple L2 networks.",
    appUrl: "https://records.xyz",
    appIcon: "/lovable-uploads/28193e56-2ecb-4f1d-88b9-9b88704698a0.png",
  }),
);
