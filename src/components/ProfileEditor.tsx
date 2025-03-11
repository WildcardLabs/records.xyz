"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileBg } from "@/components/ens/profile-editor/ProfileBg";
import { Avatar } from "@/components/ens/profile-editor/Avatar";
import { ProfileForm } from "@/components/ens/profile-editor/ProfileForm";
import { MoveRight, X, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { Records } from "@/components/ENSRecordsManager";
import RecordChangesModal from "./ens/RecordChangesModal";

export interface FormData {
  firstName: string;
  lastName: string;
  avatarHeaderUsername: string;
  website: string;
  useWebsiteAsRedirect: boolean;
  email: string;
  bio: string;
  socials: {
    x: string;
    farcaster: string;
    github: string;
    discord: string;
    telegram: string;
  };
  addresses: {
    ethereum: string;
    optimism: string;
    base: string;
    arbitrum: string;
    linea: string;
    polygon: string;
  };
}

export interface ProfileEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedENS: string;
  records: Records;
  onRecordChange: (field: string, value: string) => void;
  onSubmit: (records: Record<string, string>) => Promise<void>;
  isBasename?: boolean;
}

const ProfileEditor = ({
  open,
  onOpenChange,
  selectedENS,
  records,
  onRecordChange,
  onSubmit,
  isBasename = false
}: ProfileEditorProps) => {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;
  
  const [changedRecords, setChangedRecords] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>(() => ({
    firstName: records.name?.value?.split(" ")[0] || "",
    lastName: records.name?.value?.split(" ")[1] || "",
    avatarHeaderUsername: "",
    website: records.url?.value || "",
    useWebsiteAsRedirect: !!records.redirect?.value,
    email: records.email?.value || "",
    bio: records.description?.value || "",
    socials: {
      x: records.twitter?.value || "",
      farcaster: records.farcaster?.value || "",
      github: records.github?.value || "",
      discord: records.discord?.value || "",
      telegram: records.telegram?.value || "",
    },
    addresses: {
      ethereum: records.mainnet?.value || "",
      optimism: records.optimism?.value || "",
      base: records.base?.value || "",
      arbitrum: records.arbitrum?.value || "",
      linea: records.linea?.value || "",
      polygon: records.polygon?.value || "",
    },
  }));
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(records.avatar?.value || "");
  const [headerUrl, setHeaderUrl] = useState(records.header?.value || "");
  const [showRecordChanges, setShowRecordChanges] = useState(false);
  // Determine if the selected ENS is a basename
  const isSelectedBasename = isBasename || selectedENS.endsWith('.base.eth');

  useEffect(() => {
    if (open) {
      setFormData({
        firstName: records.name?.value?.split(" ")[0] || "",
        lastName: records.name?.value?.split(" ")[1] || "",
        avatarHeaderUsername: "",
        website: records.url?.value || "",
        useWebsiteAsRedirect: !!records.redirect?.value,
        email: records.email?.value || "",
        bio: records.description?.value || "",
        socials: {
          x: records.twitter?.value || "",
          farcaster: records.farcaster?.value || "",
          github: records.github?.value || "",
          discord: records.discord?.value || "",
          telegram: records.telegram?.value || "",
        },
        addresses: {
          ethereum: records.mainnet?.value || "",
          optimism: records.optimism?.value || "",
          base: records.base?.value || "",
          arbitrum: records.arbitrum?.value || "",
          linea: records.linea?.value || "",
          polygon: records.polygon?.value || "",
        },
      });
      setAvatarUrl(records.avatar?.value || "");
      setHeaderUrl(records.header?.value || "");
      setChangedRecords({});
      setStep(1);
    }
  }, [open, records]);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {  // Only allow closing if not submitting
      setStep(1);
    }
    onOpenChange(open);
  };

  const handleFormChange = useCallback((newData: Partial<FormData>) => {
    console.log('===== Form Change Debug =====');
    console.log('Current formData:', formData);
    console.log('New changes:', newData);
    console.log('Current changedRecords:', changedRecords);
    console.log('Original records:', records);
    
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      const allChanges = { ...changedRecords };
      
      // Name handling
      if ('firstName' in newData || 'lastName' in newData) {
        const newFullName = `${updated.firstName} ${updated.lastName}`.trim();
        const currentName = records.name?.value || '';
        console.log('Name comparison:', { new: newFullName, current: currentName });
        if (newFullName !== currentName) {
          allChanges.name = newFullName;
        } else {
          delete allChanges.name;
        }
      }
      
      // Bio handling
      if ('bio' in newData) {
        const currentBio = records.description?.value || '';
        console.log('Bio comparison:', { new: newData.bio, current: currentBio });
        if (newData.bio !== currentBio) {
          allChanges.description = newData.bio;
        } else {
          delete allChanges.description;
        }
      }
      
      // Website and redirect handling
      if ('website' in newData || 'useWebsiteAsRedirect' in newData) {
        const newWebsite = updated.website;
        const currentWebsite = records.url?.value || '';
        console.log('Website comparison:', { new: newWebsite, current: currentWebsite });
        
        if (newWebsite !== currentWebsite) {
          allChanges.url = newWebsite;
        } else {
          delete allChanges.url;
        }

        // Always include redirect in changes when useWebsiteAsRedirect changes
        if ('useWebsiteAsRedirect' in newData) {
          if (updated.useWebsiteAsRedirect) {
            allChanges.redirect = newWebsite;
          } else {
            allChanges.redirect = '';
          }
        }
      }
      
      // Email handling
      if ('email' in newData) {
        const currentEmail = records.email?.value || '';
        console.log('Email comparison:', { new: newData.email, current: currentEmail });
        if (newData.email !== currentEmail) {
          allChanges.email = newData.email;
        } else {
          delete allChanges.email;
        }
      }
      
      // Socials handling
      if (newData.socials) {
        Object.entries(newData.socials).forEach(([platform, value]) => {
          const recordKey = platform === 'x' ? 'twitter' : platform;
          const currentValue = records[recordKey]?.value || '';
          console.log(`${platform} comparison:`, { new: value, current: currentValue });
          
          if (value !== currentValue) {
            allChanges[recordKey] = value;
          } else {
            delete allChanges[recordKey];
          }
        });
      }
      
      // Addresses handling
      if (newData.addresses) {
        Object.entries(newData.addresses).forEach(([chain, value]) => {
          const recordKey = chain === 'ethereum' ? 'mainnet' : chain;
          const currentValue = records[recordKey]?.value || '';
          console.log(`${chain} comparison:`, { new: value, current: currentValue });
          
          if (value !== currentValue) {
            allChanges[recordKey] = value;
          } else {
            delete allChanges[recordKey];
          }
        });
      }

      console.log('Final changes:', allChanges);
      setChangedRecords(allChanges);
      
      return updated;
    });
  }, [records, changedRecords, formData]);

  const handleAvatarHeaderChange = (username: string) => {
    setFormData(prev => ({ ...prev, avatarHeaderUsername: username }));
  };

  const handleUsernameConfirm = useCallback(() => {
    const username = formData.avatarHeaderUsername;
    if (username) {
      const newAvatarUrl = `https://api.avatar.x.records.xyz/?user=${username}`;
      const newHeaderUrl = `https://api.header.x.records.xyz/?user=${username}`;
      
      if (newAvatarUrl !== records.avatar?.value) {
        setChangedRecords(prev => ({ ...prev, avatar: newAvatarUrl }));
      }
      
      if (newHeaderUrl !== records.header?.value) {
        setChangedRecords(prev => ({ ...prev, header: newHeaderUrl }));
      }
      
      setAvatarUrl(newAvatarUrl);
      setHeaderUrl(newHeaderUrl);
    }
  }, [formData.avatarHeaderUsername, records.avatar?.value, records.header?.value]);

  const handleFormSubmit = async () => {    
    console.log('===== Form Submit Debug =====');
    console.log('Current changedRecords:', changedRecords);
    console.log('Current formData:', formData);
    
    if (Object.keys(changedRecords).length === 0) {
      console.log('No changes to submit');
      return;
    }
    
    // Show record changes modal instead of submitting directly
    setShowRecordChanges(true);
  };

  const handleNetworkSelection = async (chainId: number, chainType: "optimism" | "base") => {
    setIsSubmitting(true);
    try {
      await onSubmit(changedRecords);
      onOpenChange(false);  // Close modal after successful submission
      setShowRecordChanges(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(newOpen) => {
        if (!isSubmitting) {  // Only allow closing if not submitting
          handleOpenChange(newOpen);
        }
      }}>
        <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-lg h-[100vh] sm:h-[90vh]">
          <DialogHeader className="contents space-y-0 text-left">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <DialogTitle className="text-base">Edit profile</DialogTitle>
              <DialogClose 
                className="rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Make changes to your profile here. You can change your photo and set a username.
          </DialogDescription>
          <div className="flex-1 overflow-y-auto">
            <ProfileBg image={headerUrl} />
            <Avatar image={avatarUrl} />
            <div className="px-6 pb-6 pt-4">
              <ProfileForm 
                step={step} 
                formData={formData}
                onFormChange={handleFormChange}
                onAvatarHeaderChange={handleAvatarHeaderChange}
                onUsernameConfirm={handleUsernameConfirm}
              />
            </div>
          </div>
          <DialogFooter className="border-t border-border px-6 py-4">
            {step === 1 ? (
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-[0.5px] border-white text-white bg-transparent hover:bg-white/10"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(step - 1)} 
                className="border-[0.5px] border-white text-white bg-transparent hover:bg-white/10"
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
            {step === TOTAL_STEPS ? (
              <Button 
                type="button" 
                onClick={handleFormSubmit}
                disabled={isSubmitting}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  'Save Profile'
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={() => setStep(step + 1)} 
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                Next
                <MoveRight className="h-4 w-4" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RecordChangesModal
        open={showRecordChanges}
        onOpenChange={setShowRecordChanges}
        isLoading={isSubmitting}
        isProcessing={isSubmitting}
        changedRecords={changedRecords}
        onContinue={handleNetworkSelection}
        isBasename={isSelectedBasename}
        networkType={isSelectedBasename ? "base" : "optimism"}
        selectedENS={selectedENS}
      />
    </>
  );
};

export default ProfileEditor;
