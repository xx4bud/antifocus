"use client"

import { GoogleButton } from "@/components/ui/google-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInSchema, SignInValues } from "@/lib/schemas"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { PasswordInput } from "@/components/ui/password-input"
import { LoadingButton } from "@/components/ui/loading-button"
import Link from "next/link"
import { signInCredentials } from "@/app/(auth)/actions"
import { redirect, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SignInForm() {
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = (data: SignInValues) => {
    setError(undefined)
    startTransition(async () => {
      const res = await signInCredentials(data)
      if (!res.success) {
        setError(res.message)
        return
      }
      toast({
        title: "Success",
        description: "Signed in successfully",
      })
      redirect("/")
    })
  }

  return (
    <div className="mx-auto flex h-full w-full flex-col justify-center rounded-lg border bg-card p-4 py-8 md:h-auto md:max-w-md">
      <div className="flex flex-col gap-3 pb-2">
        <h1 className="-m-1 text-center text-xl font-bold">
          Sign In
        </h1>

        {error && (
          <div className="flex h-9 items-center justify-center rounded-md bg-destructive/10 text-destructive">
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
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    disabled={isPending}
                    placeholder="Email or Username"
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

          <div className="flex w-full flex-col gap-3 text-center">
            <LoadingButton
              type="submit"
              loading={isPending}
            >
              Continue
            </LoadingButton>

            <span className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary underline"
              >
                SignUp
              </Link>
            </span>
          </div>
        </form>
      </Form>
    </div>
  )
}
