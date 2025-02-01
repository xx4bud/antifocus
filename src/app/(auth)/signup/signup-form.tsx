"use client";

import { Card } from "@/components/ui/card";
import {
  SignUpValues,
  SignUpSchema,
} from "@/schemas/auth.schemas";
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
import {
  signUpCredentials,
  signInGoogle,
} from "@/actions/auth.actions";
import { useToast } from "@/hooks/use-toast";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { GoogleButton } from "@/components/ui/google-button";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingButton } from "@/components/ui/loading-button";
import Link from "next/link";

export function SignUpForm() {
  const [activeAuth, setActiveAuth] = React.useState<
    "google" | "credentials" | null
  >(null);
  const router = useRouter();
  const params = useSearchParams();
  const isLoading = activeAuth !== null;
  const { toast } = useToast();

  React.useEffect(() => {
    const error = params.get("error");
    if (error) {
      toast({
        variant: "destructive",
        description:
          "Account already exists on another provider",
      });
    }
  }, [params, toast]);

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
    setActiveAuth("credentials");
    const res = await signUpCredentials(data);
    if (res.success) {
      router.push("/signin");
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        description: res.message,
      });
      setActiveAuth(null);
    }
    setActiveAuth(null);
  };

  const googleSignUp = async () => {
    setActiveAuth("google");
    await signInGoogle();
    setActiveAuth(null);
  };

  return (
    <Card className="flex h-full flex-1 flex-col justify-center p-6 sm:h-fit sm:max-w-md">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-semibold">Sign Up</h1>
        <GoogleButton
          onClick={googleSignUp}
          loading={activeAuth === "google"}
          disabled={isLoading}
        />
        <Separator className="relative my-4">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
            OR
          </span>
        </Separator>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
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
                <FormLabel isRequired>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
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
                <FormLabel isRequired>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isLoading}
                    autoComplete="new-password"
                    placeholder="Enter your password"
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
                  <PasswordInput
                    disabled={isLoading}
                    autoComplete="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2 pt-2">
            <LoadingButton
              type="submit"
              loading={activeAuth === "credentials"}
              disabled={isLoading}
            >
              Continue
            </LoadingButton>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                className="font-medium text-primary"
                href="/signin"
                aria-disabled={isLoading}
              >
                SignIn
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </Card>
  );
}
