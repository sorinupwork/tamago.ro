'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgetPassword } from '@/lib/auth-client';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppInput } from '@/components/custom/input/AppInput';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';

export default function ForgotPasswordForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const forgotForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onForgotSubmit = async (values: ForgotPasswordFormData) => {
    const result = await forgetPassword({
      email: values.email,
    });
    if (result.error) {
      toast.error(result.error.message || 'Eroare la trimiterea email-ului.');
    } else {
      toast.success('Email de reset trimis!');
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='link' size='sm' className='ml-auto text-sm underline-offset-4 hover:underline cursor-default' type='button'>
          Ai uitat parola?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resetare parolă</DialogTitle>
          <DialogDescription>Introdu email-ul tău pentru a primi instrucțiuni de resetare a parolei.</DialogDescription>
        </DialogHeader>
        <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className='flex flex-col gap-4'>
          <AppInput
            label='Email'
            type='email'
            placeholder='m@example.com'
            {...forgotForm.register('email')}
            required
            htmlFor='forgot-email'
            error={forgotForm.formState.errors.email ? [{ message: forgotForm.formState.errors.email.message }] : []}
          />
          <Button type='submit'>Trimite</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
