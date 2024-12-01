'use client';

import { Card } from '@/components/ui/card';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema, SignInValues } from '@/schemas/auth-schema';
import { PasswordInput } from '@/components/password-input';
import LoadingButton from '@/components/loading-button';
import GoogleButton from '../_components/google-button';
import Link from 'next/link';
import { signInCredentials } from '../_components/actions';

export default function SignInForm() {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInValues) => {
    setError(undefined);
    startTransition(async () => {
      const res = await signInCredentials(data);
      if (res.success) {
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
    });
  };

  return (
    <Card className="flex h-full w-full flex-col justify-center gap-2 px-8 py-8 sm:h-auto sm:max-w-md">
      <h1 className="text-center text-2xl font-bold">Sign In</h1>
      {error && (
        <div className="flex w-full flex-col gap-2 rounded-md bg-destructive/10 p-2">
          <p className="text-center text-destructive">{error}</p>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2 pt-2">
            <LoadingButton loading={isPending} type="submit">
              Continue
            </LoadingButton>
            <div className="flex w-full items-center justify-center gap-2 py-2">
              <div className="h-[1px] w-full bg-border"></div>
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="h-[1px] w-full bg-border"></div>
            </div>
            <GoogleButton label="Continue with Google" />
          </div>
        </form>
      </Form>
      <div className="block pt-2 text-center text-sm">
        <span>
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            <span>Sign Up</span>
          </Link>
        </span>
      </div>
    </Card>
  );
}
