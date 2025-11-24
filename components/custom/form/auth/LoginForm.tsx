'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ForgotPasswordForm from './ForgotPasswordForm';
import AppInput from '@/components/custom/input/AppInput';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { signIn } from '@/lib/auth/auth-client';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setLoading(true);
    const result = await signIn.email({
      email: values.email,
      password: values.password,
    });
    if (result.error) {
      setLoading(false);
      toast.error('Autentificare eșuată: Verifică email-ul și parola.');
    } else {
      toast.success('Autentificare reușită!');
      router.push('/profile');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-4 p-2'>
        <div className='flex flex-col items-center gap-1 text-center mt-4'>
          <h1 className='text-2xl font-bold'>Autentificare</h1>
          <p className='text-muted-foreground text-sm text-balance'>
            Introdu email-ul și parola pentru a te autentifica rapid și sigur în contul tău Tamago. Accesează toate funcțiile personalizate
            fără întârzieri.
          </p>
        </div>
        <AppInput
          label='Email'
          type='email'
          placeholder='m@example.com'
          {...form.register('email')}
          required
          htmlFor='email'
          error={form.formState.errors.email ? [{ message: form.formState.errors.email.message }] : []}
          disabled={loading}
        />
        <AppInput
          label='Parolă'
          type={showPassword ? 'text' : 'password'}
          placeholder='Parola'
          {...form.register('password')}
          required
          htmlFor='password'
          error={form.formState.errors.password ? [{ message: form.formState.errors.password.message }] : []}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={togglePasswordVisibility}
          disabled={loading}
        />
        <Button type='submit' disabled={loading} className='flex items-center justify-center gap-2'>
          {loading ? <LoadingIndicator inline size={16} showText={false} /> : null}
          {loading ? 'Se autentifică...' : 'Autentificare'}
        </Button>
      </form>
      <ForgotPasswordForm />
    </>
  );
}
