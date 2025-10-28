'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle, List } from 'lucide-react';

const loginSchema = z.object({
  email: z.email('Email invalid'),
  password: z.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere'),
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log('Autentificare:', values);
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
        <Separator />
        <div className='space-y-6'>
          <h3 className='text-lg font-semibold flex items-center animate-pulse'>
            <CheckCircle className='mr-2 h-5 w-5 text-green-500' />
            De ce să te autentifici?
          </h3>
          <p className='text-sm text-muted-foreground'>
            Accesează funcții personalizate, gestionează-ți contul și bucură-te de o experiență fără întreruperi pe platforma noastră.
          </p>
          <ul className='list-disc list-inside text-sm space-y-2'>
            <li>Acces securizat la datele tale</li>
            <li>Urmărește progresul și realizările</li>
            <li>Conectează-te cu alți utilizatori</li>
          </ul>
        </div>
        <Separator />
        <div className='space-y-6'>
          <h3 className='text-lg font-semibold flex items-center animate-pulse'>
            <List className='mr-2 h-5 w-5 text-blue-500' />
            Cum să începi
          </h3>
          <ol className='list-decimal list-inside text-sm space-y-2'>
            <li>Introdu email-ul și parola</li>
            <li>Apasă &quot;Autentificare&quot; pentru a accesa contul</li>
            <li>Explorează funcțiile platformei</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
