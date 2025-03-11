
import NetworkOption from "./NetworkOption";

interface NetworkOptionsProps {
  selectedChain: "optimism" | "base" | null;
  isPending: boolean;
  isProcessing: boolean;
  onChainSelect: (chainId: number, chainType: "optimism" | "base") => void;
  isBasename?: boolean;
}

const NetworkOptions = ({
  selectedChain,
  isPending,
  isProcessing,
  onChainSelect,
  isBasename = false,
}: NetworkOptionsProps) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Only show Optimism option for non-basenames */}
      {!isBasename && (
        <NetworkOption
          name="optimism"
          title="Optimism"
          description="Fast, reliable, and secure L2 network with low transaction fees"
          imageSrc="/lovable-uploads/d340be2e-c06a-4ac9-b180-4eedc1439f4f.png"
          isSelected={selectedChain === "optimism"}
          isPending={isPending}
          isProcessing={isProcessing}
          onClick={() => onChainSelect(10, "optimism")}
        />
      )}
      
      {/* Always show Base option */}
      <NetworkOption
        name="base"
        title="Base"
        description="Secure and developer-friendly L2 built on Ethereum"
        imageSrc="/lovable-uploads/704c1ede-df6b-4911-af43-2d274d033df6.png"
        isSelected={selectedChain === "base" || isBasename}
        isPending={isPending}
        isProcessing={isProcessing}
        onClick={() => onChainSelect(8453, "base")}
      />
    </div>
  );
};

export default NetworkOptions;
