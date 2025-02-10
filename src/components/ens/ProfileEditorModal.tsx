
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { User, Globe, Image as ImageIcon, AtSign, X, Save } from 'lucide-react';

import { ProfileSection } from "./profile-editor/ProfileSection";
import { AddressesSection } from "./profile-editor/AddressesSection";
import { AvatarSection } from "./profile-editor/AvatarSection";
import { SocialsSection } from "./profile-editor/SocialsSection";

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

interface ProfileEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedENS: string;
  records: Records;
  onRecordChange: (field: keyof Records, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileEditorModal = ({
  open,
  onOpenChange,
  selectedENS,
  records,
  onRecordChange,
  onSubmit,
}: ProfileEditorModalProps) => {
  const isMobile = useIsMobile();

  const handlePlatformChange = (field: keyof Records, value: SocialPlatform) => {
    onRecordChange(field, value);
    if (value === "") {
      onRecordChange(field === 'avatarPlatform' ? 'avatarUsername' : 'headerUsername', "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-background",
        isMobile 
          ? "w-full h-[100dvh] m-0 rounded-none p-0" 
          : "w-full max-w-2xl h-[90vh] max-h-[900px] rounded-lg p-0"
      )}>
        <DialogTitle className="sr-only">
          Edit ENS Profile - {selectedENS}
        </DialogTitle>
        
        <Tabs defaultValue="profile" className="flex flex-col h-full">
          <div className="sticky top-0 z-[60] bg-background/80 backdrop-blur-sm border-b border-border/20">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 aspect-square">
                  <img 
                    src="/lovable-uploads/f61517ed-4ad5-4348-8d8f-b83267687161.png" 
                    alt="ENS Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-medium">{selectedENS}</span>
              </div>
              <DialogPrimitive.Close className="rounded-full bg-muted p-2 opacity-70 hover:opacity-100 hover:bg-muted/80 flex items-center justify-center transition-colors">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            {isMobile && (
              <div className="px-4 py-2">
                <TabsList className="w-full h-auto bg-muted/30 p-1 grid grid-cols-4 gap-1">
                  {[
                    { value: 'profile', icon: User },
                    { value: 'addresses', icon: Globe },
                    { value: 'avatar', icon: ImageIcon },
                    { value: 'socials', icon: AtSign }
                  ].map(({ value, icon: Icon }) => (
                    <TabsTrigger 
                      key={value}
                      value={value} 
                      className="p-2.5 data-[state=active]:bg-background rounded-md"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only capitalize">{value}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            )}
          </div>

          <div className="flex flex-1 overflow-hidden">
            {!isMobile && (
              <div className="w-[200px] border-r border-border/20 p-2 space-y-1">
                <TabsList className="flex flex-col h-auto bg-transparent p-0 w-full">
                  {[
                    { value: 'profile', icon: User, label: 'Profile' },
                    { value: 'addresses', icon: Globe, label: 'Addresses' },
                    { value: 'avatar', icon: ImageIcon, label: 'Avatar' },
                    { value: 'socials', icon: AtSign, label: 'Socials' }
                  ].map(({ value, icon: Icon, label }) => (
                    <TabsTrigger 
                      key={value}
                      value={value} 
                      className="w-full px-3 py-2 text-base justify-start gap-3 data-[state=active]:bg-muted/50 rounded-lg transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            )}

            <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  <TabsContent value="profile" className="mt-0">
                    <ProfileSection records={records} onRecordChange={onRecordChange} />
                  </TabsContent>

                  <TabsContent value="addresses" className="mt-0">
                    <AddressesSection records={records} onRecordChange={onRecordChange} />
                  </TabsContent>

                  <TabsContent value="avatar" className="mt-0">
                    <AvatarSection 
                      records={records} 
                      onRecordChange={onRecordChange}
                      onPlatformChange={handlePlatformChange}
                    />
                  </TabsContent>

                  <TabsContent value="socials" className="mt-0">
                    <SocialsSection records={records} onRecordChange={onRecordChange} />
                  </TabsContent>
                </div>
              </div>

              <div className={cn(
                "bg-background/80 backdrop-blur-sm border-t border-border/20 p-4",
                isMobile && "fixed bottom-0 left-0 right-0"
              )}>
                <Button 
                  type="submit"
                  className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-base"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditorModal;
