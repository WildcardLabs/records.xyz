
import { useState, useEffect } from 'react';
import { useAccount, useEnsResolver, useChainId, useSwitchChain, useWriteContract, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';
import { namehash, createPublicClient, http } from 'viem';
import { Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import ConnectWalletButton from './ens/ConnectWalletButton';
import ENSSelector from './ens/ENSSelector';
import ResolverCheckModal from './ens/ResolverCheckModal';
import ChainSelectionModal from './ens/ChainSelectionModal';
import ENSRecordsView from './ens/ENSRecordsView';
import { formatRecordsForAPI } from '@/utils/ensUtils';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProfileEditor from './ProfileEditor';

const ENS_REGISTRY_ABI = [{
  name: 'setResolver',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    { type: 'bytes32', name: 'node' },
    { type: 'address', name: 'resolver' }
  ],
  outputs: []
}, {
  name: 'owner',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ type: 'bytes32', name: 'node' }],
  outputs: [{ type: 'address' }]
}] as const;

const NAME_WRAPPER_ABI = [{
  name: 'setResolver',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    { type: 'bytes32', name: 'node' },
    { type: 'address', name: 'resolver' }
  ],
  outputs: []
}] as const;

const NAME_WRAPPER_OWNER_ABI = [{
  name: 'ownerOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ type: 'uint256', name: 'id' }],
  outputs: [{ type: 'address' }]
}] as const;

const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const;
const NAME_WRAPPER_ADDRESS = '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401' as const;
const CORRECT_RESOLVER = '0x4025fE371f146F8315e76B944c36E9f03B64002C' as `0x${string}`;

interface ENSResolverStatus {
  [key: string]: boolean;
}

interface NewENSStatus {
  [key: string]: boolean;
}

type SocialPlatform = "" | "x" | "farcaster";

export interface Records {
  header?: {
    value: string;
    countdown: number;
  };
  avatar?: {
    value: string;
    countdown: number;
  };
  name: {
    value: string;
    countdown: number;
  };
  description: {
    value: string;
    countdown: number;
  };
  url: {
    value: string;
    countdown: number;
  };
  redirect: {
    value: string;
    countdown: number;
  };
  email: {
    value: string;
    countdown: number;
  };
  twitter: {
    value: string;
    countdown: number;
  };
  farcaster: {
    value: string;
    countdown: number;
  };
  github: {
    value: string;
    countdown: number;
  };
  discord: {
    value: string;
    countdown: number;
  };
  telegram: {
    value: string;
    countdown: number;
  };
  mainnet: {
    value: string;
    countdown: number;
  };
  optimism: {
    value: string;
    countdown: number;
  };
  base: {
    value: string;
    countdown: number;
  };
  arbitrum: {
    value: string;
    countdown: number;
  };
  linea: {
    value: string;
    countdown: number;
  };
  polygon: {
    value: string;
    countdown: number;
  };
}

interface RecordResponse {
  [key: string]: {
    value: string;
    countdown: number;
  };
}

