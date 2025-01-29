"use client";

import { Card } from "@/components/ui/card";
import {
  SignInValues,
  SignInSchema,
} from "@/lib/validation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { signInCredentials } from "@/app/actions/auth.client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    setIsLoading(true);
    try {
      const res = await signInCredentials(data);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          variant: "default",
          description: "Signed in successfully",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-1 flex-col justify-center p-6 sm:h-fit sm:max-w-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifier</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your identifier"
                    className="input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-1 flex-col pt-2">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
