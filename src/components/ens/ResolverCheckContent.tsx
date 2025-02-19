
import { Loader2, AlertCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResolverCheckContentProps {
  hasRecords: boolean;
  selectedChain: "optimism" | "base" | null;
  isPending: boolean;
  isProcessing: boolean;
  onChainSelect: (chainId: number, chainType: "optimism" | "base") => void;
  changedRecords: Record<string, string>;
}

const ResolverCheckContent = ({
  hasRecords,
  selectedChain,
  isPending,
  isProcessing,
  onChainSelect,
  changedRecords,
}: ResolverCheckContentProps) => {
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="mt-4 text-center">
          {isProcessing ? (
            <div className="space-y-2">
              <p>Updating records...</p>
              <p className="text-sm text-gray-500">
                Please follow the prompts in your wallet
              </p>
            </div>
          ) : (
            "Preparing record updates..."
          )}
        </div>
      </div>
    );
  }

  // Format record key for display
  const formatRecordKey = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const getValueDisplay = (value: string) => {
    if (value === "") return "Clearing record";
    return value;
  };

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-yellow-500 font-medium">Record Updates Summary</p>
          <p className="mt-1 text-sm text-gray-400">
            You are about to make the following changes to your ENS records:
          </p>
          <div className="mt-3 space-y-2">
            {Object.entries(changedRecords).map(([key, value]) => (
              <div key={key} className="flex items-start gap-2 text-sm">
                <div className="w-24 flex-shrink-0 text-gray-400">
                  {formatRecordKey(key)}:
                </div>
                <div className="flex-1 text-white">
                  {value === "" ? (
                    <span className="flex items-center gap-1 text-red-400">
                      <X className="h-4 w-4" />
                      Clearing record
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-400">
                      <Check className="h-4 w-4" />
                      {getValueDisplay(value)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-blue-400">
          Note: Updates made on L2 networks (Optimism/Base) will be synchronized to L1 Ethereum within approximately 1 hour.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <Button 
          onClick={() => onChainSelect(10, "optimism")}
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isPending || isProcessing}
        >
          Continue to Network Selection
        </Button>
      </div>
    </div>
  );
};

export default ResolverCheckContent;