const ENSRecordsManager = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const mainnetClient = createPublicClient({
    chain: mainnet,
    transport: http()
  });
  const [selectedENS, setSelectedENS] = useState<string>("");
  const [showEditor, setShowEditor] = useState(false);
  const [showResolverCheck, setShowResolverCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [hasCorrectResolver, setHasCorrectResolver] = useState(false);
  const [checkedENS, setCheckedENS] = useState<string | null>(null);
  const [resolverStatuses, setResolverStatuses] = useState<ENSResolverStatus>({});
  const [newENSStatuses, setNewENSStatuses] = useState<NewENSStatus>({});
  const [showProfile, setShowProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [records, setRecords] = useState<Records>({
    header: undefined,
    avatar: undefined,
    name: { value: '', countdown: 0 },
    description: { value: '', countdown: 0 },
    url: { value: '', countdown: 0 },
    redirect: { value: '', countdown: 0 },
    email: { value: '', countdown: 0 },
    twitter: { value: '', countdown: 0 },
    farcaster: { value: '', countdown: 0 },
    github: { value: '', countdown: 0 },
    discord: { value: '', countdown: 0 },
    telegram: { value: '', countdown: 0 },
    mainnet: { value: '', countdown: 0 },
    optimism: { value: '', countdown: 0 },
    base: { value: '', countdown: 0 },
    arbitrum: { value: '', countdown: 0 },
    linea: { value: '', countdown: 0 },
    polygon: { value: '', countdown: 0 },
  });
  
  const [showChainSelection, setShowChainSelection] = useState(false);
  const [multicallData, setMulticallData] = useState<{ calls: readonly `0x${string}`[] } | null>(null);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setSelectedENS("");
    setShowEditor(false);
    setShowResolverCheck(false);
    setIsLoading(false);
    setIsMigrating(false);
    setHasCorrectResolver(false);
    setCheckedENS(null);
    setResolverStatuses({});
    setNewENSStatuses({});
    setShowProfile(false);
    setIsLoadingProfile(false);
  }, [address]);

  const resetPage = () => {
    setSelectedENS("");
    setShowEditor(false);
    setShowResolverCheck(false);
    setIsLoading(false);
    setIsMigrating(false);
    setHasCorrectResolver(false);
    setCheckedENS(null);
    setResolverStatuses({});
    setNewENSStatuses({});
    setShowProfile(false);
    setIsLoadingProfile(false);
    setRecords({
      header: undefined,
      avatar: undefined,
      name: { value: '', countdown: 0 },
      description: { value: '', countdown: 0 },
      url: { value: '', countdown: 0 },
      redirect: { value: '', countdown: 0 },
      email: { value: '', countdown: 0 },
      twitter: { value: '', countdown: 0 },
      farcaster: { value: '', countdown: 0 },
      github: { value: '', countdown: 0 },
      discord: { value: '', countdown: 0 },
      telegram: { value: '', countdown: 0 },
      mainnet: { value: '', countdown: 0 },
      optimism: { value: '', countdown: 0 },
      base: { value: '', countdown: 0 },
      arbitrum: { value: '', countdown: 0 },
      linea: { value: '', countdown: 0 },
      polygon: { value: '', countdown: 0 },
    });
  };

  const { data: resolverAddress } = useEnsResolver({
    name: selectedENS,
    chainId: 1
  });

  const { data: ensNames = [], isLoading: isLoadingENS } = useQuery({
    queryKey: ['ens-names', address],
    queryFn: async () => {
      if (!address) return [];
      const response = await fetch(`https://us-central1-matic-services.cloudfunctions.net/domainlist?address=${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ENS names');
      }
      return response.json();
    },
    enabled: !!address,
  });

  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ['ens-records', selectedENS, address],
    queryFn: async () => {
      if (!selectedENS || !address) return null;
      const node = namehash(selectedENS);
      const response = await fetch(
        `https://us-central1-superchain-resolver.cloudfunctions.net/super-records?node=${node}&addr=${address}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      return response.json() as Promise<RecordResponse>;
    },
    enabled: false, // <-- Changed this to false so it doesn't auto-fetch
  });

  const loadProfileData = async () => {
    if (!hasCorrectResolver) {
      return;
    }
    setIsLoadingProfile(true);
    setShowProfile(true);
    await refetchProfile();
    setIsLoadingProfile(false);
  };

  const handleENSChange = async (value: string) => {
    setSelectedENS(value);
    setShowProfile(false);
    setShowResolverCheck(false);
    setShowEditor(false);
    
    if (value) {
      setIsLoading(true);

      const currentResolver = await mainnetClient.getEnsResolver({
        name: value,
      });
      
      const isCorrect = currentResolver?.toLowerCase() === CORRECT_RESOLVER.toLowerCase();
      
      setHasCorrectResolver(isCorrect);
      setCheckedENS(value);
      setResolverStatuses(prev => ({
        ...prev,
        [value]: isCorrect
      }));
      
      setIsLoading(false);
    }
  };

  const handleAction = () => {
    if (showProfile) {
      loadProfileData();
    } else {
      if (!hasCorrectResolver) {
        setShowResolverCheck(true);
      } else {
        setShowProfile(true);
        loadProfileData();
      }
    }
  };

  const handleCheckResolver = async () => {
    if (!address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first.",
        className: "bg-[#1A1F2C] border-red-500 text-white",
        duration: 5000,
      });
      return;
    }

    if (!selectedENS) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an ENS name first.",
        className: "bg-[#1A1F2C] border-red-500 text-white",
        duration: 5000,
      });
      return;
    }
    
    setShowResolverCheck(true);
    setIsLoading(true);
    
    const isCorrect = resolverAddress?.toLowerCase() === CORRECT_RESOLVER.toLowerCase();
    
    setHasCorrectResolver(isCorrect);
    setCheckedENS(selectedENS);
    setResolverStatuses(prev => ({
      ...prev,
      [selectedENS]: isCorrect
    }));
    setIsLoading(false);

    if (isCorrect) {
      setShowResolverCheck(false);
    }
  };

  const handleMigrateResolver = async () => {
    if (!address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first.",
        className: "bg-[#1A1F2C] border-red-500 text-white",
        duration: 5000,
      });
      return;
    }

    const isCorrect = resolverAddress?.toLowerCase() === CORRECT_RESOLVER.toLowerCase();
    if (isCorrect) {
      toast({
        description: "Resolver is already up to date!",
        className: "bg-[#1A1F2C] border-green-500 text-white",
        duration: 3000,
      });
      setShowResolverCheck(false);
      await loadProfileData();
      return;
    }

    if (chainId !== mainnet.id) {
      toast({
        title: "Wrong Network",
        description: (
          <div className="flex flex-col gap-2">
            <p>Please switch to Ethereum mainnet to continue.</p>
            <p className="text-sm text-gray-400">
              ENS resolver migration can only be performed on Ethereum mainnet.
            </p>
          </div>
        ),
        className: "bg-[#1A1F2C] border-yellow-500 text-white",
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    setIsMigrating(true);

    try {
      const nameHash = namehash(selectedENS);
      console.log('ENS Name:', selectedENS);
      console.log('Generated namehash:', nameHash);
      console.log('Current resolver:', resolverAddress);
      console.log('Target resolver:', CORRECT_RESOLVER);

      const registryOwner = await publicClient.readContract({
        address: ENS_REGISTRY_ADDRESS,
        abi: ENS_REGISTRY_ABI,
        functionName: 'owner',
        args: [nameHash]
      });

      const isWrapped = registryOwner.toLowerCase() === NAME_WRAPPER_ADDRESS.toLowerCase();
      console.log('Registry owner:', registryOwner);
      console.log('Is name wrapped:', isWrapped);
      
      const contractAddress = isWrapped ? NAME_WRAPPER_ADDRESS : ENS_REGISTRY_ADDRESS;
      const contractABI = isWrapped ? NAME_WRAPPER_ABI : ENS_REGISTRY_ABI;
      
      console.log('Using contract:', isWrapped ? 'Name Wrapper' : 'ENS Registry');

      const pendingToast = toast({
        description: "Please confirm the transaction in your wallet",
        className: "bg-[#1A1F2C] border-[#6E59A5] text-white",
        title: "Transaction Pending",
        action: (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#9b87f5]" />
          </div>
        ),
        duration: Infinity,
      });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: 'setResolver',
        args: [nameHash, CORRECT_RESOLVER],
        chain: mainnet,
        account: address
      });

      console.log('Set resolver transaction hash:', hash);

      pendingToast.dismiss();

      const submittedToast = toast({
        description: (
          <div className="flex flex-col gap-1 text-white">
            <span>Waiting for confirmation...</span>
            <a 
              href={`https://etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors text-sm underline"
            >
              View on Etherscan
            </a>
          </div>
        ),
        className: "bg-[#1A1F2C] border-[#6E59A5] text-white",
        title: "Transaction Submitted",
        action: (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#9b87f5]" />
          </div>
        ),
        duration: Infinity,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      submittedToast.dismiss();
      
      if (receipt.status === 'success') {
        setHasCorrectResolver(true);
        setCheckedENS(selectedENS);
        setResolverStatuses(prev => ({
          ...prev,
          [selectedENS]: true
        }));
        setNewENSStatuses(prev => ({
          ...prev,
          [selectedENS]: true
        }));
        
        setShowResolverCheck(false);
        setShowProfile(false);
        await loadProfileData();
        toast({
          description: "Resolver updated successfully!",
          className: "bg-[#1A1F2C] border-green-500 text-white",
          title: "Success",
          action: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          ),
          duration: 5000,
        });
      } else {
        throw new Error("Transaction failed");
      }
      
    } catch (error) {
      console.error('Error setting resolver:', error);
      setHasCorrectResolver(false);
      setShowProfile(false);
      toast({
        variant: "destructive",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "Failed to update resolver. Please try again.",
        className: "bg-[#1A1F2C] border-red-500 text-white",
        title: "Transaction Failed",
        action: (
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
        ),
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setIsMigrating(false);
    }
  };

  const handleEditProfile = async () => {
    if (selectedENS && hasCorrectResolver) {
      setShowEditor(true);
      
      // Don't reload profile data if we already have it
      if (!profileData) {
        await loadProfileData();
      }
      
      // Convert profile data to form data format
      const [firstName, lastName] = (profileData?.name?.value || "").split(" ");
      const formData = {
        firstName: firstName || "",
        lastName: lastName || "",
        avatarHeaderUsername: profileData?.x?.value?.replace(/^@/, '') || "",
        website: profileData?.website?.value || "",
        useWebsiteAsRedirect: false, // Default to false
        email: profileData?.email?.value || "",
        bio: profileData?.bio?.value || "",
        socials: {
          x: profileData?.x?.value || "",
          farcaster: profileData?.farcaster?.value || "",
          github: profileData?.github?.value || "",
          discord: profileData?.discord?.value || "",
          telegram: profileData?.telegram?.value || "",
        },
        addresses: {
          ethereum: profileData?.ethereum?.value || "",
          optimism: profileData?.optimism?.value || "",
          base: profileData?.base?.value || "",
          arbitrum: profileData?.arbitrum?.value || "",
          linea: profileData?.linea?.value || "",
          polygon: profileData?.polygon?.value || "",
        },
      };
      
      // Update the records state
      setRecords({
        header: profileData?.header,
        avatar: profileData?.avatar,
        name: profileData?.name || { value: '', countdown: 0 },
        description: profileData?.description || { value: '', countdown: 0 },
        url: profileData?.url || { value: '', countdown: 0 },
        redirect: profileData?.redirect || { value: '', countdown: 0 },
        email: profileData?.email || { value: '', countdown: 0 },
        twitter: profileData?.twitter || { value: '', countdown: 0 },
        farcaster: profileData?.farcaster || { value: '', countdown: 0 },
        github: profileData?.github || { value: '', countdown: 0 },
        discord: profileData?.discord || { value: '', countdown: 0 },
        telegram: profileData?.telegram || { value: '', countdown: 0 },
        mainnet: profileData?.mainnet || { value: '', countdown: 0 },
        optimism: profileData?.optimism || { value: '', countdown: 0 },
        base: profileData?.base || { value: '', countdown: 0 },
        arbitrum: profileData?.arbitrum || { value: '', countdown: 0 },
        linea: profileData?.linea || { value: '', countdown: 0 },
        polygon: profileData?.polygon || { value: '', countdown: 0 },
      });
    }
  };

  const handleRecordChange = (field: keyof Records, value: string) => {
    console.log(`Setting record ${field} to:`, value);
    setRecords(prev => ({
      ...prev,
      [field]: { value, countdown: 0 }
    }));
  };

  const handleFormSubmit = async (records: Record<string, string>): Promise<void> => {
    try {
      const payload = formatRecordsForAPI(selectedENS, records);
      
      const response = await fetch('https://us-central1-superchain-resolver.cloudfunctions.net/multicall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to update records');
      }

      // Show chain selection modal with the multicall data
      setMulticallData(data);
      setShowChainSelection(true);
      
    } catch (error) {
      console.error('Error updating records:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update records. Please try again.",
      });
    }
  };

  const handleChainSelect = async (chain: "optimism" | "base") => {
    if (chain === "optimism") {
      console.log("Switched to Optimism, ready for next step");
    } else if (chain === "base") {
      console.log("Switched to Base, ready for next step");
    }
  };

  const handleRecordsUpdateSuccess = async () => {
    setIsRefreshing(true);
    setShowEditor(false);
    
    // Show refreshing toast
    const refreshToast = toast({
      description: "Refreshing profile data...",
      className: "bg-[#1A1F2C] border-[#6E59A5] text-white",
      duration: 2000,
      action: (
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-[#9b87f5]" />
        </div>
      ),
    });

    // Wait for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Fetch new data
    await loadProfileData();
    
    // Clear refreshing state
    setIsRefreshing(false);
    refreshToast.dismiss();
    
    // Reset all editor state after blockchain confirmation
    const editorElement = document.querySelector('[role="dialog"]');
    if (editorElement) {
      const closeButton = editorElement.querySelector('button[aria-label="Close"]');
      if (closeButton instanceof HTMLButtonElement) {
        closeButton.click();
      }
    }

    // Show success toast
    toast({
      description: "Profile updated successfully!",
      className: "bg-[#1A1F2C] border-green-500 text-white",
      duration: 3000,
      action: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </div>
      ),
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {!isConnected && (
        <ConnectWalletButton onConnect={() => {}} />
      )}

      {isConnected && (
        <div className="w-full flex flex-col items-center gap-4">
          <ENSSelector
            selectedENS={selectedENS}
            onENSChange={handleENSChange}
            onAction={handleAction}
            ensNames={ensNames}
            shouldShowEditProfile={hasCorrectResolver}
            showProfile={showProfile}
            isLoadingProfile={isLoadingProfile}
            isLoadingENS={isLoadingENS}
            isCheckingResolver={isLoading}
          />

          {showProfile && (
            <div className="w-full">
              <ENSRecordsView 
                ensName={selectedENS} 
                onEditClick={handleEditProfile}
                isLoading={isLoadingProfile || isRefreshing}
                profileData={profileData}
              />
            </div>
          )}

          <ResolverCheckModal
            open={showResolverCheck}
            onOpenChange={setShowResolverCheck}
            isLoading={isLoading}
            isMigrating={isMigrating}
            hasCorrectResolver={hasCorrectResolver}
            onMigrateResolver={handleMigrateResolver}
            onEditProfile={handleEditProfile}
          />

          <ProfileEditor
            open={showEditor}
            onOpenChange={setShowEditor}
            selectedENS={selectedENS}
            records={records}
            onRecordChange={handleRecordChange}
            onSubmit={handleFormSubmit}
          />

          <ChainSelectionModal
            open={showChainSelection}
            onOpenChange={setShowChainSelection}
            onChainSelect={handleChainSelect}
            multicallData={multicallData}
            onSuccess={handleRecordsUpdateSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default ENSRecordsManager;
