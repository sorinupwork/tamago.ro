import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/custom/theme/ThemeProvider';
import { AppNavigation } from '@/components/custom/navigation/AppNavigation';
import { Footer } from '@/components/custom/footer/Footer';
import ChatDrawer from '@/components/custom/chat/ChatDrawer';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tamago - În Curând',
  description: 'Noul nostru proiect va fi lansat în curând. Rămâneți la curent!',
  robots: 'noindex, nofollow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ro' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <nav className='sticky top-0 z-50 bg-background border-b'>
            <AppNavigation />
          </nav>
          <main className='flex flex-col flex-1 overflow-y-auto'>
            <div className='flex grow w-full mx-auto max-w-7xl px-4 py-2 min-w-0 justify-center'>{children}</div>

            <section className='bg-background py-12 px-4'>
              <div className='max-w-6xl mx-auto'>
                <h2 className='text-3xl font-bold text-center mb-8 text-secondary'>Mai Multe Resurse</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='bg-muted p-6 rounded-lg'>
                    <h3 className='text-xl font-semibold mb-4 text-foreground'>Ghiduri Detaliate</h3>
                    <p className='text-muted-foreground'>
                      Descoperă tutoriale pas cu pas pentru a maximiza utilizarea dispozitivelor Tamago. De la configurare inițială până la
                      funcții avansate, avem totul acoperit.
                    </p>
                  </div>
                  <div className='bg-muted p-6 rounded-lg'>
                    <h3 className='text-xl font-semibold mb-4 text-foreground'>Comunitate și Suport</h3>
                    <p className='text-muted-foreground'>
                      Alătură-te comunității Tamago pentru sfaturi, discuții și ajutor de la alți utilizatori. Suportul nostru este
                      întotdeauna la un click distanță.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <footer className='sticky bottom-0 bg-muted border-t'>
              <Footer />
            </footer>
          </main>
          <ChatDrawer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
