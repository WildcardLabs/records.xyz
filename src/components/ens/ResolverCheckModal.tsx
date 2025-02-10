
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ResolverCheckContent from "./ResolverCheckContent";

interface ResolverCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  isMigrating: boolean;
  hasCorrectResolver: boolean;
  onMigrateResolver: () => void;
  onEditProfile: () => void;
}

const ResolverCheckModal = ({
  open,
  onOpenChange,
  isLoading,
  isMigrating,
  hasCorrectResolver,
  onMigrateResolver,
  onEditProfile,
}: ResolverCheckModalProps) => {
  // Don't render the modal if no ENS name is selected (when resolver check is triggered)
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222222] text-white border-[#403E43] max-w-md">
        <DialogHeader>
          <DialogTitle>Resolver Check</DialogTitle>
          <DialogDescription className="text-gray-400">
            <ResolverCheckContent
              isLoading={isLoading}
              isChecking={!hasCorrectResolver && isLoading && !isMigrating}
              hasCorrectResolver={hasCorrectResolver}
              onMigrateResolver={onMigrateResolver}
              onEditProfile={onEditProfile}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ResolverCheckModal;

