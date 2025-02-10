
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { UserRound, User, Mail, Link } from 'lucide-react';

interface ProfileSectionProps {
  records: {
    name: string;
    bio: string;
    email: string;
    website: string;
    useWebsiteAsRedirect: boolean;
  };
  onRecordChange: (field: string, value: string | boolean) => void;
}

export function ProfileSection({ records, onRecordChange }: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      {[
        { label: 'Name', icon: UserRound, field: 'name', placeholder: 'Your name' },
        { label: 'Bio', icon: User, field: 'bio', placeholder: 'About you' },
        { label: 'Email', icon: Mail, field: 'email', placeholder: 'your@email.com' }
      ].map(({ label, icon: Icon, field, placeholder }) => (
        <div key={field} className="space-y-2">
          <Label className="text-base font-medium flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label}
          </Label>
          <Input
            value={String(records[field as keyof typeof records])}
            onChange={(e) => onRecordChange(field, e.target.value)}
            placeholder={placeholder}
            className="bg-muted/30 text-base border-border/20"
          />
        </div>
      ))}
      
      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Link className="w-4 h-4" />
          Website
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">https://</span>
          <Input
            value={String(records.website).replace('https://', '')}
            onChange={(e) => onRecordChange('website', `https://${e.target.value}`)}
            placeholder="example.com"
            className="bg-muted/30 pl-[4.5rem] text-base border-border/20"
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Toggle
            pressed={records.useWebsiteAsRedirect}
            onPressedChange={(pressed) => onRecordChange('useWebsiteAsRedirect', pressed)}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-base"
          >
            Use as redirect URL
          </Toggle>
        </div>
      </div>
    </div>
  );
}
