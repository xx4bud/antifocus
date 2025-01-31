// photo-reorder.tsx
"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PhotoUpload } from "@/components/ui/photo-upload-old"; // Sesuaikan path komponen PhotoUpload
import { useFormContext } from "react-hook-form";

interface Photo {
  url: string;
  publicId: string | null;
  position: number;
}

interface PhotoReorderProps {
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  handleRemovePhoto: (publicId: string) => void; // Pass the remove handler here
}

export function PhotoReorder({ photos, setPhotos, handleRemovePhoto }: PhotoReorderProps) {
  const { setValue, trigger } = useFormContext();

  // Fungsi untuk menangani drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = photos.findIndex((photo) => photo.publicId === active.id);
    const newIndex = photos.findIndex((photo) => photo.publicId === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedPhotos = arrayMove(photos, oldIndex, newIndex).map(
        (photo, index) => ({
          ...photo,
          position: index + 1, // Set posisi baru berdasarkan urutan
        })
      );

      setPhotos(updatedPhotos);
      setValue("photos", updatedPhotos);
      trigger("photos");
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={photos?.map((photo) => photo.publicId!)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {photos?.map((photo) => (
            <SortablePhoto
              key={photo.publicId!}
              photo={photo}
              onRemove={handleRemovePhoto} // Pass the remove handler
              disabled={false}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

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
      <PhotoUpload
        value={[photo]}
        _onChange={() => {}} // Tidak digunakan di sini
        onRemove={onRemove}
        onUpload={() => {}} // Tidak digunakan di sini
        max={1} // Set max ke 1 karena ini hanya satu foto
        disabled={disabled}
      />
    </div>
  );
}
