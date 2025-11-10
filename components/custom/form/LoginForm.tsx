'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

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
import { loginSchema, type LoginFormData } from '@/lib/validations';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const forgotForm = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: LoginFormData) => {
    console.log('Autentificare:', values);
    toast.success('Autentificare reușită!');
  };

  const onForgotSubmit = (values: { email: string }) => {
    console.log('Forgot password for:', values.email);
    toast.success('Coming soon!');
    setIsDialogOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <div className='flex flex-col items-center gap-1 text-center mt-4'>
        <h1 className='text-2xl font-bold'>Autentificare</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          Introdu email-ul și parola pentru a te autentifica rapid și sigur în contul tău Tamago. Accesează toate funcțiile
          personalizate fără întârzieri.
        </p>
      </div>
      <Field>
        <FieldLabel
          htmlFor='email'
          className={`mb-0.5 transition-transform duration-300 ease-in-out ${emailFocused ? '-translate-y-2' : ''}`}
        >
          Email
        </FieldLabel>
        <Input
          id='email'
          type='email'
          placeholder='m@example.com'
          {...form.register('email')}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          required
        />
      </Field>
      <Field>
        <div className='flex items-center'>
          <FieldLabel
            htmlFor='password'
            className={`mb-0.5 transition-transform duration-300 ease-in-out ${passwordFocused ? '-translate-y-2' : ''}`}
          >
            Parolă
          </FieldLabel>
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
                  <FieldLabel htmlFor='forgot-email'>Email</FieldLabel>
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
        </div>
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            {...form.register('password')}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            required
          />
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
      <Button type='submit'>Autentificare</Button>
    </form>
  );
}
