
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ResolverCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  isMigrating: boolean;
  hasCorrectResolver: boolean;
  onMigrateResolver: () => void;
  onEditProfile: () => void;
  isBasename?: boolean;
}

const ResolverCheckModal = ({
  open,
  onOpenChange,
  isLoading,
  isMigrating,
  hasCorrectResolver,
  onMigrateResolver,
  onEditProfile,
  isBasename = false,
}: ResolverCheckModalProps) => {
  // Skip displaying the modal completely for basenames
  if (isBasename || !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1A1F2C]/70 backdrop-blur-[4px] text-white border-[#353B4D]/20 sm:h-auto">
        <DialogHeader>
          <DialogTitle>Update Resolver</DialogTitle>
          <DialogDescription className="text-gray-400">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <div className="mt-4 text-center">
                  {isMigrating ? (
                    <div className="space-y-2">
                      <p>Updating resolver...</p>
                      <p className="text-sm text-gray-500">
                        Please follow the prompts in your wallet
                      </p>
                    </div>
                  ) : (
                    "Checking resolver status..."
                  )}
                </div>
              </div>
            ) : (
              <div className="py-4">
                <div>
                  <p className="mb-4">
                    To enable L2 record management, you need to update your ENS resolver to the latest version.
                  </p>
                  <Button
                    onClick={onMigrateResolver}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    disabled={isLoading || isMigrating}
                  >
                    Update Resolver
                  </Button>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ResolverCheckModal;
