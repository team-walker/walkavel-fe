import './globals.css';
import 'pretendard/dist/web/static/pretendard.css';

import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';

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
};

export const metadata: Metadata = {
  title: 'Walkavel - 여행을 걷다',
  description: 'Walk your way, Travel your story - 걷기 좋은 여행지 발견, 워커블(Walkavel)',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
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
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" />
        <Script
          strategy="afterInteractive" // 명시적으로 설정
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID}`}
        />
      </body>
    </html>
  );
}
