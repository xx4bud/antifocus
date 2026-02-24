"use client";

import {
  IconCamera,
  IconCheck,
  IconMail,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ConfirmModal } from "~/components/ui/confirm-modal";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/components/ui/sonner";
import { changeEmail } from "~/features/user/actions/change-email";
import { updateProfile } from "~/features/user/actions/update-profile";
import { useRouter } from "~/i18n/navigation";
import type { User } from "~/lib/db/types";
import { AvatarUploadDialog } from "./avatar-upload-dialog";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <AvatarSection user={user} />
      <InfoSection user={user} />
    </div>
  );
}

// ==============================
// AVATAR SECTION
// ==============================

function AvatarSection({ user }: { user: User }) {
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto Profil</CardTitle>
        <CardDescription>
          Foto akan ditampilkan di profil dan komentar Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage alt={user.name} src={user.image || undefined} />
              <AvatarFallback className="text-2xl">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              onClick={() => setAvatarDialogOpen(true)}
              type="button"
            >
              <IconCamera className="size-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
            <Button
              className="mt-1 h-8"
              onClick={() => setAvatarDialogOpen(true)}
              size="sm"
              variant="outline"
            >
              Ubah Foto
            </Button>
          </div>
        </div>
      </CardContent>
      <AvatarUploadDialog
        currentImage={user.image ?? null}
        onOpenChange={setAvatarDialogOpen}
        open={avatarDialogOpen}
        userName={user.name}
      />
    </Card>
  );
}

// ==============================
// INFO SECTION
// ==============================

function InfoSection({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Pribadi</CardTitle>
        <CardDescription>Kelola informasi profil Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-0">
        <EditableField field="name" label="Nama Lengkap" value={user.name} />

        <Separator />

        <EditableField
          field="username"
          label="Username"
          value={user.username ?? ""}
        />

        <Separator />

        <EditableEmailField email={user.email} verified={user.emailVerified} />

        <Separator />

        <EditableField
          field="phoneNumber"
          label="Telepon"
          value={user.phoneNumber ?? ""}
        />
      </CardContent>
    </Card>
  );
}

// ==============================
// EDITABLE FIELD
// ==============================

interface EditableFieldProps {
  field: "name" | "username" | "phoneNumber";
  label: string;
  value: string;
}

function EditableField({ field, label, value }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = useCallback(() => {
    setEditing(false);
    setInputValue(value);
  }, [value]);

  const handleSave = useCallback(() => {
    if (inputValue.trim() === value) {
      setEditing(false);
      return;
    }
    setConfirmOpen(true);
  }, [inputValue, value]);

  const handleConfirm = useCallback(() => {
    startTransition(async () => {
      const result = await updateProfile(field, inputValue.trim());

      if (result.success) {
        const messages: Record<string, string> = {
          name: "Nama berhasil diubah",
          username: "Username berhasil diubah",
          phoneNumber: "Nomor telepon berhasil diubah",
        };
        toast.success(messages[field]);
        setEditing(false);
        setConfirmOpen(false);
        router.refresh();
      } else {
        toast.error(result.error.message);
        setConfirmOpen(false);
      }
    });
  }, [field, inputValue, router]);

  if (editing) {
    return (
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex-1 space-y-1.5">
          <Label className="text-muted-foreground text-xs">{label}</Label>
          <Input
            autoFocus
            disabled={isPending}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
            value={inputValue}
          />
        </div>
        <div className="flex gap-1 pt-5">
          <Button
            disabled={isPending}
            onClick={handleSave}
            size="icon"
            variant="ghost"
          >
            <IconCheck className="size-4 text-green-600" />
          </Button>
          <Button
            disabled={isPending}
            onClick={handleCancel}
            size="icon"
            variant="ghost"
          >
            <IconX className="size-4 text-destructive" />
          </Button>
        </div>
        <ConfirmModal
          confirmText="Simpan"
          description={`Apakah Anda yakin ingin mengubah ${label.toLowerCase()}?`}
          onConfirm={handleConfirm}
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          title={`Ubah ${label}`}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-0.5">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-medium text-sm">{value || "—"}</p>
      </div>
      <Button onClick={() => setEditing(true)} size="sm" variant="ghost">
        <IconPencil className="mr-1 size-3.5" />
        Ubah
      </Button>
    </div>
  );
}

// ==============================
// EDITABLE EMAIL FIELD
// ==============================

interface EditableEmailFieldProps {
  email: string;
  verified: boolean;
}

function EditableEmailField({ email, verified }: EditableEmailFieldProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(email);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = useCallback(() => {
    setEditing(false);
    setInputValue(email);
  }, [email]);

  const handleSave = useCallback(() => {
    if (inputValue.trim() === email) {
      setEditing(false);
      return;
    }
    setConfirmOpen(true);
  }, [inputValue, email]);

  const handleConfirm = useCallback(() => {
    startTransition(async () => {
      const result = await changeEmail(inputValue.trim());

      if (result.success) {
        toast.success("Email verifikasi telah dikirim ke alamat baru");
        setEditing(false);
        setConfirmOpen(false);
        router.refresh();
      } else {
        toast.error(result.error.message);
        setConfirmOpen(false);
      }
    });
  }, [inputValue, router]);

  if (editing) {
    return (
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex-1 space-y-1.5">
          <Label className="text-muted-foreground text-xs">Email</Label>
          <Input
            autoFocus
            disabled={isPending}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
            type="email"
            value={inputValue}
          />
          <p className="text-muted-foreground text-xs">
            Email verifikasi akan dikirim ke alamat baru
          </p>
        </div>
        <div className="flex gap-1 pt-5">
          <Button
            disabled={isPending}
            onClick={handleSave}
            size="icon"
            variant="ghost"
          >
            <IconCheck className="size-4 text-green-600" />
          </Button>
          <Button
            disabled={isPending}
            onClick={handleCancel}
            size="icon"
            variant="ghost"
          >
            <IconX className="size-4 text-destructive" />
          </Button>
        </div>
        <ConfirmModal
          confirmText="Kirim Verifikasi"
          description="Email verifikasi akan dikirim ke alamat baru. Perubahan email akan berlaku setelah Anda memverifikasi alamat baru."
          onConfirm={handleConfirm}
          onOpenChange={setConfirmOpen}
          open={confirmOpen}
          title="Ubah Email"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-0.5">
        <p className="text-muted-foreground text-xs">Email</p>
        <div className="flex items-center gap-2">
          <IconMail className="size-4 text-muted-foreground" />
          <p className="font-medium text-sm">{email}</p>
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">
              <IconCheck className="size-3" />
              Terverifikasi
            </span>
          )}
        </div>
      </div>
      <Button onClick={() => setEditing(true)} size="sm" variant="ghost">
        <IconPencil className="mr-1 size-3.5" />
        Ubah
      </Button>
    </div>
  );
}
