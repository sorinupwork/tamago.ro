import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/custom/theme/ThemeProvider';
import { AppNavigation } from '@/components/custom/navigation/AppNavigation';
import { Footer } from '@/components/custom/footer/Footer';
import ChatDrawer from '@/components/custom/chat/ChatDrawer';
import MoreInfo from '@/components/custom/info/MoreInfo';
import { CategoryLayout } from '@/components/custom/layout/CategoryLayout';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Tamago - În Curând',
  description: 'Noul nostru proiect va fi lansat în curând. Rămâneți la curent!',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Tamago - În Curând',
    description: 'Noul nostru proiect va fi lansat în curând. Rămâneți la curent!',
    images: [
      {
        url: '/tamago.png',
        width: 1200,
        height: 630,
        alt: 'Tamago Logo',
      },
    ],
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ro' suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <AppNavigation />

          <CategoryLayout>
            {children}

            <MoreInfo />
            <Footer />
          </CategoryLayout>

          <ChatDrawer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
