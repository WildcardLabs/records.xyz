
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId, useEnsName } from "wagmi";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { chainLogos } from "@/constants/chains";

const WalletStatus = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isMobile = useIsMobile();
  const { data: ensName } = useEnsName({
    address,
    chainId: 1, // ENS only works on mainnet
  });

  const getNetworkLogo = (chainId: number) => {
    switch (chainId) {
      case 1:
        return chainLogos.mainnet;
      case 10:
        return chainLogos.optimism;
      case 8453:
        return chainLogos.base;
      case 42161:
        return chainLogos.arbitrum;
      case 59144:
        return chainLogos.linea;
      case 137:
        return chainLogos.polygon;
      default:
        return chainLogos.mainnet;
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  return (
    <ConnectKitButton.Custom>
      {({ show, isConnecting }) => {
        if (isMobile) {
          return (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-ens-dark-hover"
              onClick={show}
            >
              <Menu className="h-6 w-6" />
            </Button>
          );
        }

        if (isConnected && address) {
          return (
            <Button
              onClick={show}
              variant="outline"
              className="bg-ens-dark-secondary hover:bg-ens-dark-hover flex items-center gap-2"
            >
              <img 
                src={getNetworkLogo(chainId)} 
                alt="Network" 
                className="w-4 h-4"
              />
              <span className="font-mono">
                {ensName || shortenAddress(address)}
              </span>
            </Button>
          );
        }

        return (
          <Button
            onClick={show}
            className="bg-ens-accent hover:bg-ens-accent/90"
            disabled={isConnecting}
          >
            Connect Wallet
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default WalletStatus;
