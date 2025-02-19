
"use client";

import { ImageOff } from "lucide-react";

interface AvatarProps {
  defaultImage?: string;
  image?: string;
}

export function Avatar({ defaultImage, image }: AvatarProps) {
  return (
    <div className="-mt-10 px-6">
      <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10">
        {(image || defaultImage) ? (
          <img
            src={image || defaultImage}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        ) : (
          <ImageOff className="h-6 w-6 text-muted-foreground opacity-50" />
        )}
      </div>
    </div>
  );
}
