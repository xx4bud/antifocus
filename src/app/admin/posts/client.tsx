"use client";

import { Post } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, PostValues } from "@/lib/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitPost } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  initialData: Post[];
}

export default function PostClient({ initialData }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<PostValues>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: PostValues) => {
    try {
      const res = await submitPost(data);

      if (res.success) {
        toast({
          title: "Success",
          description: "Post saved successfully",
        });
        localStorage.removeItem("tempPhotos");
        router.push("/admin/posts");
        router.refresh();
      } else {
        throw new Error(res.error || "Failed to save post");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
