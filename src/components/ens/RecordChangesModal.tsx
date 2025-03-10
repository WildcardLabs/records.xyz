
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import RecordChangesContent from "./RecordChangesContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";

interface RecordChangesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  isProcessing: boolean;
  changedRecords: Record<string, string>;
  onContinue: (chainId: number, chainType: "optimism" | "base") => void;
  isBasename?: boolean;
  networkType?: "optimism" | "base";
  selectedENS?: string; // Add selectedENS prop
}

const RecordChangesModal = ({
  open,
  onOpenChange,
  isLoading,
  isProcessing,
  changedRecords,
  onContinue,
  isBasename = false,
  networkType = "optimism",
  selectedENS = "", // Default to empty string
}: RecordChangesModalProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`bg-[#1A1F2C]/70 backdrop-blur-[4px] text-white border-[#353B4D]/20 p-0 flex flex-col ${
          isMobile 
            ? 'w-full rounded-none h-[100dvh]' 
            : 'sm:rounded-lg sm:max-w-md max-h-[90vh] h-fit'
        }`}
      >
        <DialogHeader className="p-6 py-4 border-b border-[#353B4D]/20 flex flex-row items-center justify-between flex-shrink-0">
          <DialogTitle>Update Records</DialogTitle>
          <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex-1 overflow-hidden min-h-0">
          <RecordChangesContent
            isPending={isLoading}
            isProcessing={isProcessing}
            changedRecords={changedRecords}
            onContinue={onContinue}
            isBasename={isBasename}
            selectedENS={selectedENS}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordChangesModal;
