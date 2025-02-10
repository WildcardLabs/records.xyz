
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image } from 'lucide-react';

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
                isAvatar={true}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">@</span>
              <Input
                value={String(records[username as keyof typeof records]).replace('@', '')}
                onChange={(e) => onRecordChange(username, `@${e.target.value}`)}
                placeholder="username"
                className="bg-muted/30 pl-8 text-base border-border/20"
                disabled={!records[platform as keyof typeof records]}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
