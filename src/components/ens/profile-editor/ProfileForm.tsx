"use client";

import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useId } from "react";
import { Github, Send } from "lucide-react";
import { FormData } from "@/components/ProfileEditor";
import { useEffect } from "react";
import { socialLogos } from "@/constants/socials";

interface ProfileFormProps {
  step: number;
  formData: FormData;
  onFormChange: (data: Partial<FormData>) => void;
  onAvatarHeaderChange?: (username: string) => void;
  onUsernameConfirm?: () => void;
}

export function ProfileForm({ step, formData, onFormChange, onAvatarHeaderChange, onUsernameConfirm }: ProfileFormProps) {
  const id = useId();
  const maxLength = 180;
  const {
    value: bioValue,
    characterCount,
    handleChange: handleBioChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue: formData.bio,
  });

  useEffect(() => {
    handleBioChange({ target: { value: formData.bio || "" } } as React.ChangeEvent<HTMLTextAreaElement>);
  }, [formData.bio, handleBioChange]);

  const handleAvatarHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAvatarHeaderChange) {
      const username = e.target.value.replace(/^x\.com\//, '');
      onAvatarHeaderChange(username);
    }
  };

  const handleWebsiteRedirectChange = (value: string) => {
    const isRedirect = value === "redirect";
    // If enabling redirect, ensure website is included in the update
    if (isRedirect && !formData.website) {
      return; // Don't allow enabling redirect without a website
    }
    onFormChange({ useWebsiteAsRedirect: isRedirect });
  };

  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Label htmlFor={`${id}-first-name`}>First name</Label>
            <Input
              id={`${id}-first-name`}
              placeholder="Matt"
              type="text"
              value={formData?.firstName || ""}
              onChange={(e) => onFormChange({ firstName: e.target.value })}
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor={`${id}-last-name`}>Last name</Label>
            <Input
              id={`${id}-last-name`}
              placeholder="Welsh"
              type="text"
              value={formData?.lastName || ""}
              onChange={(e) => onFormChange({ lastName: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-avatar-header`}>Avatar & Header</Label>
          <div className="flex rounded-lg shadow-sm shadow-black/5">
            <span className="-z-10 inline-flex items-center rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground">
              x.com/
            </span>
            <Input
              id={`${id}-avatar-header`}
              className="-ms-px rounded-s-none shadow-none"
              placeholder="username"
              type="text"
              value={formData?.avatarHeaderUsername || ""}
              onChange={handleAvatarHeaderChange}
              onBlur={onUsernameConfirm}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-website`}>Website</Label>
          <Input
            id={`${id}-website`}
            placeholder="https://yourwebsite.com"
            type="text"
            value={formData?.website || ""}
            onChange={(e) => {
              onFormChange({ website: e.target.value });
              // If website is cleared and redirect is enabled, disable redirect
              if (!e.target.value && formData.useWebsiteAsRedirect) {
                onFormChange({ useWebsiteAsRedirect: false });
              }
            }}
          />
          <RadioGroup 
            value={formData?.useWebsiteAsRedirect ? "redirect" : "no-redirect"}
            onValueChange={handleWebsiteRedirectChange}
            className="mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no-redirect"
                id={`${id}-no-redirect`}
                className="h-3.5 w-3.5 border-muted-foreground"
              />
              <label
                htmlFor={`${id}-no-redirect`}
                className="text-xs text-muted-foreground leading-none"
              >
                No redirect
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="redirect"
                id={`${id}-redirect`}
                className="h-3.5 w-3.5 border-muted-foreground"
                disabled={!formData.website}
              />
              <label
                htmlFor={`${id}-redirect`}
                className="text-xs text-muted-foreground leading-none"
              >
                Use as redirect record
              </label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-email`}>Email</Label>
          <Input
            id={`${id}-email`}
            placeholder="you@example.com"
            type="email"
            value={formData?.email || ""}
            onChange={(e) => onFormChange({ email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-bio`}>Biography</Label>
          <Textarea
            id={`${id}-bio`}
            placeholder="Write a few sentences about yourself"
            maxLength={maxLength}
            onChange={(e) => {
              handleBioChange(e);
              onFormChange({ bio: e.target.value });
            }}
            value={bioValue}
            aria-describedby={`${id}-description`}
          />
          <p
            id={`${id}-description`}
            className="mt-2 text-right text-xs text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            <span className="tabular-nums">{limit - characterCount}</span> characters left
          </p>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          <Label className="text-base">Socials</Label>
          
          <div className="flex rounded-lg shadow-sm shadow-black/5">
            <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[42px]">
              <img 
                src={socialLogos.x}
                alt="X (Twitter)" 
                className="w-4 h-4"
              />
            </span>
            <Input
              placeholder="@X"
              type="text"
              value={formData?.socials?.x || ""}
              onChange={(e) => onFormChange({ socials: { ...formData.socials, x: e.target.value } })}
              className="-ms-px rounded-s-none shadow-none flex-1"
            />
          </div>

          <div className="flex rounded-lg shadow-sm shadow-black/5">
            <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[42px]">
              <img 
                src={socialLogos.farcaster}
                alt="Farcaster" 
                className="w-4 h-4"
              />
            </span>
            <Input
              placeholder="@Farcaster"
              type="text"
              value={formData?.socials?.farcaster || ""}
              onChange={(e) => onFormChange({ socials: { ...formData.socials, farcaster: e.target.value } })}
              className="-ms-px rounded-s-none shadow-none flex-1"
            />
          </div>

          <div className="flex rounded-lg shadow-sm shadow-black/5">
            <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[42px]">
              <Github className="w-4 h-4" />
            </span>
            <Input
              placeholder="@GitHub"
              type="text"
              value={formData?.socials?.github || ""}
              onChange={(e) => onFormChange({ socials: { ...formData.socials, github: e.target.value } })}
              className="-ms-px rounded-s-none shadow-none flex-1"
            />
          </div>

          <div className="flex rounded-lg shadow-sm shadow-black/5">
            <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[42px]">
              <img 
                src={socialLogos.discord}
                alt="Discord" 
                className="w-4 h-4"
              />
            </span>
            <Input
              placeholder="@Discord"
              type="text"
              value={formData?.socials?.discord || ""}
              onChange={(e) => onFormChange({ socials: { ...formData.socials, discord: e.target.value } })}
              className="-ms-px rounded-s-none shadow-none flex-1"
            />
          </div>

          <div className="flex rounded-lg shadow-sm shadow-black/5">
            <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[42px]">
              <Send className="w-4 h-4" />
            </span>
            <Input
              placeholder="@Telegram"
              type="text"
              value={formData?.socials?.telegram || ""}
              onChange={(e) => onFormChange({ socials: { ...formData.socials, telegram: e.target.value } })}
              className="-ms-px rounded-s-none shadow-none flex-1"
            />
          </div>
        </div>
      </div>
    );
  }

  // Step 3
  return (
    <div className="space-y-4">
      <Label className="text-base">Addresses</Label>
      <div className="space-y-4">
        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[100px]">Ethereum</span>
          <Input
            placeholder="0x..."
            type="text"
            value={formData?.addresses?.ethereum || ""}
            onChange={(e) => onFormChange({ addresses: { ...formData.addresses, ethereum: e.target.value } })}
            className="-ms-px rounded-s-none shadow-none flex-1"
          />
        </div>

        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[100px]">Optimism</span>
          <Input
            placeholder="0x..."
            type="text"
            value={formData?.addresses?.optimism || ""}
            onChange={(e) => onFormChange({ addresses: { ...formData.addresses, optimism: e.target.value } })}
            className="-ms-px rounded-s-none shadow-none flex-1"
          />
        </div>

        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[100px]">Base</span>
          <Input
            placeholder="0x..."
            type="text"
            value={formData?.addresses?.base || ""}
            onChange={(e) => onFormChange({ addresses: { ...formData.addresses, base: e.target.value } })}
            className="-ms-px rounded-s-none shadow-none flex-1"
          />
        </div>

        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[100px]">Arbitrum</span>
          <Input
            placeholder="0x..."
            type="text"
            value={formData?.addresses?.arbitrum || ""}
            onChange={(e) => onFormChange({ addresses: { ...formData.addresses, arbitrum: e.target.value } })}
            className="-ms-px rounded-s-none shadow-none flex-1"
          />
        </div>

        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[100px]">Linea</span>
          <Input
            placeholder="0x..."
            type="text"
            value={formData?.addresses?.linea || ""}
            onChange={(e) => onFormChange({ addresses: { ...formData.addresses, linea: e.target.value } })}
            className="-ms-px rounded-s-none shadow-none flex-1"
          />
        </div>

        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <span className="flex items-center -z-10 rounded-s-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground w-[100px]">Polygon</span>
          <Input
            placeholder="0x..."
            type="text"
            value={formData?.addresses?.polygon || ""}
            onChange={(e) => onFormChange({ addresses: { ...formData.addresses, polygon: e.target.value } })}
            className="-ms-px rounded-s-none shadow-none flex-1"
          />
        </div>
      </div>
    </div>
  );
}
