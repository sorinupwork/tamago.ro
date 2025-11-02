'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AuthInfo from '../auth/AuthInfo';
import AppOAuth from '../auth/AppOAuth';
import { signupSchema, type SignupFormData } from '@/lib/validations';

export default function SignupForm() {
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

  return (
    <Card className='transition-all duration-300 hover:shadow-xl'>
      <CardHeader>
        <CardTitle className='animate-pulse'>Înregistrare</CardTitle>
      </CardHeader>
      <CardContent className='space-y-8'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume</FormLabel>
                  <FormControl>
                    <Input placeholder='Nume' {...field} className='transition-all duration-200 focus:scale-102' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' {...field} className='transition-all duration-200 focus:scale-102' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parolă</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='Parolă' {...field} className='transition-all duration-200 focus:scale-102' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full hover:scale-105 transition-transform'>
              Înregistrare
            </Button>
          </form>
        </Form>
        <Separator />
        <AppOAuth />
      </CardContent>
      <CardFooter>
        <AuthInfo
          whyTitle='De ce să te înregistrezi?'
          whyDescription='Alătură-te comunității noastre pentru a debloca funcții exclusive, a primi recomandări personalizate și a crește alături de noi.'
          whyList={['Acces gratuit la instrumente premium', 'Construiește-ți profilul și rețeaua', 'Primește actualizări și notificări']}
          howTitle='Cum să începi'
          howList={[
            'Completează numele, email-ul și parola',
            'Apasă "Înregistrare" pentru a crea contul',
            'Verifică email-ul și începe explorarea',
          ]}
        />
      </CardFooter>
    </Card>
  );
}
