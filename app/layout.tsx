import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { ThemeProvider } from '@/components/custom/theme/ThemeProvider';
import { AppNavigation } from '@/components/custom/navigation/AppNavigation';
import { Footer } from '@/components/custom/footer/Footer';
import ChatDrawer from '@/components/custom/chat/ChatDrawer';
import MoreInfo from '@/components/custom/info/MoreInfo';
import { Toaster } from '@/components/ui/sonner';
import { CategoryLayout } from '@/components/custom/sidebar/CategorySidebar';

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
            <CategoryLayout>
              <div className='flex grow px-4 py-2 justify-center'>{children}</div>

              <MoreInfo />

              <footer className='sticky bottom-0 bg-muted border-t'>
                <Footer />
              </footer>
            </CategoryLayout>
          </main>
          <ChatDrawer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
