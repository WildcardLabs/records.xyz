import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Globe, MessageCircle, Github, Copy, Database, PenSquare, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import AddressRecordStatus from './AddressRecordStatus';
import { chainLogos } from "@/constants/chains";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileData {
  [key: string]: {
    value: string;
    countdown: number;
  };
}

interface ProfileViewProps {
  ensName: string;
  onEditClick: () => void;
  isLoading?: boolean;
  profileData?: ProfileData | null;
}

const ProfileView = ({ ensName, onEditClick, isLoading = false, profileData }: ProfileViewProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      description: "Address copied to clipboard",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-8 bg-[#1A1F2C] rounded-2xl overflow-hidden border border-[#353B4D]/20">
        <Skeleton className="w-full h-32" />
        <div className="px-4 sm:px-6">
          <div className="relative -mt-12 mb-4">
            <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-[#1A1F2C]" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            {[1, 2, 3].map((section) => (
              <div key={section} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2">
                  {[1, 2].map((item) => (
                    <Skeleton key={item} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasNoProfileRecords = !profileData || (
    !profileData.name?.value &&
    !profileData.description?.value &&
    !profileData.avatar?.value &&
    !profileData.header?.value &&
    !profileData.url?.value &&
    !profileData.email?.value &&
    !profileData.twitter?.value &&
    !profileData.farcaster?.value &&
    !profileData.github?.value &&
    !profileData.discord?.value &&
    !profileData.telegram?.value
  );

  const hasNoAddressRecords = !profileData || (
    !profileData.mainnet?.value &&
    !profileData.optimism?.value &&
    !profileData.base?.value &&
    !profileData.arbitrum?.value &&
    !profileData.linea?.value &&
    !profileData.polygon?.value
  );

  if (hasNoProfileRecords && hasNoAddressRecords) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-8 bg-[#1A1F2C] rounded-2xl overflow-hidden border border-[#353B4D]/20">
        <div className="px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#353B4D]/30 rounded-2xl flex items-center justify-center mb-6">
            <PenSquare className="w-7 h-7 sm:w-8 sm:h-8 text-[#9b87f5]" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No records set yet</h3>
          <p className="text-[#8E9196] mb-6 sm:mb-8 max-w-md text-sm sm:text-base">
            Get started by setting up your profile, social links, and addresses for {ensName}
          </p>
          <Button 
            onClick={onEditClick}
            size="lg"
            className="bg-[#9b87f5] hover:bg-[#8875e6] text-white w-full"
          >
            Set Up Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-8">
      <div className="bg-[#1A1F2C] rounded-2xl overflow-hidden border border-[#353B4D]/20">
        <div 
          className="w-full h-32 sm:h-48 bg-cover bg-center"
          style={{ 
            backgroundImage: profileData?.header?.value 
              ? `url(${profileData.header.value})`
              : profileData?.avatar?.value 
                ? `url(${profileData.avatar.value})`
                : undefined,
            backgroundColor: '#2A2A2A' 
          }}
        />
        
        <div className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between relative">
            <div className="mb-12 sm:mb-0">
              <Avatar className={cn(
                "absolute ring-4 ring-[#1A1F2C] bg-[#2A2A2A]",
                isMobile ? "-top-10 h-20 w-20 rounded-full" : "-top-12 h-24 w-24 rounded-full"
              )}>
                <AvatarImage src={profileData?.avatar?.value} alt={profileData?.name?.value} />
                <AvatarFallback>
                  <User className={cn(
                    "text-white",
                    isMobile ? "h-10 w-10" : "h-12 w-12"
                  )} />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className={cn(
              "w-full sm:w-auto",
              isMobile ? "mt-4" : "pt-3"
            )}>
              <Button 
                onClick={onEditClick}
                size={isMobile ? "default" : "lg"}
                className={cn(
                  "bg-[#9b87f5] hover:bg-[#8875e6] text-white",
                  isMobile ? "w-full" : "w-auto"
                )}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          <div className={cn(
            "text-left",
            isMobile ? "mt-4" : "mt-4"
          )}>
            {profileData?.name?.value && (
              <h1 className="text-xl sm:text-2xl font-bold text-white">{profileData.name.value}</h1>
            )}
            <p className="text-sm sm:text-base text-[#8E9196] font-medium mt-0.5">{ensName}</p>
            {profileData?.description?.value && (
              <p className="text-sm sm:text-base text-[#C8C8C9] mt-3 leading-relaxed max-w-xl">
                {profileData.description.value}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-[#8E9196] mt-4 mb-4 sm:mb-6">
            {profileData?.url?.value && (
              <a 
                href={profileData.url.value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#9b87f5] transition-colors px-2.5 sm:px-3 py-1.5 bg-[#353B4D]/20 rounded-lg"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{new URL(profileData.url.value).hostname}</span>
                <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-50" />
              </a>
            )}
            {profileData?.email?.value && (
              <a 
                href={`mailto:${profileData.email.value}`}
                className="flex items-center gap-2 hover:text-[#9b87f5] transition-colors px-2.5 sm:px-3 py-1.5 bg-[#353B4D]/20 rounded-lg"
              >
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{profileData.email.value}</span>
              </a>
            )}
          </div>

          {(profileData?.twitter?.value || profileData?.farcaster?.value || profileData?.github?.value || 
            profileData?.discord?.value || profileData?.telegram?.value) && (
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileData?.twitter?.value && (
                  <a 
                    href={`https://x.com/${profileData.twitter.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 bg-[#353B4D]/10 hover:bg-[#353B4D]/20 group border border-[#353B4D]/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1DA1F2]/5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium">X (Twitter)</span>
                      <span className="text-[#8E9196] text-sm truncate">@{profileData.twitter.value}</span>
                    </div>
                  </a>
                )}
                
                {profileData?.farcaster?.value && (
                  <a 
                    href={`https://warpcast.com/${profileData.farcaster.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 bg-[#353B4D]/10 hover:bg-[#353B4D]/20 group border border-[#353B4D]/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#855DCD]/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-[#855DCD]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium">Farcaster</span>
                      <span className="text-[#8E9196] text-sm truncate">@{profileData.farcaster.value}</span>
                    </div>
                  </a>
                )}

                {profileData?.github?.value && (
                  <a 
                    href={`https://github.com/${profileData.github.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 bg-[#353B4D]/10 hover:bg-[#353B4D]/20 group border border-[#353B4D]/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#353B4D]/30 flex items-center justify-center flex-shrink-0">
                      <Github className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium">GitHub</span>
                      <span className="text-[#8E9196] text-sm truncate">{profileData.github.value}</span>
                    </div>
                  </a>
                )}

                {profileData?.discord?.value && (
                  <a 
                    href={`https://discord.com/users/${profileData.discord.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 bg-[#353B4D]/10 hover:bg-[#353B4D]/20 group border border-[#353B4D]/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 0-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium">Discord</span>
                      <span className="text-[#8E9196] text-sm truncate">{profileData.discord.value}</span>
                    </div>
                  </a>
                )}

                {profileData?.telegram?.value && (
                  <a 
                    href={`https://t.me/${profileData.telegram.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 bg-[#353B4D]/10 hover:bg-[#353B4D]/20 group border border-[#353B4D]/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0088cc]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium">Telegram</span>
                      <span className="text-[#8E9196] text-sm truncate">@{profileData.telegram.value}</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[#9b87f5]" />
              <h3 className="text-sm sm:text-base text-white font-medium">Addresses</h3>
            </div>

            {hasNoAddressRecords ? (
              <div className="bg-[#353B4D]/10 p-4 sm:p-6 rounded-xl text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#353B4D]/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-5 h-5 sm:w-6 sm:h-6 text-[#8E9196]" />
                </div>
                <h4 className="text-base sm:text-lg font-medium text-white mb-2">No address records set</h4>
                <p className="text-sm sm:text-base text-[#8E9196] mb-4 sm:mb-6">
                  Add blockchain addresses to your ENS name to make it easier for others to send you tokens
                </p>
                <Button 
                  onClick={onEditClick}
                  size={isMobile ? "default" : "lg"}
                  className="bg-[#9b87f5] hover:bg-[#8875e6] text-white w-full"
                >
                  Add Addresses
                </Button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {Object.entries({
                  mainnet: profileData?.mainnet,
                  optimism: profileData?.optimism,
                  base: profileData?.base,
                  arbitrum: profileData?.arbitrum,
                  linea: profileData?.linea,
                  polygon: profileData?.polygon,
                }).filter(([_, data]) => data?.value).map(([chain, data]) => (
                  <div 
                    key={chain}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 bg-[#353B4D]/10 hover:bg-[#353B4D]/20 group border border-[#353B4D]/10"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#353B4D]/30">
                        <img 
                          src={`/lovable-uploads/${chainLogos[chain as keyof typeof chainLogos]}`}
                          alt={chain}
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                      </div>
                      <span className="text-xs sm:text-sm text-[#C8C8C9] font-mono truncate">{data.value}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <AddressRecordStatus countdown={data.countdown} />
                      <button
                        onClick={() => handleCopyAddress(data.value)}
                        className="p-1.5 sm:p-2 hover:bg-[#353B4D]/30 rounded-lg transition-colors flex-shrink-0"
                        title="Copy address"
                      >
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8E9196]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
