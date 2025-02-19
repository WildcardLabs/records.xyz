
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileText, Replace, ChevronsRight, User } from "lucide-react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId, useEnsName } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chainLogos } from "@/constants/chains";

const MobileMenu = () => {
  const { address } = useAccount();
  const chainId = useChainId();
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
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-ens-dark-hover rounded-full p-0 h-8 w-8"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://us-central1-superchain-resolver.cloudfunctions.net/avatar`} />
            <AvatarFallback>
              <User className="h-4 w-4 text-[#8E9196]" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[300px] bg-ens-dark border-[#353B4D]/20 p-6 flex flex-col max-h-[90vh] my-auto rounded-l-2xl"
      >
        <div className="flex flex-col space-y-8 flex-1 max-h-full overflow-y-auto scrollbar-hide">
          {/* Wallet Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium text-[#8E9196] px-3">Wallet</h3>
            <ConnectKitButton.Custom>
              {({ show, isConnecting }) => (
                <button
                  onClick={show}
                  className="w-full text-left bg-ens-dark-secondary hover:bg-ens-dark-hover transition-colors rounded-lg px-3 py-2.5 text-sm font-medium text-white flex items-center gap-2"
                >
                  {address ? (
                    <>
                      <img 
                        src={getNetworkLogo(chainId)} 
                        alt="Network" 
                        className="w-4 h-4"
                      />
                      <span className="font-mono">
                        {ensName || shortenAddress(address)}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-[#8E9196] rounded-full mr-2" />
                      Connect Wallet
                    </>
                  )}
                </button>
              )}
            </ConnectKitButton.Custom>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium text-[#8E9196] px-3">Navigation</h3>
            <div className="flex flex-col space-y-1">
              <a 
                href="https://avatarsync.io" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:bg-ens-dark-hover transition-colors px-3 py-2.5 rounded-lg text-sm font-medium flex items-center group"
              >
                <Replace className="w-4 h-4 mr-2 text-[#8E9196] group-hover:text-white transition-colors" />
                AvatarSync
              </a>
              <a 
                href="https://docs.records.xyz" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:bg-ens-dark-hover transition-colors px-3 py-2.5 rounded-lg text-sm font-medium flex items-center group"
              >
                <FileText className="w-4 h-4 mr-2 text-[#8E9196] group-hover:text-white transition-colors" />
                Docs
              </a>
              <a 
                href="https://ensredirect.xyz" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:bg-ens-dark-hover transition-colors px-3 py-2.5 rounded-lg text-sm font-medium flex items-center group"
              >
                <ChevronsRight className="w-4 h-4 mr-2 text-[#8E9196] group-hover:text-white transition-colors" />
                Redirect
              </a>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-auto pt-4 border-t border-[#353B4D]/20">
            <div className="text-xs text-[#8E9196] px-3">
              © 2025 records.xyz
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

