import { useState, useEffect } from 'react';
import { useAccount, useEnsResolver, useChainId, useSwitchChain, useWriteContract, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';
import { namehash, createPublicClient, http } from 'viem';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Twitter } from "lucide-react";
import ConnectWalletButton from './ens/ConnectWalletButton';
import ENSSelector from './ens/ENSSelector';
import ResolverCheckModal from './ens/ResolverCheckModal';
import ProfileEditorModal from './ens/ProfileEditorModal';
import ChainSelectionModal from './ens/ChainSelectionModal';
import ENSRecordsView from './ens/ENSRecordsView';
import WalletStatus from './ens/WalletStatus';
import { formatRecordsForAPI } from '@/utils/ensUtils';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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

interface Records {
  // Profile
  name: string;
  bio: string;
  email: string;
  website: string;
  useWebsiteAsRedirect: boolean;
  
  // Addresses
  ethereum: string;
  optimism: string;
  base: string;
  arbitrum: string;
  linea: string;
  polygon: string;
  
  // Avatar
  avatarPlatform: SocialPlatform;
  avatarUsername: string;
  headerPlatform: SocialPlatform;
  headerUsername: string;
  
  // Socials
  x: string;
  farcaster: string;
  github: string;
  discord: string;
  telegram: string;
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
    // Profile
    name: "",
    bio: "",
    email: "",
    website: "",
    useWebsiteAsRedirect: false,
    
    // Addresses
    ethereum: "",
    optimism: "",
    base: "",
    arbitrum: "",
    linea: "",
    polygon: "",
    
    // Avatar
    avatarPlatform: "",
    avatarUsername: "",
    headerPlatform: "",
    headerUsername: "",
    
    // Socials
    x: "",
    farcaster: "",
    github: "",
    discord: "",
    telegram: "",
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
      name: "",
      bio: "",
      email: "",
      website: "",
      useWebsiteAsRedirect: false,
      ethereum: "",
      optimism: "",
      base: "",
      arbitrum: "",
      linea: "",
      polygon: "",
      avatarPlatform: "",
      avatarUsername: "",
      headerPlatform: "",
      headerUsername: "",
      x: "",
      farcaster: "",
      github: "",
      discord: "",
      telegram: "",
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
    enabled: !!selectedENS && !!address && hasCorrectResolver,
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
      await loadProfileData();
      setShowResolverCheck(false);
    }
  };

  const handleViewProfile = async () => {
    setShowResolverCheck(false);
    setShowProfile(true);
    await loadProfileData();
  };

  const handleRecordChange = (field: keyof Records, value: string | boolean) => {
    setRecords(prev => ({ ...prev, [field]: value }));
  };

  const hasFilledRecords = () => {
    return Object.entries(records).some(([key, value]) => {
      if (key === 'avatarPlatform' || key === 'headerPlatform') return false;
      if (typeof value === 'boolean') return false;
      return typeof value === 'string' && value.trim() !== '';
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasFilledRecords()) {
      toast({
        variant: "destructive",
        title: "No records to update",
        description: "Please fill in at least one field before submitting.",
      });
      return;
    }
    
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

      setMulticallData(data);
      setShowChainSelection(true);
      setShowEditor(false);
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
    <div className="min-h-screen bg-ens-dark text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <WalletStatus />
      </div>
      <div className="w-full max-w-4xl mx-auto text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={resetPage}
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/28193e56-2ecb-4f1d-88b9-9b88704698a0.png" 
              alt="Records Logo" 
              className="w-16 h-16"
            />
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-3">Unchain Your ENS</h1>
        
        <p className="text-base text-gray-400 max-w-2xl mx-auto">
          The go-to platform for managing your records across multiple L2 networks. 
          Unlock the full potential of your ENS, anytime, anywhere.
        </p>

        <a 
          href="https://twitter.com/records_xyz" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Twitter size={16} />
          <span>Follow @records_xyz for updates</span>
        </a>

        <div className="mt-6">
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
        </div>

        {showProfile && (
          <ENSRecordsView 
            ensName={selectedENS} 
            onEditClick={() => setShowEditor(true)}
            isLoading={isLoadingProfile || isRefreshing}
            profileData={profileData}
          />
        )}

        <ResolverCheckModal
          open={showResolverCheck}
          onOpenChange={setShowResolverCheck}
          isLoading={isLoading}
          isMigrating={isMigrating}
          hasCorrectResolver={hasCorrectResolver}
          onMigrateResolver={handleMigrateResolver}
          onEditProfile={handleViewProfile}
        />

        <ProfileEditorModal
          open={showEditor}
          onOpenChange={setShowEditor}
          selectedENS={selectedENS}
          records={records}
          onRecordChange={handleRecordChange}
          onSubmit={handleSubmit}
        />

        <ChainSelectionModal
          open={showChainSelection}
          onOpenChange={setShowChainSelection}
          onChainSelect={handleChainSelect}
          multicallData={multicallData}
          onSuccess={handleRecordsUpdateSuccess}
        />

        <div className="mt-16 text-gray-500 text-sm">
          © 2025 Records.xyz by @WildcardLabs
        </div>
      </div>
    </div>
  );
};

export default ENSRecordsManager;
