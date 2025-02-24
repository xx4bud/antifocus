"use client";

import { UserData } from "@/lib/types";
import { UserRole, UserStatus } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  submitUser,
  editUser,
  deleteUser,
} from "./actions";
import { AlertModal } from "@/components/ui/alert-modal";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Trash } from "lucide-react";
import {
  UserFormSchema,
  UserFormValue,
} from "@/lib/schemas";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";

interface UserFormProps {
  user: UserData | null;
}

const roles = [
  { id: UserRole.USER, name: "User" },
  { id: UserRole.ADMIN, name: "Admin" },
];

const statuses = [
  { id: UserStatus.ONLINE, name: "Online" },
  { id: UserStatus.OFFLINE, name: "Offline" },
  { id: UserStatus.BANNED, name: "Banned" },
];

export function UserForm({ user }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<
    string[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cleanUpMedia = async () => {
      try {
        const tempMedia = JSON.parse(
          localStorage.getItem("tempMedia") || "[]"
        );
        if (tempMedia.length > 0) {
          for (const media of tempMedia) {
            await fetch(
              `/api/cloudinary?publicId=${media.publicId}`,
              {
                method: "DELETE",
              }
            );
          }
          localStorage.removeItem("tempMedia");
        }
      } catch (err) {
        console.error("Error parsing tempMedia:", err);
      }
    };
    cleanUpMedia();
    return () => {
      cleanUpMedia();
    };
  }, []);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      media:
        user?.media?.map((media) => ({
          format: media.format ?? "",
          url: media.url ?? "",
          publicId: media.publicId ?? "",
          alt: media.alt ?? "",
          order: media.order ?? 0,
          width: media.width ?? 0,
          height: media.height ?? 0,
          size: media.size ?? 0,
          metadata:
            media.metadata &&
            typeof media.metadata === "object" &&
            !Array.isArray(media.metadata)
              ? (media.metadata as {
                  [key: string]: unknown;
                })
              : undefined,
        })) ?? [],
      name: user?.name ?? "",
      slug: user?.slug ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      role: (user?.role as UserRole) ?? UserRole.USER,
      status:
        (user?.status as UserStatus) ?? UserStatus.ONLINE,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // const formState = form.formState;
  // console.log("Form State after upload:", {
  //   values: form.getValues(),
  //   errors: formState.errors,
  //   isDirty: formState.isDirty,
  //   dirtyFields: formState.dirtyFields,
  //   touchedFields: formState.touchedFields,
  // });

  const onUpload = async (
    result: CloudinaryUploadWidgetResults
  ) => {
    try {
      if (result.info && typeof result.info === "object") {
        const info = result.info as any;
        const {
          secure_url: url,
          public_id: publicId,
          format,
          bytes: size,
          width,
          height,
          original_filename,
          ...metadata
        } = info;

        const tempMedia = JSON.parse(
          localStorage.getItem("tempMedia") || "[]"
        );

        const newMedia = [
          ...tempMedia,
          { url, publicId, order: tempMedia.length },
        ];
        localStorage.setItem(
          "tempMedia",
          JSON.stringify(newMedia)
        );

        const currentMedia = form.getValues("media") || [];
        const updatedMedia = [
          ...currentMedia,
          {
            format: format?.toUpperCase() || "OTHER",
            url,
            publicId,
            alt:
              `${user?.name || "User"} ${original_filename}` ||
              `Media ${original_filename}`,
            order: currentMedia.length,
            width: width || 0,
            height: height || 0,
            size: size || 0,
            metadata: metadata || undefined,
          },
        ];

        form.setValue("media", updatedMedia);
        await form.trigger("media");
        toast.success("Media berhasil diunggah");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Gagal mengunggah media");
    }
  };

  const onRemove = async (publicId: string) => {
    try {
      const currentMedia = form.getValues("media") || [];
      const updatedMedia = currentMedia.filter(
        (media) => media?.publicId !== publicId
      );
      form.setValue("media", updatedMedia);
      await form.trigger("media");
      setMediaToDelete((prev) => [...prev, publicId]);
      toast.success("Media berhasil dihapus");
    } catch (error) {
      console.error("Error removing media:", error);
      toast.error("Gagal menghapus media");
    }
  };

  const onSubmit = async (data: UserFormValue) => {
    try {
      setLoading(true);
    if (mediaToDelete.length > 0) {
        for (const publicId of mediaToDelete) {
          await fetch(
            `/api/cloudinary?publicId=${publicId}`,
            {
              method: "DELETE",
            }
          );
        }
      }

      const result = user
        ? await editUser(user.id, data)
        : await submitUser(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }
      localStorage.removeItem("tempMedia");
      setMediaToDelete([]);
    toast.success(
        user
          ? "Pengguna berhasil diperbarui"
          : "Pengguna berhasil dibuat"
      );
      router.push("/admin/user");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "Terjadi kesalahan saat menyimpan data pengguna"
      );
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
     if (!user?.id) {
        toast.error("ID pengguna tidak valid");
        return;
      }
      if (user.media?.length > 0) {
        for (const media of user.media) {
          if (media.publicId) {
            await fetch(
              `/api/cloudinary?publicId=${media.publicId}`,
              {
                method: "DELETE",
              }
            );
          }
        }
      }

      const result = await deleteUser(user.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }
    toast.success("Pengguna berhasil dihapus");
      router.push("/admin/user");
      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        "Terjadi kesalahan saat menghapus pengguna"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Heading
        title={user ? `${user.name}` : "Create User"}
        button={
          user && (
            <Button
              type="button"
              onClick={() => setOpen(true)}
              size={"icon"}
              variant={"destructive"}
            >
              <Trash />
            </Button>
          )
        }
      />
      <div className="flex flex-col py-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">
                  Basic Information
                </TabsTrigger>
                <TabsTrigger value="security">
                  Security
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="basic"
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="media"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media</FormLabel>
                      <FormControl>
                        <CloudinaryUpload
                          value={field.value || []}
                          onChange={(newMedia) => {
                            field.onChange(newMedia);
                            form.trigger("media");
                          }}
                          onRemove={onRemove}
                          onUpload={onUpload}
                          disabled={loading}
                          max={5}
                          resourceType="image"
                          allowedFormats={[
                            "webp",
                            "png",
                            "jpeg",
                            "jpg",
                          ]}
                          maxFileSize={5000000} // 5MB
                          folder="antifocus/users"
                          multiple={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Slug"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent
                value="security"
                className="space-y-2"
              >
                {user && (
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type="password"
                            placeholder="Enter current password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="password"
                          placeholder="Enter new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="password"
                          placeholder="Confirm new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            {field.value
                              ? roles.find(
                                  (r) =>
                                    r.id === field.value
                                )?.name
                              : "Select Role"}
                          </SelectTrigger>
                          <FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem
                                  key={role.id}
                                  value={role.id}
                                >
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </FormControl>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            {field.value
                              ? statuses.find(
                                  (s) =>
                                    s.id === field.value
                                )?.name
                              : "Select Status"}
                          </SelectTrigger>
                          <FormControl>
                            <SelectContent>
                              {statuses.map((status) => (
                                <SelectItem
                                  key={status.id}
                                  value={status.id}
                                >
                                  {status.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </FormControl>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex flex-col gap-4 pt-2">
              <Separator />
              <div className="flex items-center gap-2">
                <Button
                  disabled={loading}
                  className="flex-1"
                  type="submit"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <AlertModal
        loading={loading}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        title="Apakah Anda yakin?"
        description="Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
