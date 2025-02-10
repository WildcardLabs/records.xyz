
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Github } from 'lucide-react';

interface SocialsSectionProps {
  records: {
    x: string;
    farcaster: string;
    github: string;
    discord: string;
    telegram: string;
  };
  onRecordChange: (field: string, value: string) => void;
}

export function SocialsSection({ records, onRecordChange }: SocialsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium flex items-center gap-2 mb-2">
          <img 
            src="/lovable-uploads/7cb3a1e9-1726-4494-a3ca-5121010c09ed.png" 
            alt="X (Twitter)" 
            className="w-4 h-4"
          />
          X (Twitter)
        </Label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1DA1F2]/5 to-transparent rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">@</span>
            <Input
              value={String(records.x).replace('@', '')}
              onChange={(e) => onRecordChange('x', `@${e.target.value}`)}
              placeholder="username"
              className="bg-muted/30 pl-8 pr-24 text-base border-border/20 group-hover:border-[#1DA1F2]/30 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none select-none">
              <span className="text-sm text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                twitter.com/
              </span>
            </div>
          </div>
        </div>
      </div>

      {[
        { label: 'Farcaster', icon: "/lovable-uploads/a4e56334-9070-483d-9738-d37c65b864f3.png", field: 'farcaster' },
        { label: 'GitHub', icon: Github, field: 'github' },
        { label: 'Discord', icon: MessageSquare, field: 'discord', noAt: true },
        { label: 'Telegram', icon: Send, field: 'telegram' }
      ].map(({ label, icon: Icon, field, noAt }) => (
        <div key={field} className="space-y-2">
          <Label className="text-base font-medium flex items-center gap-2">
            {typeof Icon === 'string' ? (
              <img src={Icon} alt={label} className="w-4 h-4" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            {label}
          </Label>
          <div className="relative">
            {!noAt && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">@</span>
            )}
            <Input
              value={noAt ? String(records[field as keyof typeof records]) : String(records[field as keyof typeof records]).replace('@', '')}
              onChange={(e) => onRecordChange(field, noAt ? e.target.value : `@${e.target.value}`)}
              placeholder={noAt ? "username#0000" : "username"}
              className={`bg-muted/30 text-base border-border/20 ${!noAt ? "pl-8" : ""}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
