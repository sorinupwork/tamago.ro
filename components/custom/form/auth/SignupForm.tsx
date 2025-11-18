'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp, signIn } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AppInput } from '@/components/custom/input/AppInput';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import LoadingIndicator from '@/components/custom/loading/LoadingIndicator';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignupFormData) => {
    setLoading(true);
    const result = await signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    });
    if (result.error) {
      setLoading(false);
      toast.error(result.error.message || 'Înregistrare eșuată.');
    } else {
      const signInResult = await signIn.email({
        email: values.email,
        password: values.password,
      });
      if (signInResult.error) {
        toast.error('Înregistrare reușită, dar autentificare eșuată.');
        setLoading(false);
      } else {
        toast.success('Înregistrare și autentificare reușite!');
        router.push('/profile');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <div className='flex flex-col items-center gap-1 text-center mt-4'>
        <h1 className='text-2xl font-bold'>Înregistrare</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          Completează detaliile pentru a crea un cont nou în Tamago. Beneficiază de acces imediat la resurse exclusive și începe călătoria
          ta către productivitate și conectare.
        </p>
      </div>
      <AppInput
        label='Nume'
        type='text'
        placeholder='Nume'
        {...form.register('name')}
        required
        htmlFor='name'
        error={form.formState.errors.name ? [{ message: form.formState.errors.name.message }] : []}
        disabled={loading}
      />
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
        {loading ? 'Se înregistrează...' : 'Înregistrare'}
      </Button>
    </form>
  );
}
