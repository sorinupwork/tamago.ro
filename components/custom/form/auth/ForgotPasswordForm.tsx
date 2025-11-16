'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ForgotPasswordForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const forgotForm = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onForgotSubmit = (values: { email: string }) => {
    toast.success('Coming soon!');
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant='link'
          size='sm'
          className='ml-auto text-sm underline-offset-4 hover:underline cursor-default'
        >
          Ai uitat parola?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resetare parolă</DialogTitle>
          <DialogDescription>
            Introdu email-ul tău pentru a primi instrucțiuni de resetare a parolei.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className='flex flex-col gap-4'>
          <Field>
            <FieldLabel htmlFor='forgot-email' className='mb-0.5 transition-transform duration-300 ease-in-out'>
              Email
            </FieldLabel>
            <Input
              id='forgot-email'
              type='email'
              placeholder='m@example.com'
              {...forgotForm.register('email')}
              required
            />
          </Field>
          <Button type='submit'>Trimite</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
