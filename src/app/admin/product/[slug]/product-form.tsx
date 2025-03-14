"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProductData, CategoryData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RegexSlug } from "@/lib/schemas";
import { Check, ChevronsUpDown, ImagePlus, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getAllCategories } from "@/actions/category";
import { useQuery } from "@tanstack/react-query";

const productFormSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().regex(RegexSlug, "Slug harus dalam format URL yang valid"),
  sku: z.string().min(1, "SKU wajib diisi"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  status: z.enum(["LIVE", "DRAFT"]),
  media: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
    alt: z.string().optional(),
    order: z.number().default(0)
  })).optional(),
  categories: z.array(z.string()).min(1, "Pilih minimal satu kategori")
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product: ProductData | null;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryData[]>(product?.categories || []);

  const { data: categories = [] } = useQuery<CategoryData[]>({
    queryKey: ["categories"],
    queryFn: () => getAllCategories().catch(() => [])
  });

  const defaultValues: Partial<ProductFormValues> = {
    name: product?.name || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    description: product?.description || "",
    price: product ? Number(product.price) : 0,
    status: (product?.status as "LIVE" | "DRAFT") || "DRAFT",
    media:
        product?.media?.map((media) => ({
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
    categories: product?.categories?.map((cat) => cat.id) || []
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ProductFormValues) {
    try {
      setIsLoading(true);
      // TODO: Implement product update/create logic
      toast.success(product ? "Produk berhasil diperbarui" : "Produk berhasil dibuat");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan produk");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Edit Produk" : "Tambah Produk"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Masukkan nama produk"
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
                          disabled={isLoading}
                          placeholder="produk-anda"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL friendly nama produk
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="PRD-001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        placeholder="Deskripsi produk"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value?.length
                                ? `${field.value.length} kategori dipilih`
                                : "Pilih kategori"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Cari kategori..." />
                              <CommandEmpty>Kategori tidak ditemukan</CommandEmpty>
                              <CommandGroup>
                                <ScrollArea className="h-64">
                                  {categories.map((category) => (
                                    <CommandItem
                                      value={category.id}
                                      key={category.id}
                                      onSelect={() => {
                                        const currentValue = field.value || [];
                                        const newValue = currentValue.includes(category.id)
                                          ? currentValue.filter((id) => id !== category.id)
                                          : [...currentValue, category.id];
                                        field.onChange(newValue);
                                        setSelectedCategories(
                                          categories.filter((cat) => newValue.includes(cat.id))
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          (field.value || []).includes(category.id)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {category.name}
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <div className="mt-2">
                        {selectedCategories.map((category) => (
                          <Badge
                            key={category.id}
                            variant="secondary"
                            className="mr-1 mb-1"
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gambar Produk</FormLabel>
                    <FormControl>
                      <div className="grid gap-4 md:grid-cols-3">
                        {(field.value || []).map((media, index) => (
                          <Card key={media.publicId}>
                            <CardContent className="p-2">
                              <AspectRatio ratio={1}>
                                <Image
                                  src={media.url}
                                  alt={media.alt || "Product image"}
                                  fill
                                  className="rounded-md object-cover"
                                />
                              </AspectRatio>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2"
                                onClick={() => {
                                  const newValue = [...(field.value || [])];
                                  newValue.splice(index, 1);
                                  field.onChange(newValue);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                        <Card className="border-dashed">
                          <CardContent className="p-2">
                            <AspectRatio ratio={1}>
                              <Button
                                type="button"
                                variant="ghost"
                                className="h-full w-full flex flex-col items-center justify-center"
                                onClick={() => {
                                  // TODO: Implement image upload
                                }}
                              >
                                <ImagePlus className="h-8 w-8 mb-2" />
                                <span>Upload Gambar</span>
                              </Button>
                            </AspectRatio>
                          </CardContent>
                        </Card>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Status Publikasi
                      </FormLabel>
                      <FormDescription>
                        {field.value === "LIVE" ? "Produk akan ditampilkan di website" : "Produk disimpan sebagai draft"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isLoading}
                        checked={field.value === "LIVE"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "LIVE" : "DRAFT")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className={cn(isLoading && "loading")}
                  disabled={isLoading}
                >
                  {product ? "Simpan Perubahan" : "Buat Produk"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
