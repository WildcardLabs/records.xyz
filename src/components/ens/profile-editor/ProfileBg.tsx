
"use client";

import { ImageOff } from "lucide-react";

interface ProfileBgProps {
  defaultImage?: string;
  image?: string;
}

export function ProfileBg({ defaultImage, image }: ProfileBgProps) {
  return (
    <div className="h-32">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted">
        {(image || defaultImage) ? (
          <img
            className="h-full w-full object-cover"
            src={image || defaultImage}
            alt="Profile background"
            width={512}
            height={96}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted">
            <ImageOff className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
}
