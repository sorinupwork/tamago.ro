'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import ForgotPasswordForm from './ForgotPasswordForm';
import { loginSchema, type LoginFormData } from '@/lib/validations';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormData) => {
    toast.success('Autentificare reușită!');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <div className='flex flex-col items-center gap-1 text-center mt-4'>
        <h1 className='text-2xl font-bold'>Autentificare</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          Introdu email-ul și parola pentru a te autentifica rapid și sigur în contul tău Tamago. Accesează toate funcțiile personalizate
          fără întârzieri.
        </p>
      </div>
      <Field>
        <FieldLabel htmlFor='email' className='transition-transform duration-300 ease-in-out'>
          Email
        </FieldLabel>
        <Input id='email' type='email' placeholder='m@example.com' {...form.register('email')} required />
      </Field>
      <Field>
        <FieldLabel htmlFor='password' className='transition-transform duration-300 ease-in-out'>
          Parolă
        </FieldLabel>
        <div className='relative'>
          <Input id='password' type={showPassword ? 'text' : 'password'} {...form.register('password')} required />
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </Button>
        </div>
      </Field>
      <ForgotPasswordForm />
      <Button type='submit'>Autentificare</Button>
    </form>
  );
}
