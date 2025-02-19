
import { Button } from "@/components/ui/button";
import { ConnectKitButton } from "connectkit";

interface ConnectWalletButtonProps {
  onConnect: () => void;
}

const ConnectWalletButton = ({ onConnect }: ConnectWalletButtonProps) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show }) => {
        return (
          <Button 
            onClick={show}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white min-w-[120px]"
          >
            {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Manage Records"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectWalletButton;
