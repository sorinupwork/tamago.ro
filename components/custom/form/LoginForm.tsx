'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AuthInfo from '../auth/AuthInfo';
import { loginSchema, type LoginFormData } from '@/lib/validations';

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormData) => {
    console.log('Autentificare:', values);
    toast.success('Autentificare reușită!');
  };

  return (
    <Card className='transition-all duration-300 hover:shadow-xl'>
      <CardHeader>
        <CardTitle className='animate-pulse'>Autentificare</CardTitle>
      </CardHeader>
      <CardContent className='space-y-8'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
              Autentificare
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <AuthInfo
          whyTitle='De ce să te autentifici?'
          whyDescription='Accesează funcții personalizate, gestionează-ți contul și bucură-te de o experiență fără întreruperi pe platforma noastră.'
          whyList={['Acces securizat la datele tale', 'Urmărește progresul și realizările', 'Conectează-te cu alți utilizatori']}
          howTitle='Cum să începi'
          howList={['Introdu email-ul și parola', 'Apasă "Autentificare" pentru a accesa contul', 'Explorează funcțiile platformei']}
        />
      </CardFooter>
    </Card>
  );
}
