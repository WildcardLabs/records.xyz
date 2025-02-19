import { useChainId, useSwitchChain, useWriteContract, useAccount, usePublicClient } from 'wagmi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { base, optimism } from 'viem/chains';
import NetworkOptions from "./network-options/NetworkOptions";
import TransactionStatus from "./transaction/TransactionStatus";

const RESOLVER_CONTRACT = '0x77526a5Ca82028cA9Bb2f2380Da59B386A4EE03f' as const;

interface ChainSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChainSelect: (chain: "optimism" | "base") => void;
  multicallData: { calls: readonly `0x${string}`[] } | null;
  onSuccess?: () => Promise<void>;
}

const ChainSelectionModal = ({
  open,
  onOpenChange,
  onChainSelect,
  multicallData,
  onSuccess,
}: ChainSelectionModalProps) => {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedChain, setSelectedChain] = useState<"optimism" | "base" | null>(null);
  const [readyToContinue, setReadyToContinue] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [open]);

  const handleChainSelect = async (targetChainId: number, chainType: "optimism" | "base") => {
    setSelectedChain(chainType);
    setReadyToContinue(false);
    
    if (chainId === targetChainId) {
      setReadyToContinue(true);
      return;
    }

    try {
      if (isMobile) {
        const metamaskUrl = `https://metamask.app.link/dapp/${window.location.host}`;
        const timer = setTimeout(() => {
          window.location.href = metamaskUrl;
        }, 1000);
        
        await switchChain({ chainId: targetChainId });
        clearTimeout(timer);
      } else {
        await switchChain({ chainId: targetChainId });
      }
      
      setReadyToContinue(true);
    } catch (error) {
      console.error("Chain switch error:", error);
      setSelectedChain(null);
    }
  };

  const executeMulticall = async () => {
    if (!multicallData || !selectedChain || !address) {
      console.error('Missing required data:', { multicallData, selectedChain, address });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      toast({
        title: "Transaction Initiated",
        description: "Please confirm the transaction in your wallet",
        className: "bg-[#1A1F2C] border-blue-500 text-white",
      });

      const targetChain = selectedChain === 'optimism' ? optimism : base;

      const resolverABI = [{
        type: 'function',
        name: 'multicall',
        inputs: [{ type: 'bytes[]', name: 'data' }],
        outputs: [{ type: 'bytes[]', name: 'results' }],
        stateMutability: 'nonpayable'
      }] as const;

      const hash = await writeContractAsync({
        address: RESOLVER_CONTRACT,
        abi: resolverABI,
        functionName: 'multicall',
        args: [multicallData.calls],
        chain: targetChain,
        account: address
      });

      toast({
        title: "Transaction Submitted",
        description: (
          <div className="flex flex-col gap-2">
            <span>Your transaction is being processed on the blockchain</span>
            <a 
              href={`${selectedChain === 'optimism' ? 'https://optimistic.etherscan.io' : 'https://basescan.org'}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors text-sm underline flex items-center gap-1"
            >
              View on Block Explorer
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        ),
        className: "bg-[#1A1F2C] border-blue-500 text-white",
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction receipt:', receipt);

      if (receipt.status) {
        toast({
          title: "Records Updated Successfully",
          description: (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>Your ENS records have been updated!</span>
              </div>
              <a 
                href={`${selectedChain === 'optimism' ? 'https://optimistic.etherscan.io' : 'https://basescan.org'}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors text-sm underline flex items-center gap-1"
              >
                View on Block Explorer
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          ),
          className: "bg-[#1A1F2C] border-green-500 text-white",
          duration: 5000,
        });

        if (onSuccess) {
          await onSuccess();
        }

        onChainSelect(selectedChain);
        onOpenChange(false);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Multicall error:', error);
      
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: "Failed to update ENS records. Please try again.",
        className: "bg-[#1A1F2C] border-red-500 text-white",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (!selectedChain) return;
    executeMulticall();
  };

  if (!showModal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C]/70 backdrop-blur-[4px] text-white border-[#353B4D]/20 max-w-md h-auto max-h-[80vh] overflow-y-auto rounded-2xl flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">Select Network</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a network to update your ENS records
          </DialogDescription>
        </DialogHeader>
        
        <NetworkOptions
          selectedChain={selectedChain}
          isPending={isPending}
          isProcessing={isProcessing}
          onChainSelect={handleChainSelect}
        />

        <TransactionStatus
          isPending={isPending}
          isProcessing={isProcessing}
        />

        <DialogFooter className="mt-6">
          {readyToContinue && (
            <Button
              onClick={handleContinue}
              disabled={!selectedChain || isPending || isProcessing}
              className={`w-full ${
                selectedChain === 'optimism'
                  ? 'bg-[#FF0420] hover:bg-[#FF0420]/80'
                  : 'bg-[#0052FF] hover:bg-[#0052FF]/80'
              } text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                'Continue'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChainSelectionModal;
