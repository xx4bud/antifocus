"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  SignInSchema,
  SignInValues,
} from "@/lib/validation";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingButton } from "@/components/ui/loading-button";
import { GoogleButton } from "@/components/ui/google-button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { signInCredentials } from "../actions";

export function SignInForm() {
  const [activeAuth, setActiveAuth] = useState<
    "google" | "credentials" | null
  >(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const isLoading = activeAuth !== null;
  const callbackUrl = params.get("callbackUrl") || "/";

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (params.get("error") === "OAuthAccountNotLinked") {
      toast({
        variant: "destructive",
        description:
          "Account already linked to another provider",
      });
    }
  }, [params, toast]);

  const onSubmit = async (values: SignInValues) => {
    setActiveAuth("credentials");
    const res = await signInCredentials(values);
    if (res.success) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        description: res.message,
      });
    }
    setActiveAuth(null);
  };

  const googleSignIn = async () => {
    setActiveAuth("google");
    await signIn("google", {
      redirect: true,
      redirectTo: callbackUrl
    });
    setActiveAuth(null);
  };

  return (
    <Card className="flex h-screen w-full flex-col items-center justify-center p-6 sm:h-fit sm:max-w-md">
      <div className="flex w-full flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">SignIn</h1>
        <GoogleButton
          onClick={googleSignIn}
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
          className="flex w-full flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>
                  Email or Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isLoading}
                    placeholder="Enter your email or username"
                    autoComplete="username"
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col gap-2 py-2 text-center">
            <LoadingButton
              type="submit"
              loading={activeAuth === "credentials"}
              disabled={isLoading}
            >
              Continue
            </LoadingButton>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                prefetch={false}
                className="font-medium text-primary"
                href="/signup"
                aria-disabled={isLoading}
              >
                SignUp
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </Card>
  );
}
