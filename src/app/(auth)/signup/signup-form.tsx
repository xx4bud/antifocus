"use client";

import { Card } from "@/components/ui/card";
import {
  SignUpValues,
  SignUpSchema,
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
import { signUpCredentials } from "@/app/actions/auth.server";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const [isLoading, setIsLoading] =
    React.useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    setIsLoading(true);
    try {
      const res = await signUpCredentials(data);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          variant: "default",
          description: "User created successfully",
        });
        router.push("/signin");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
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
                    autoComplete="new-password"
                    placeholder="Enter your password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Confirm your password"
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
