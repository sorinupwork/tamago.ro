'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle, List, Mail, Facebook, Instagram } from 'lucide-react';
import { toast } from 'sonner';

const signupSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  email: z.email('Email invalid'),
  password: z.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere'),
});

export default function SignupForm() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
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
        <div className='space-y-6'>
          <h3 className='text-lg font-semibold'>Sau înregistrează-te cu</h3>
          <div className='flex flex-col space-y-3'>
            <Button
              variant='outline'
              className='w-full hover:scale-105 transition-transform'
              onClick={() => toast.info('Înregistrare cu Google în curând!')}
            >
              <Mail className='mr-2 h-4 w-4' />
              Continuă cu Google
            </Button>
            <Button
              variant='outline'
              className='w-full hover:scale-105 transition-transform'
              onClick={() => toast.info('Înregistrare cu Facebook în curând!')}
            >
              <Facebook className='mr-2 h-4 w-4' />
              Continuă cu Facebook
            </Button>
            <Button
              variant='outline'
              className='w-full hover:scale-105 transition-transform'
              onClick={() => toast.info('Înregistrare cu Instagram în curând!')}
            >
              <Instagram className='mr-2 h-4 w-4' />
              Continuă cu Instagram
            </Button>
          </div>
        </div>
        <Separator />
        <div className='space-y-6'>
          <h3 className='text-lg font-semibold flex items-center animate-pulse'>
            <CheckCircle className='mr-2 h-5 w-5 text-green-500' />
            De ce să te înregistrezi?
          </h3>
          <p className='text-sm text-muted-foreground'>
            Alătură-te comunității noastre pentru a debloca funcții exclusive, a primi recomandări personalizate și a crește alături de noi.
          </p>
          <ul className='list-disc list-inside text-sm space-y-2'>
            <li>Acces gratuit la instrumente premium</li>
            <li>Construiește-ți profilul și rețeaua</li>
            <li>Primește actualizări și notificări</li>
          </ul>
        </div>
        <Separator />
        <div className='space-y-6'>
          <h3 className='text-lg font-semibold flex items-center animate-pulse'>
            <List className='mr-2 h-5 w-5 text-blue-500' />
            Cum să începi
          </h3>
          <ol className='list-decimal list-inside text-sm space-y-2'>
            <li>Completează numele, email-ul și parola</li>
            <li>Apasă &quot;Înregistrare&quot; pentru a crea contul</li>
            <li>Verifică email-ul și începe explorarea</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
