'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { signupSchema, type SignupFormData } from '@/lib/validations';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SignupFormData) => {
    console.log('Înregistrare:', values);
    toast.success('Înregistrare reușită!');
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
      <Field>
        <FieldLabel
          htmlFor='name'
          className={`mb-0.5 transition-transform duration-300 ease-in-out ${nameFocused ? '-translate-y-2' : ''}`}
        >
          Nume
        </FieldLabel>
        <Input
          id='name'
          placeholder='Nume'
          {...form.register('name')}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          required
        />
      </Field>
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
        <FieldLabel
          htmlFor='password'
          className={`mb-0.5 transition-transform duration-300 ease-in-out ${passwordFocused ? '-translate-y-2' : ''}`}
        >
          Parolă
        </FieldLabel>
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
      <Button type='submit'>Înregistrare</Button>
    </form>
  );
}
