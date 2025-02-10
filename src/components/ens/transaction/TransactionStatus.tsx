
import { Loader2 } from "lucide-react";

interface TransactionStatusProps {
  isPending: boolean;
  isProcessing: boolean;
}

const TransactionStatus = ({ isPending, isProcessing }: TransactionStatusProps) => {
  if (!isPending && !isProcessing) return null;

  return (
    <div className="mt-4 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin text-[#9b87f5]" />
      {isPending ? (
        "Switching network... Please confirm in your wallet"
      ) : (
        "Processing transaction... Please confirm in your wallet"
      )}
    </div>
  );
};

export default TransactionStatus;
