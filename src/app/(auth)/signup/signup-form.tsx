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
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { GoogleButton } from "@/components/ui/google-button";
import { LoadingButton } from "@/components/ui/loading-button";
import { signUpCredentials } from "@/app/actions/user-actions";
import { signInGoogle } from "@/app/actions/auth-actions";

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
    if (error === "OAuthAccountNotLinked") {
      toast({
        title: "Account already linked to another provider",
      });
    }
  }, [params, toast]);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignUpValues) {
    setActiveAuth("credentials");
    try {
      const res = await signUpCredentials(data);

      if (res.success) {
        toast({
          description: "Signed up successfully",
        });
        router.push("/signin");
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          description: res.message,
        });
        router.refresh()
        setActiveAuth(null);
      }
    } catch (error) {
      console.error("Error signing up credentials:", error);
    }
  }

  async function signUpWithGoogle() {
    setActiveAuth("google");
    await signInGoogle();
    setActiveAuth(null);
  }

  return (
    <Card className="flex h-full w-full flex-col justify-center md:h-auto md:max-w-md">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-semibold">Sign Up</h1>

        <GoogleButton
          onClick={signUpWithGoogle}
          loading={activeAuth === "google"}
          disabled={isLoading}
        />

        <Separator className="relative my-2">
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
            OR
          </p>
        </Separator>
      </div>

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
                <FormLabel isRequired>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    autoComplete="name"
                    placeholder="Enter your name"
                    type="text"
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
                    autoComplete="email"
                    placeholder="Enter your email"
                    type="email"
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
                    autoComplete="password"
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
                <FormLabel isRequired>
                  Confirm Password
                </FormLabel>
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

          <div className="flex flex-col gap-2 py-2">
            <LoadingButton
              type="submit"
              loading={activeAuth === "credentials"}
              disabled={isLoading}
            >
              Continue
            </LoadingButton>

            <p className="text-center text-sm text-muted-foreground">
              Already&nbsp;have&nbsp;an&nbsp;account?&nbsp;
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
