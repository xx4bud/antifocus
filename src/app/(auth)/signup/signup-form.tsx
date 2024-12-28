"use client"

import { GoogleButton } from "@/components/ui/google-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpSchema, SignUpValues } from "@/lib/schemas"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { PasswordInput } from "@/components/ui/password-input"
import { LoadingButton } from "@/components/ui/loading-button"
import Link from "next/link"
import { signUpCredentials } from "@/app/(auth)/actions"
import { redirect } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SignUpForm() {
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: SignUpValues) => {
    setError(undefined)
    startTransition(async () => {
      const res = await signUpCredentials(data)
      if (!res.success) {
        setError(res.message)
        return
      }
      toast({
        title: "Success",
        description: "You have successfully signed up",
      })
      redirect("/signin")
    })
  }

  return (
    <div className="mx-auto flex h-full w-full flex-col justify-center rounded-lg border bg-card p-4 py-8 md:h-auto md:max-w-md">
      <div className="flex flex-col gap-3 pb-2">
        <h1 className="-m-1 text-center text-xl font-bold">
          Sign Up
        </h1>

        {error && (
          <div className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-destructive/10 text-destructive">
            <span>{error}</span>
          </div>
        )}

        <GoogleButton label="Continue with Google" />

        <Separator className="relative mb-3 mt-2">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
            OR
          </span>
        </Separator>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="text"
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
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="email"
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
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    placeholder="Password"
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
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col gap-3 text-center">
            <LoadingButton
              type="submit"
              loading={isPending}
            >
              Continue
            </LoadingButton>

            <span className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary underline"
              >
                SignIn
              </Link>
            </span>
          </div>
        </form>
      </Form>
    </div>
  )
}
