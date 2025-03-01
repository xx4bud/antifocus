"use client";

import { Input } from "@/components/ui/input";
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
import { signIn } from "next-auth/react";
import {
  SignUpFormSchema,
  SignUpFormValue,
} from "@/lib/schemas";
import { signUpCredentials } from "@/actions/auth";
import { toast } from "sonner";
import Link from "next/link";

export function SignUpForm() {
  const [activeAuth, setActiveAuth] = useState<
    "google" | "credentials" | null
  >(null);
  const router = useRouter();
  const params = useSearchParams();
  const isLoading = activeAuth !== null;
  const callbackUrl = params.get("callbackUrl") || "/";

  const form = useForm<SignUpFormValue>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (params.get("error") === "OAuthAccountNotLinked") {
      toast.error(
        "This account is already registered with a different provider. Please sign in with the correct provider."
      );
    }
  }, [params]);

  const onSubmit = async (values: SignUpFormValue) => {
    setActiveAuth("credentials");
    const res = await signUpCredentials(values);
    if (res.success) {
      router.push("/signin");
      router.refresh();
    } else {
      toast.error(res.message || "Failed to sign up");
    }
    setActiveAuth(null);
  };

  const googleSignUp = async () => {
    setActiveAuth("google");
    await signIn("google", {
      redirect: true,
      redirectTo: callbackUrl,
    });
    setActiveAuth(null);
  };

  return (
    <div className="flex flex-1 items-center justify-center min-h-svh">
      <div className="flex h-svh w-full flex-col items-center justify-center rounded-lg p-6 sm:h-fit sm:max-w-md sm:border">
      <div className="flex w-full flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">SignUp</h1>
        <GoogleButton
          onClick={googleSignUp}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isLoading}
                    placeholder="Enter your name"
                    autoComplete="name"
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
                    disabled={isLoading}
                    placeholder="Enter your email"
                    autoComplete="email"
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
                  <PasswordInput
                    disabled={isLoading}
                    placeholder="Enter your password"
                    autoComplete="new-password"
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
                    placeholder="Confirm your password"
                    autoComplete="new-password"
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
    </div>
    </div>
  );
}
