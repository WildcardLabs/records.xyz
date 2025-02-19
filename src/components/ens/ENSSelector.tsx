
import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ENSSelectorProps {
  selectedENS: string;
  onENSChange: (value: string) => void;
  onAction: () => void;
  ensNames: string[];
  shouldShowEditProfile: boolean;
  showProfile?: boolean;
  isLoadingProfile?: boolean;
  isLoadingENS?: boolean;
  isCheckingResolver?: boolean;
}

const ENSSelector = ({ 
  selectedENS, 
  onENSChange, 
  onAction, 
  ensNames,
  shouldShowEditProfile,
  showProfile = false,
  isLoadingProfile = false,
  isLoadingENS = false,
  isCheckingResolver = false
}: ENSSelectorProps) => {
  const { isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  if (isConnected && !isLoadingENS && !ensNames.length) {
    return (
      <div className="text-center text-gray-400">
        No ENS names found for this wallet address.
      </div>
    );
  }

  if (!isConnected) {
    return (
      <ConnectKitButton.Custom>
        {({ show }) => (
          <Button 
            onClick={show}
            className="bg-[#9b87f5] hover:bg-[#8875e6] text-white w-full sm:w-auto sm:min-w-[8rem]"
          >
            Manage Records
          </Button>
        )}
      </ConnectKitButton.Custom>
    );
  }

  const filteredNames = ensNames
    .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
      <Select 
        value={selectedENS}
        onValueChange={value => {
          onENSChange(value);
        }}
      >
        <SelectTrigger className="w-full sm:w-auto sm:min-w-[15rem] border-[#9b87f5] text-white text-center bg-muted/40 backdrop-blur-[2px]">
          <SelectValue className="text-center" placeholder={isLoadingENS ? "Loading ENS names..." : "Select ENS name"} />
        </SelectTrigger>
        <SelectContent className="bg-muted/40 backdrop-blur-[2px] border-[#403E43] w-full sm:w-auto sm:min-w-[15rem] z-50">
          <div className="flex items-center px-3 pb-2 pt-1 gap-2 border-b border-[#403E43]">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search ENS names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent focus:ring-0 text-white placeholder:text-gray-400 h-8"
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
          <ScrollArea className="h-[18.75rem]">
            {filteredNames.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-400">
                No ENS names found
              </div>
            ) : (
              filteredNames.map((name) => (
                <SelectItem 
                  key={name} 
                  value={name}
                  className="text-white hover:bg-muted/30 cursor-pointer text-center"
                >
                  {name}
                </SelectItem>
              ))
            )}
          </ScrollArea>
        </SelectContent>
      </Select>
      <Button 
        onClick={onAction}
        disabled={isCheckingResolver || !selectedENS}
        className="bg-[#9b87f5] hover:bg-[#8875e6] text-white w-full sm:w-auto sm:min-w-[8rem]"
      >
        {showProfile ? "Manage Profile" : "Manage Records"}
      </Button>
    </div>
  );
};

export default ENSSelector;
