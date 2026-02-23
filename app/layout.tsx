import './globals.css';
import 'pretendard/dist/web/static/pretendard.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';

import GlobalLayout from '@/components/layout/GlobalLayout';
import { Toaster } from '@/components/ui/sonner';

import AuthProvider from './providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#3182f6',
};

export const metadata: Metadata = {
  title: 'Walkavel - 일상의 발걸음을 여행으로, 워커블',
  description: 'Walk your way, Travel your story - 일상의 발걸음을 여행으로, 워커블(Walkavel)',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Walkavel',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <GlobalLayout>
          <AuthProvider>{children}</AuthProvider>
          <Analytics />
          <Toaster
            position="top-center"
            toastOptions={{
              unstyled: true,
            }}
            className="flex w-full justify-center"
          />
        </GlobalLayout>
      </body>
    </html>
  );
}
