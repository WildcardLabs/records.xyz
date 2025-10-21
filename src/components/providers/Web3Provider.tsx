import { WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from '@/lib/web3Config';
import {PrivyProvider} from '@privy-io/react-auth';

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <PrivyProvider
            appId={import.meta.env.VITE_PRIVY_APP_ID}
            config={{
              // Create embedded wallets for users who don't have a wallet
              embeddedWallets: {
                ethereum: {
                  createOnLogin: 'users-without-wallets'
                }
              }
            }}
          >
            {children}
          </PrivyProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
};