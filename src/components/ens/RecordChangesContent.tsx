
import { Loader2, AlertCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecordChangesContentProps {
  isPending: boolean;
  isProcessing: boolean;
  changedRecords: Record<string, string>;
  onContinue: (chainId: number, chainType: "optimism" | "base") => void;
}

const RecordChangesContent = ({
  isPending,
  isProcessing,
  changedRecords,
  onContinue,
}: RecordChangesContentProps) => {
  const isMobile = useIsMobile();

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

    // Handle specific record types differently
    if (value.startsWith("http")) {
      try {
        const url = new URL(value);
        const domain = url.hostname;
        const path = url.pathname.length > 20 
          ? url.pathname.substring(0, 17) + "..."
          : url.pathname;
        return `${domain}${path}`;
      } catch {
        return value;
      }
    }

    // Shorter truncation for mobile
    if (isMobile && value.length > 20) {
      return `${value.substring(0, 8)}...${value.substring(value.length - 4)}`;
    }
    
    if (value.length > 30) {
      return `${value.substring(0, 12)}...${value.substring(value.length - 8)}`;
    }

    return value;
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 overflow-x-hidden">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-yellow-500 font-medium">Record Updates Summary</p>
              <p className="mt-1 text-sm text-gray-400">
                You are about to make the following changes to your ENS records:
              </p>
              <div className="mt-3 space-y-2">
                {Object.entries(changedRecords).map(([key, value]) => (
                  <div 
                    key={key} 
                    className="flex items-start gap-2 text-sm group hover:bg-white/5 p-2 rounded-lg transition-colors w-full overflow-hidden"
                    title={value}
                  >
                    <div className={`${isMobile ? 'w-[72px]' : 'w-24'} flex-shrink-0 text-gray-400`}>
                      {formatRecordKey(key)}:
                    </div>
                    <div className="flex-1 min-w-0 truncate">
                      {value === "" ? (
                        <span className="flex items-center gap-1 text-red-400">
                          <X className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Clearing record</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-400">
                          <Check className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{getValueDisplay(value)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-[#353B4D]/20 flex-shrink-0">
        <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-400">
            Note: Updates made on L2 networks (Optimism/Base) will be synchronized to L1 Ethereum within approximately 1 hour.
          </p>
        </div>

        <Button 
          onClick={() => onContinue(10, "optimism")}
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isPending || isProcessing}
        >
          Confirm updates
        </Button>
      </div>
    </div>
  );
};

export default RecordChangesContent;

