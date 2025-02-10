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
            className="bg-white text-black hover:bg-gray-100 text-base px-6 py-4 h-auto rounded-xl"
          >
            {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Manage Records"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectWalletButton;