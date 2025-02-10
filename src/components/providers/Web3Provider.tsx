import { WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from '@/lib/web3Config';

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
};