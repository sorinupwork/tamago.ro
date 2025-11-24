'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams, notFound } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppInput from '@/components/custom/input/AppInput';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations';
import { resetPassword } from '@/lib/auth/auth-client';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Token invalid sau lipsă.');
      return;
    }
    try {
      const result = await resetPassword({ newPassword: values.password, token });
      if (result.error) {
        toast.error(result.error.message || 'Eroare la resetarea parolei.');
      } else {
        toast.success('Parola a fost resetată cu succes! Te poți autentifica acum.');
        form.reset();
        router.push('/cont');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Eroare la resetarea parolei.');
    }
  };

  const togglePasswordVisibility = () => setShowPassword((s) => !s);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((s) => !s);

  if (!token) {
    notFound();
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6 max-w-md mx-auto'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Resetează Parola</h1>
          <p className='text-muted-foreground'>Introdu noua parolă.</p>
        </div>
        <AppInput
          label='Parolă Nouă'
          type={showPassword ? 'text' : 'password'}
          placeholder='Parola'
          {...form.register('password')}
          required
          htmlFor='password'
          error={form.formState.errors.password ? [{ message: form.formState.errors.password.message }] : []}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={togglePasswordVisibility}
        />
        <AppInput
          label='Confirmă Parola'
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder='Confirmă Parola'
          {...form.register('confirmPassword')}
          required
          htmlFor='confirmPassword'
          error={form.formState.errors.confirmPassword ? [{ message: form.formState.errors.confirmPassword.message }] : []}
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconClick={toggleConfirmPasswordVisibility}
        />
        <div className='text-sm text-muted-foreground border rounded p-4 bg-muted/50'>
          <p className='font-medium mb-2'>Reguli pentru parolă:</p>
          <ul className='list-disc list-inside space-y-1'>
            <li>Parola trebuie să aibă cel puțin 6 caractere.</li>
            <li>Confirmă parola trebuie să se potrivească cu parola nouă.</li>
          </ul>
        </div>
        <Button type='submit'>Resetează Parola</Button>
      </form>
    </div>
  );
}
