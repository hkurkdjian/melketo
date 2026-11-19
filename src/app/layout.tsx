import type { Metadata } from 'next';
import { AppShellProvider } from '@/components/layout/AppShellProvider';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'ملک تو | سامانه تخصصی معرفی و معاملات املاک',
  description:
    'معرفی، خرید، رهن و اجاره و پیش‌فروش املاک مسکونی، ویلایی و اداری منتخب با فیلتر هوشمند، گالری معماری و نقشه موقعیت',
  openGraph: {
    title: 'ملک تو | سامانه تخصصی معرفی و معاملات املاک',
    description:
      'معرفی، خرید، رهن و اجاره و پیش‌فروش املاک مسکونی، ویلایی و اداری منتخب با فیلتر هوشمند، گالری معماری و نقشه موقعیت',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ملک تو | سامانه تخصصی معرفی و معاملات املاک',
    description:
      'معرفی، خرید، رهن و اجاره و پیش‌فروش املاک مسکونی، ویلایی و اداری منتخب با فیلتر هوشمند، گالری معماری و نقشه موقعیت',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AmirAbbasVafaee/persian-fonts-cdn@main/css/yekan-bakh.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AmirAbbasVafaee/persian-fonts-cdn@main/css/kalameh.min.css"
        />
      </head>
      <body className="bg-white text-foreground antialiased selection:bg-[#0F3D2E] selection:text-white">
        <AppShellProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileBottomNav />
          </div>
        </AppShellProvider>
      </body>
    </html>
  );
}
