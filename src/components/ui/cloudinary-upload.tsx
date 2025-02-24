"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { MediaValue } from "@/lib/schemas";

interface CloudinaryUploadProps {
  value: MediaValue[];
  onChange: (newMedia: MediaValue[]) => void;
  onRemove: (publicId: string) => void;
  onUpload: (result: CloudinaryUploadWidgetResults) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  allowedFormats?: string[];
  maxFileSize?: number;
  folder?: string;
  multiple?: boolean;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  value,
  onChange,
  onRemove,
  onUpload,
  max = 5,
  disabled,
  className,
  resourceType = "image",
  allowedFormats = ["webp", "png", "jpeg", "jpg"],
  maxFileSize = 10000000, // 10MB default
  folder = "antifocus",
  multiple = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = value.findIndex(
        (media) => media.publicId === active.id
      );
      const newIndex = value.findIndex(
        (media) => media.publicId === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedMedia = arrayMove(
          value,
          oldIndex,
          newIndex
        ).map((media, index) => ({
          ...media,
          order: index,
          width: media.width || 0,
          height: media.height || 0,
          size: media.size || 0,
          metadata: media.metadata || undefined
        }));
        onChange(updatedMedia);
      }
    },
    [value, onChange]
  );

  if (!isMounted) return null;

  const formatInfo = {
    formats: allowedFormats.join(", "),
    maxSize: `${(maxFileSize / 1024 / 1024).toFixed(0)}MB`,
  };

  return (
    <div className="space-y-4">
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={(value || [])
            .filter((media) => media && media.publicId)
            .map((media) => media.publicId!)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {value.map((media, index) => (
              <SortableMedia
                key={media.publicId || `temp-${index}`}
                media={media}
                onRemove={onRemove}
                disabled={disabled}
                className={className}
              />
            ))}
            {value.length < max && (
              <CldUploadButton
                onSuccess={onUpload}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                signatureEndpoint="/api/cloudinary"
                options={{
                  multiple,
                  folder,
                  maxFiles: max - value.length,
                  resourceType,
                  clientAllowedFormats: allowedFormats,
                  maxFileSize,
                }}
                className={cn(
                  "relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/5 p-4 text-center",
                  disabled && "cursor-not-allowed opacity-60",
                  className
                )}
              >
                <ImagePlus className="size-10 text-muted-foreground transition-transform" />
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">
                    Upload {formatInfo.formats.toUpperCase()} ({value.length}/{max})
                  </span>
                  <br />
                  Max: {formatInfo.maxSize}
                </div>
              </CldUploadButton>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

interface SortableMediaProps {
  media: MediaValue;
  onRemove: (publicId: string) => void;
  disabled?: boolean;
  className?: string;
}

const SortableMedia = ({
  media,
  onRemove,
  disabled,
  className,
}: SortableMediaProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: media.publicId!,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg border bg-muted/10",
        disabled && "opacity-60",
        className
      )}
    >
      <button
        type="button"
        onClick={() =>
          !disabled && onRemove(media.publicId!)
        }
        className="absolute right-2 top-2 z-50 rounded-full bg-destructive p-1.5 opacity-0 shadow-lg transition-all hover:scale-110 group-hover:opacity-100"
        disabled={disabled}
      >
        <X className="size-3.5 text-destructive-foreground" />
      </button>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "relative flex h-full w-full cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing",
          disabled && "cursor-not-allowed",
          className
        )}
      >
        <Image
          src={media.url || "/placeholder.svg"}
          alt={media.alt || `Media ${media.order + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
};
