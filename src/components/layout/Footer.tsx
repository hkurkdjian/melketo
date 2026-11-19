'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { useAppShell } from '@/hooks/useAppShell';

export function Footer() {
  const { setConsultationOpen } = useAppShell();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-white text-foreground pb-20 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8 lg:pt-16 lg:pb-10">
        {/* Top Row: Clean Brand Mark */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            prefetch={false}
            aria-label="ملک تو"
            className="inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="relative block h-11 aspect-[1280/905]">
              <Image
                src="/assets/aistudio/logo__1__8e650d40.jpg"
                alt="ملک تو"
                fill
                sizes="120px"
                className="object-contain"
              />
            </span>
          </Link>
        </div>

        {/* Middle 4-Column Architectural Link Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
          <ul className="space-y-3 text-sm font-medium text-foreground">
            <li>
              <Link
                href="/buy"
                prefetch={false}
                className="transition-colors hover:text-primary"
              >
                فایل‌های خرید و فروش
              </Link>
            </li>
            <li>
              <Link
                href="/rent"
                prefetch={false}
                className="transition-colors hover:text-primary"
              >
                رهن و اجاره مسکونی و اداری
              </Link>
            </li>
            <li>
              <Link
                href="/presale"
                prefetch={false}
                className="transition-colors hover:text-primary"
              >
                پروژه‌های پیش‌فروش برند
              </Link>
            </li>
          </ul>

          <ul className="space-y-3 text-sm font-medium text-foreground">
            <li>
              <Link
                href="/realtors"
                prefetch={false}
                className="transition-colors hover:text-primary"
              >
                فهرست مشاوران تخصصی
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                prefetch={false}
                className="transition-colors hover:text-primary"
              >
                درباره ملک تو
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                prefetch={false}
                className="transition-colors hover:text-primary"
              >
                تماس با ما و شعب
              </Link>
            </li>
          </ul>

          <ul className="space-y-3 text-sm font-medium text-foreground">
            <li>
              <Link
                href="/buy"
                prefetch={false}
                className="transition-colors hover:text-primary"
              >
                الهیه، زعفرانیه و قیطریه
              </Link>
            </li>
            <li>
              <Link
                href="/presale"
                prefetch={false}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                نیاوران، فرمانیه و ولنجک
              </Link>
            </li>
            <li>
              <Link
                href="/rent"
                prefetch={false}
                className="transition-colors hover:text-primary"
              >
                جردن و شهرک غرب
              </Link>
            </li>
          </ul>

          <ul className="space-y-3 text-sm font-medium text-foreground">
            <li className="text-muted-foreground leading-6">
              تهران، الهیه، خیابان فرشته، پلاک ۴۲
            </li>
            <li>
              <a
                href="tel:02122658400"
                dir="ltr"
                className="inline-block tabular-nums transition-colors hover:text-primary"
              >
                ۰۲۱ - ۲۲۶۵۸۴۰۰
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setConsultationOpen(true)}
                className="text-right transition-colors hover:text-primary"
              >
                ثبت درخواست کارشناسی
              </button>
            </li>
          </ul>
        </div>

        {/* Horizontal Dotted Divider */}
        <div
          aria-hidden="true"
          className="my-10 border-t-2 border-dotted border-foreground/20"
        />

        {/* Bottom Legal, Social Links & Scroll-to-Top Square */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span>© ۱۴۰۵ سامانه املاک ملک تو</span>
            <Link href="/about" prefetch={false} className="hover:text-foreground transition-colors">
              درباره ما
            </Link>
            <Link href="/contact" prefetch={false} className="hover:text-foreground transition-colors">
              تماس با ما
            </Link>
            <Link href="/realtors" prefetch={false} className="hover:text-foreground transition-colors">
              احراز هویت مشاوران
            </Link>
            <span>کد رهگیری رسمی</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <span className="font-semibold text-foreground">شبکه‌های ارتباطی:</span>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  setConsultationOpen(true);
                }}
                className="font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                اینستاگرام
              </a>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  setConsultationOpen(true);
                }}
                className="font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                لینکدین
              </a>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  setConsultationOpen(true);
                }}
                className="font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                تلگرام
              </a>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  setConsultationOpen(true);
                }}
                className="font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                واتساپ
              </a>
            </div>

            <button
              type="button"
              onClick={handleScrollTop}
              aria-label="بازگشت به بالای صفحه"
              title="بازگشت به بالای صفحه"
              data-testid="footer-scroll-top"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1A1C1B] text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
