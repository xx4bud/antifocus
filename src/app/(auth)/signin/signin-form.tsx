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
import { useToast } from "@/hooks/use-toast";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingButton } from "@/components/ui/loading-button";
import Link from "next/link";
import {
  signInCredentials,
  signInGoogle,
} from "@/app/actions/auth.actions";
import { GoogleButton } from "@/components/ui/google-button";

export function SignInForm() {
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

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    setActiveAuth("credentials");
    try {
      const res = await signInCredentials(data);
      if (res.success) {
        router.push("/");
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          description: "Email or password is incorrect",
        });
        setActiveAuth(null);
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
    } finally {
      setActiveAuth(null);
    }
  };

  const googleSignUp = async () => {
    setActiveAuth("google");
    try {
      await signInGoogle()
    } catch (error: any) {
      console.error("Error signing in google:", error);
    } finally {
      setActiveAuth(null);
    }
  };

  return (
    <Card className="flex h-full flex-1 flex-col justify-center p-6 sm:h-fit sm:max-w-md">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-semibold">Sign In</h1>
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
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>
                  Email or Username
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your email or username"
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
                    autoComplete="current-password"
                    placeholder="Enter your password"
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
              Don&apos;t have an account?{" "}
              <Link
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
