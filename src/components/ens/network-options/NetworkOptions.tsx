
import NetworkOption from "./NetworkOption";

interface NetworkOptionsProps {
  selectedChain: "optimism" | "base" | null;
  isPending: boolean;
  isProcessing: boolean;
  onChainSelect: (chainId: number, chainType: "optimism" | "base") => void;
}

const NetworkOptions = ({
  selectedChain,
  isPending,
  isProcessing,
  onChainSelect,
}: NetworkOptionsProps) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <NetworkOption
        name="optimism"
        title="Optimism"
        description="Fast, reliable, and secure L2 network with low transaction fees"
        imageSrc="/lovable-uploads/8481150f-f235-4f00-8253-1f619cc9b9c7.png"
        isSelected={selectedChain === "optimism"}
        isPending={isPending}
        isProcessing={isProcessing}
        onClick={() => onChainSelect(10, "optimism")}
      />
      
      <NetworkOption
        name="base"
        title="Base"
        description="Secure and developer-friendly L2 built on Ethereum"
        imageSrc="/lovable-uploads/704c1ede-df6b-4911-af43-2d274d033df6.png"
        isSelected={selectedChain === "base"}
        isPending={isPending}
        isProcessing={isProcessing}
        onClick={() => onChainSelect(8453, "base")}
      />
    </div>
  );
};

export default NetworkOptions;
