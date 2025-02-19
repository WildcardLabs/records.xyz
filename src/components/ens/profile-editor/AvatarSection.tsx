
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image } from 'lucide-react';
import { useState, useEffect } from 'react';

type SocialPlatform = "" | "x" | "farcaster";

interface AvatarSectionProps {
  records: {
    avatarPlatform: SocialPlatform;
    avatarUsername: string;
    headerPlatform: SocialPlatform;
    headerUsername: string;
  };
  onRecordChange: (field: string, value: string) => void;
  onPlatformChange: (field: string, value: SocialPlatform) => void;
}

interface IconSelectorProps {
  platform: SocialPlatform;
  selectedPlatform: SocialPlatform;
  onSelect: (platform: SocialPlatform) => void;
  showFarcaster?: boolean;
  isAvatar?: boolean;
}

function IconSelector({ 
  platform, 
  selectedPlatform, 
  onSelect,
  showFarcaster = true,
  isAvatar = false
}: IconSelectorProps) {
  const isSelected = platform === selectedPlatform;
  
  if (platform === 'farcaster' && (isAvatar || !showFarcaster)) return null;
  
  return (
    <button
      type="button"
      onClick={() => onSelect(platform)}
      className={`p-2 rounded-lg transition-colors ${
        isSelected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
      }`}
    >
      {platform === 'x' && (
        <img 
          src="/lovable-uploads/7cb3a1e9-1726-4494-a3ca-5121010c09ed.png" 
          alt="X (Twitter)" 
          className="w-5 h-5"
        />
      )}
      {platform === 'farcaster' && (
        <img 
          src="/lovable-uploads/a4e56334-9070-483d-9738-d37c65b864f3.png" 
          alt="Farcaster" 
          className={`w-5 h-5 ${isSelected ? 'invert' : ''}`}
        />
      )}
    </button>
  );
}

export function AvatarSection({ records, onRecordChange, onPlatformChange }: AvatarSectionProps) {
  const [currentInputs, setCurrentInputs] = useState({
    avatarUsername: records.avatarUsername || '',
    headerUsername: records.headerUsername || ''
  });

  // Update current inputs when records change (e.g., after blockchain confirmation)
  useEffect(() => {
    // Only update inputs from records if they are different from what's currently in state
    // and the records have actual values (not empty strings)
    if (records.avatarUsername && records.avatarUsername !== currentInputs.avatarUsername) {
      setCurrentInputs(prev => ({
        ...prev,
        avatarUsername: records.avatarUsername
      }));
    }
    if (records.headerUsername && records.headerUsername !== currentInputs.headerUsername) {
      setCurrentInputs(prev => ({
        ...prev,
        headerUsername: records.headerUsername
      }));
    }
  }, [records.avatarUsername, records.headerUsername]);

  const handleUsernameChange = (field: string, value: string) => {
    setCurrentInputs(prev => ({
      ...prev,
      [field]: value
    }));
    onRecordChange(field, value);
  };

  return (
    <div className="space-y-6">
      {[
        { label: 'Avatar', icon: Camera, platform: 'avatarPlatform', username: 'avatarUsername' },
        { label: 'Header', icon: Image, platform: 'headerPlatform', username: 'headerUsername' }
      ].map(({ label, icon: Icon, platform, username }) => (
        <div key={platform} className="space-y-2">
          <Label className="text-base font-medium flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </Label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <IconSelector
                platform="x"
                selectedPlatform={records[platform as keyof typeof records] as SocialPlatform}
                onSelect={(value) => onPlatformChange(platform, value)}
                isAvatar={label === 'Avatar'}
              />
            </div>
            <div className="flex rounded-lg shadow-sm shadow-black/5">
              <span className="flex items-center -z-10 rounded-s-lg border border-input bg-background px-3 text-sm text-muted-foreground w-[28px]">@</span>
              <Input
                value={currentInputs[username as keyof typeof currentInputs]}
                onChange={(e) => handleUsernameChange(username, e.target.value)}
                placeholder="username"
                className="-ms-px rounded-s-none shadow-none flex-1 bg-muted/30 text-base border-border/20"
                disabled={!records[platform as keyof typeof records]}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
