"use client";

import { IconCheck, IconPhoto, IconTrash } from "@tabler/icons-react";
import { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { LoadingButton } from "~/components/ui/loading-button";
import { toast } from "~/components/ui/sonner";
import { updateProfile } from "~/features/auth/actions/update-profile";
import { useRouter } from "~/i18n/navigation";

interface AvatarUploadDialogProps {
  currentImage: string | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  userName: string;
}

export function AvatarUploadDialog({
  currentImage,
  onOpenChange,
  open,
  userName,
}: AvatarUploadDialogProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const displayImage = preview ?? currentImage;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedFile) {
      return;
    }

    startTransition(async () => {
      // 1. Upload file to server
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        toast.error(err.error || "Gagal mengunggah gambar");
        return;
      }

      const { url } = await uploadRes.json();

      // 2. Save URL to user profile
      const result = await updateProfile("image", url);

      if (result.success) {
        toast.success("Foto profil berhasil diubah");
        resetState();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error.message);
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await updateProfile("image", "");

      if (result.success) {
        toast.success("Foto profil dihapus");
        resetState();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error.message);
      }
    });
  };

  const resetState = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Foto Profil</DialogTitle>
          <DialogDescription>
            Pilih gambar dari perangkat Anda (maks 2MB)
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="size-28 ring-2 ring-border ring-offset-2 ring-offset-background">
            <AvatarImage alt={userName} src={displayImage || undefined} />
            <AvatarFallback className="text-4xl">
              {userName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <input
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />

          <Button
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            <IconPhoto className="mr-1.5 size-4" />
            Pilih Foto
          </Button>
        </div>

        <DialogFooter className="gap-2">
          {currentImage && (
            <Button
              disabled={isPending}
              onClick={handleRemove}
              variant="destructive"
            >
              <IconTrash className="mr-1 size-4" />
              Hapus
            </Button>
          )}
          <LoadingButton
            disabled={!selectedFile}
            loading={isPending}
            onClick={handleSave}
          >
            <IconCheck className="mr-1 size-4" />
            Simpan
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
