"use client";

import { IconKey, IconLink } from "@tabler/icons-react";
import Image from "next/image";
import { useTransition } from "react";
import { useAppForm } from "~/components/forms/form-hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FieldGroup } from "~/components/ui/field";
import { LoadingButton } from "~/components/ui/loading-button";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/components/ui/sonner";
import { changePassword } from "~/features/auth/actions/change-password";
import { changePasswordInput } from "~/features/auth/validators/change-password";
import type { User } from "~/lib/db/types";

interface SecurityFormProps {
  user: User;
}

export function SecurityForm({ user }: SecurityFormProps) {
  return (
    <div className="space-y-6">
      <ChangePasswordCard />
      <LinkedAccountsCard user={user} />
    </div>
  );
}

// ==============================
// CHANGE PASSWORD
// ==============================

function ChangePasswordCard() {
  const [isPending, startTransition] = useTransition();

  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validators: {
      onChange: changePasswordInput,
    },

    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const result = await changePassword(value);

        if (result.success) {
          toast.success("Kata sandi berhasil diubah");
          form.reset();
          return;
        }

        toast.error(result.error.message);
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconKey className="size-5 text-muted-foreground" />
          <div>
            <CardTitle>Ubah Kata Sandi</CardTitle>
            <CardDescription>
              Pastikan akun Anda tetap aman dengan kata sandi yang kuat
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="currentPassword">
              {(field) => (
                <field.password
                  autoComplete="current-password"
                  label="Kata Sandi Saat Ini"
                  placeholder="Masukkan kata sandi saat ini"
                />
              )}
            </form.AppField>

            <Separator />

            <form.AppField name="newPassword">
              {(field) => (
                <field.password
                  autoComplete="new-password"
                  label="Kata Sandi Baru"
                  placeholder="Masukkan kata sandi baru"
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.password
                  autoComplete="new-password"
                  label="Konfirmasi Kata Sandi Baru"
                  placeholder="Masukkan ulang kata sandi baru"
                />
              )}
            </form.AppField>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <LoadingButton
                  className="w-full sm:w-auto"
                  disabled={!canSubmit}
                  loading={isPending || isSubmitting}
                  type="submit"
                >
                  Ubah Kata Sandi
                </LoadingButton>
              )}
            </form.Subscribe>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

// ==============================
// LINKED ACCOUNTS
// ==============================

function LinkedAccountsCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconLink className="size-5 text-muted-foreground" />
          <div>
            <CardTitle>Akun Terhubung</CardTitle>
            <CardDescription>
              Kelola akun pihak ketiga yang terhubung
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Image
                  alt="Google"
                  height={20}
                  src="/assets/google.svg"
                  width={20}
                />
              </div>
              <div>
                <p className="font-medium text-sm">Google</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">
              Terhubung
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
