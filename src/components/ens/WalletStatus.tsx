import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId, useEnsName } from "wagmi";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";

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
        return "/lovable-uploads/626dbac5-49c0-425d-8996-4213b368d104.png"; // ethereum
      case 10:
        return "/lovable-uploads/d340be2e-c06a-4ac9-b180-4eedc1439f4f.png"; // optimism
      case 8453:
        return "/lovable-uploads/704c1ede-df6b-4911-af43-2d274d033df6.png"; // base
      case 42161:
        return "/lovable-uploads/ecaff6c4-37dd-4440-b585-dcf98a2440cf.png"; // arbitrum
      case 59144:
        return "/lovable-uploads/b871bebc-5864-440b-b642-101a2728678f.png"; // linea
      case 137:
        return "/lovable-uploads/70e574c2-77c3-4ced-a446-d98951501fb1.png"; // polygon
      default:
        return "/lovable-uploads/626dbac5-49c0-425d-8996-4213b368d104.png"; // default to ethereum
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