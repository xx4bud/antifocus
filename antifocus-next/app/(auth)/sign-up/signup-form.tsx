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
import { SignUpSchema, SignUpValues } from '@/schemas/auth-schema';
import { PasswordInput } from '@/components/password-input';
import LoadingButton from '@/components/loading-button';
import GoogleButton from '../_components/google-button';
import Link from 'next/link';
import { signUpCredentials } from '../_components/actions';

export default function SignUpForm() {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignUpValues) => {
    setError(undefined);
    startTransition(async () => {
      const res = await signUpCredentials(data);
      if (res.success) {
        router.replace('/sign-in');
      } else {
        setError('Email already exists');
      }
    });
  };

  return (
    <Card className="flex h-full w-full flex-col justify-center gap-2 px-8 py-8 sm:h-auto sm:max-w-md">
      <h1 className="text-center text-2xl font-bold">Sign Up</h1>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary hover:underline">
            <span>Sign In</span>
          </Link>
        </span>
      </div>
    </Card>
  );
}
