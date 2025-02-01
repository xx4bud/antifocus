"use client";

import { useState, useEffect } from "react";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PhotoUploadProps {
  value: {
    url: string;
    publicId: string | null;
    position: number;
  }[];
  onChange: (
    newPhotos: {
      url: string;
      publicId: string | null;
      position: number;
    }[]
  ) => void;
  onRemove: (publicId: string) => void;
  onUpload: (result: CloudinaryUploadWidgetResults) => void;
  max: number;
  disabled?: boolean;
  className?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value,
  onChange,
  onRemove,
  onUpload,
  max = 5,
  disabled,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = value.findIndex(
      (photo) => photo.publicId === active.id
    );
    const newIndex = value.findIndex(
      (photo) => photo.publicId === over.id
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedPhotos = arrayMove(
        value,
        oldIndex,
        newIndex
      ).map((photo, index) => ({
        ...photo,
        position: index,
      }));
      onChange(updatedPhotos);
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext
        items={value.map((photo) => photo.publicId!)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-wrap gap-4">
          {value.map((photo) => (
            <div
              key={photo.publicId!}
              className={cn(
                "relative items-center justify-center rounded-lg border-2 border-muted-foreground/50 bg-muted",
                disabled && "opacity-80",
                className
              )}
            >
              <button
                onClick={() =>
                  !disabled && onRemove(photo.publicId!)
                }
                className="absolute right-1 top-1 z-50 aspect-square rounded-full bg-muted-foreground p-1 shadow-sm"
              >
                <X className="size-3 text-background" />
              </button>
              <SortablePhoto
                photo={photo}
                disabled={disabled}
                className={className}
              />
            </div>
          ))}
          {value.length < max && (
            <CldUploadButton
              onSuccess={onUpload}
              uploadPreset={
                process.env
                  .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                "antifocus_preset"
              }
              signatureEndpoint="/api/cloudinary"
              options={{
                multiple: true,
                folder: "antifocus",
                resourceType: "image",
                maxFiles: max - value.length,
              }}
              className={cn(
                "relative flex h-[98px] w-[98px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted",
                disabled && "opacity-80",
                className
              )}
            >
              <ImagePlus
                className={cn(
                  "size-10 text-muted-foreground",
                  disabled && "opacity-80"
                )}
              />
            </CldUploadButton>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
};

interface SortablePhotoProps {
  photo: {
    url: string;
    publicId: string | null;
    position: number;
  };
  disabled?: boolean;
  className?: string;
}

function SortablePhoto({
  photo,
  disabled,
  className,
}: SortablePhotoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: photo.publicId!,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative flex h-[98px] w-[98px] cursor-grab items-center justify-center overflow-hidden rounded-lg bg-background",
        disabled && "opacity-80",
        className
      )}
    >
      <Image
        src={photo.url!}
        alt={photo.publicId!}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="relative h-full w-full object-cover"
      />
    </div>
  );
}
