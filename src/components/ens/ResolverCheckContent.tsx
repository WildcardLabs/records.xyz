
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResolverCheckContentProps {
  isLoading: boolean;
  isChecking: boolean;
  hasCorrectResolver: boolean;
  onMigrateResolver: () => void;
  onEditProfile: () => void;
}

const ResolverCheckContent = ({
  isLoading,
  isChecking,
  hasCorrectResolver,
  onMigrateResolver,
  onEditProfile,
}: ResolverCheckContentProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <div className="mt-4 text-center">
          {isChecking ? (
            "Checking resolver status..."
          ) : (
            <div className="space-y-2">
              <p>Updating resolver...</p>
              <p className="text-sm text-gray-500">
                Please follow the prompts in your wallet
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (hasCorrectResolver) {
    return (
      <div className="py-4 space-y-4">
        <div className="text-green-400">
          Your resolver is up to date! You can now manage your ENS records.
        </div>
        <Button 
          onClick={onEditProfile}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Continue to Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-yellow-500 font-medium">Network Requirements</p>
          <p className="mt-1 text-sm text-gray-400">
            To update your resolver, you'll need to:
          </p>
          <ul className="mt-2 text-sm text-gray-400 list-disc list-inside space-y-1">
            <li>Switch to Ethereum mainnet</li>
            <li>Sign a transaction to update your resolver</li>
          </ul>
        </div>
      </div>
      
      <div>
        To enable all features and manage your records across multiple chains, we need to update your ENS name to use our latest resolver.
      </div>
      
      <Button 
        onClick={onMigrateResolver}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        Update Resolver
      </Button>
    </div>
  );
};

export default ResolverCheckContent;

