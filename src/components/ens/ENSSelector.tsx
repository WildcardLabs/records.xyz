
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

  // Show only the button if we don't have ENS names yet
  if (!ensNames.length) {
    return (
      <ConnectKitButton.Custom>
        {({ show }) => (
          <Button 
            onClick={() => {
              if (!isConnected) {
                show();
              } else {
                onAction();
              }
            }}
            className="bg-ens-accent hover:bg-ens-accent/90 min-w-[120px]"
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
    <div className="flex gap-4 justify-center">
      <Select 
        value={selectedENS}
        onValueChange={value => {
          onENSChange(value);
        }}
      >
        <SelectTrigger className="w-[240px] bg-[#222222] border-[#403E43] text-white">
          <SelectValue placeholder={isLoadingENS ? "Loading ENS names..." : "Select ENS name"} />
        </SelectTrigger>
        <SelectContent className="bg-[#222222] border-[#403E43] w-[240px]">
          <div className="flex items-center px-3 pb-2 pt-1 gap-2 border-b border-[#403E43]">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search ENS names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent focus:ring-0 text-white placeholder:text-gray-400 h-8"
              onKeyDown={(e) => {
                // Prevent the default select behavior when typing
                e.stopPropagation();
              }}
            />
          </div>
          <ScrollArea className="h-[300px]">
            {filteredNames.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-400">
                No ENS names found
              </div>
            ) : (
              filteredNames.map((name) => (
                <SelectItem 
                  key={name} 
                  value={name}
                  className="text-white hover:bg-[#2A2A2A] cursor-pointer"
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
        disabled={isCheckingResolver}
        className="bg-ens-accent hover:bg-ens-accent/90 min-w-[120px]"
      >
        {showProfile ? "Manage Profile" : "Manage Records"}
      </Button>
    </div>
  );
};

export default ENSSelector;
