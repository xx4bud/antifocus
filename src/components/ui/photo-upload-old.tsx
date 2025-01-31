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

interface Photo {
  url: string;
  publicId: string | null;
  position: number;
}

interface PhotoUploadProps {
  value: Photo[];
  _onChange: (newPhotos: Photo[]) => void;
  onRemove: (publicId: string) => void;
  onUpload: (result: CloudinaryUploadWidgetResults) => void;
  max: number;
  disabled?: boolean;
  className?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value,
  _onChange,
  onRemove,
  onUpload,
  max,
  disabled,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Fungsi untuk menangani drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = value.findIndex((photo) => photo.publicId === active.id);
    const newIndex = value.findIndex((photo) => photo.publicId === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedPhotos = arrayMove(value, oldIndex, newIndex).map(
        (photo, index) => ({
          ...photo,
          position: index + 1, // Set posisi baru berdasarkan urutan
        })
      );

      _onChange(updatedPhotos); // Update photos
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={value.map((photo) => photo.publicId!)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-wrap gap-4">
          {value.map((photo) => (
            <SortablePhoto
              key={photo.publicId!}
              photo={photo}
              onRemove={onRemove}
              disabled={disabled}
            />
          ))}

          {/* Allow uploading only if there is space */}
          {value.length < max && (
            <CldUploadButton
              onSuccess={(result) => {
                onUpload(result);
            
              }}
              uploadPreset={
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "antifocus_preset"
              }
              signatureEndpoint="/api/cloudinary"
              options={{
                multiple: true,
                folder: "antifocus",
                resourceType: "image",
                maxFiles: max - value.length,
              }}
              className={cn(
                "relative flex h-[98px] w-[98px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 hover:opacity-90",
                className
              )}
            >
              <ImagePlus className="size-10 text-muted-foreground hover:opacity-90" />
            </CldUploadButton>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
};

function SortablePhoto({
  photo,
  onRemove,
  disabled,
}: {
  photo: Photo;
  onRemove: (publicId: string) => void;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: photo.publicId!,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
      <div
        className={cn(
          "relative flex h-[98px] w-[98px] items-center justify-center overflow-hidden rounded-lg border-2 border-muted-foreground/50",
          disabled && "opacity-50"
        )}
      >
        <div className="absolute right-2 top-2 z-10">
          <button
            className="rounded-lg bg-primary p-2 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
              if (!disabled) {
                onRemove(photo.publicId!);
              }
            }}
            disabled={disabled}
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
    </div>
  );
}
