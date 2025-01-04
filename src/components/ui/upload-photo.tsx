"use client";

import { useEffect, useState } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UploadPhotoProps {
  value: { url: string; publicId: string }[];
  onChange: (
    newPhotos: { url: string; publicId: string }[]
  ) => void;
  onRemove: (publicId: string) => void;
  onUpload: (result: CloudinaryUploadWidgetResults) => void;
  max: number;
  disabled?: boolean;
  className?: string;
}

export const UploadPhoto: React.FC<UploadPhotoProps> = ({
  value,
  onChange,
  onRemove,
  onUpload,
  max,
  disabled,
  className,
}) => {

  return (
    <div className="flex flex-wrap gap-4">
      {value.map((photo) => (
        <div
          key={photo.publicId}
          className={cn(
            "relative flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-lg border-2 border-muted-foreground/50",
            className
          )}
        >
          <div className="absolute right-2 top-2 z-10">
            <button
              className="rounded-lg bg-primary p-2"
              onClick={(e) => {
                e.preventDefault();
                if (!disabled) {
                  onRemove(photo.publicId);
                }
              }}
            >
              <X className="h-4 w-4 text-secondary" />
            </button>
          </div>
          <Image
            src={photo.url}
            alt="Product Image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Allow uploading only if there is space */}
      {value.length < max && (
        <CldUploadWidget
          onSuccess={onUpload}
          uploadPreset={
            process.env
              .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
          }
          signatureEndpoint="/api/cloudinary"
          options={{
            multiple: true,
            folder: "antifocus",
            resourceType: "image",
            maxFiles: max - value.length,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => !disabled && open()}
              disabled={disabled}
              className={cn(
                "relative flex h-[150px] w-[150px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 hover:opacity-90",
                className
              )}
            >
              <ImagePlus className="size-10 text-muted-foreground hover:opacity-90" />
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
};
