'use client';

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Modal from '@/components/ui/modal';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterValues } from '@/schemas/auth-schema';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/loading-button';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterForm() {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setError(undefined);
    startTransition(async () => {
      const res = await axios.post('/api/dashboard', values);
      if (res.status === 200) {
        window.location.assign(`/dashboard/${res.data.id}`);
      } else {
        setError('Create store failed');
      }
    });
  };

  const handleCancel = () => {
    router.back();
    form.reset();
  };

  return (
    <Modal
      title="Buat Toko"
      description="Buat toko baru untuk menjual produk Anda"
      isOpen={true}
      onClose={() => {}}>
      {error && (
        <div className="flex w-full flex-col gap-2 rounded-md bg-destructive/10 p-2">
          <p className="text-center text-destructive">{error}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Toko</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Masukkan nama toko Anda"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2 pt-4">
            <LoadingButton
              loading={isPending}
              variant="outline"
              onClick={handleCancel}>
              Batal
            </LoadingButton>
            <LoadingButton loading={isPending} type="submit">
              Lanjut
            </LoadingButton>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
