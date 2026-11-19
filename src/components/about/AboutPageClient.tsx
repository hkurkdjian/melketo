'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  Building2,
  CheckCircle2,
  FileCheck2,
  Phone,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { PropertyImage } from '@/components/properties/PropertyImage';
import { Button } from '@/components/ui/button';
import { useAppShell } from '@/hooks/useAppShell';
import { ADVISORS, PROPERTIES } from '@/lib/properties';
import { formatNumberFa } from '@/lib/propertyLogic';

const METHODOLOGY_STEPS = [
  {
    number: '۰۱.',
    title: 'احراز هویت مالک و بررسی فنی سند',
    description:
      'پیش از انتشار هر فایل در ملک تو، اصالت سند مالکیت، پایان‌کار، عدم بازداشتی و وکالت‌نامه‌ها توسط واحد حقوقی بررسی می‌شود.',
    icon: ShieldCheck,
  },
  {
    number: '۰۲.',
    title: 'کارشناسی قیمت بر پایه معاملات واقعی',
    description:
      'ارزش‌گذاری املاک نه بر اساس گمانه‌زنی، بلکه بر مبنای میانگین معاملات قطعی ۳۰ روز اخیر در همان محله و کیفیت ساخت انجام می‌گیرد.',
    icon: Building2,
  },
  {
    number: '۰۳.',
    title: 'مذاکره حرفه‌ای و تنظیم قرارداد با کد رهگیری',
    description:
      'تمامی جلسات نشست و مذاکره با حضور کارشناس ارشد منطقه و ناظر حقوقی برگزار شده و مبایعه‌نامه یا اجاره‌نامه رسمی صادر می‌گردد.',
    icon: Scale,
  },
  {
    number: '۰۴.',
    title: 'همراهی تا تحویل کلید و انتقال در دفترخانه',
    description:
      'از زمان امضای قرارداد تا تسویه مراحل بانکی، اخذ مفاصاحساب شهرداری و دارایی و انتقال سند قطعی در کنار خریدار و فروشنده هستیم.',
    icon: FileCheck2,
  },
] as const;

const CORE_VALUES = [
  'شفافیت کامل در اعلام متراژ سندی، سن بنا و وضعیت مشاعات',
  'حذف فایل‌های تکراری، صوری یا فاقد مستندات مالکیت',
  'تخصص محله‌محور مشاوران در مناطق ۱، ۲ و ۳ تهران، لواسان و کرج',
  'پشتیبانی حقوقی رایگان برای تمامی قراردادهای منعقدشده در مجموعه',
] as const;

export function AboutPageClient() {
  const { setConsultationOpen } = useAppShell();
  const featuredAdvisors = ADVISORS.slice(0, 4);

  return (
    <div className="bg-white pb-20 lg:pb-16">
      {/* Header Banner & Breadcrumb */}
      <section className="border-b border-border bg-[#F8F7F4]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <nav
            aria-label="مسیر صفحه"
            className="mb-4 flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Link href="/" prefetch={false} className="hover:text-primary transition-colors">
              ملک تو
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-foreground">درباره ما</span>
          </nav>

          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <p className="text-xs sm:text-sm font-semibold text-primary">
                داستان و استاندارد حرفه‌ای ملک تو
              </p>
              <h1 className="font-heading text-2xl font-extrabold leading-[1.3] text-foreground sm:text-4xl lg:text-[2.65rem] text-balance">
                مرجع تخصصی کارشناسی، معرفی و معاملات املاک شاخص
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-left">
              <p className="text-sm leading-7 text-muted-foreground">
                ترکیبی از دانش معماری، ارزیابی دقیق بازار و نظارت حقوقی برای تجربه‌ای امن در خرید، رهن و اجاره و پیش‌فروش املاک.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:space-y-20 lg:px-8 lg:py-16">
        {/* Section 1: Architectural Story Split */}
        <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                چرا «ملک تو» شکل گرفت؟
              </h2>
              <p className="text-sm sm:text-base leading-8 text-muted-foreground">
                سامانه تخصصی «ملک تو» با هدف ارتقای شفافیت و استانداردهای کارشناسی در بازار املاک مسکونی، ویلایی و اداری تأسیس شد. ما باور داریم انتخاب خانه یا فضای کسب‌وکار یکی از مهم‌ترین تصمیم‌های مالی و زندگی هر فرد است و نباید تحت تأثیر اطلاعات ناقص یا آگهی‌های غیرواقعی قرار گیرد.
              </p>
              <p className="text-sm sm:text-base leading-8 text-muted-foreground">
                تیم کارشناسان ما پیش از معرفی هر ملک، از محل پروژه بازدید حضوری به عمل آورده و کیفیت سازه، نورگیری، نقشه معماری، اصالت سند و قیمت پیشنهادی مالک را به صورت مستند ارزیابی می‌کنند.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F3F4F4] p-3.5 space-y-2.5">
              <p className="px-1 text-xs font-bold text-foreground">
                تعهدات چهارگانه ما به خریداران و مالکان:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {CORE_VALUES.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary sm:h-full">
              <PropertyImage
                src="/images/building_marble_lobby_1794933326343.jpg"
                alt="لابی مجلل سنگ مرمر در ساختمان‌های منتخب ملک تو"
                title="لابی و مشاعات استاندارد"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[4/3] w-full flex-1 overflow-hidden rounded-2xl bg-secondary">
                <PropertyImage
                  src="/images/hero_modern_residence_1794931346541.jpg"
                  alt="نمای معماری مدرن مسکونی در شمال تهران"
                  title="معماری مدرن مسکونی"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
              <div className="rounded-2xl bg-primary p-5 text-white space-y-2">
                <Award className="size-6 text-white/90" aria-hidden="true" />
                <p className="font-heading text-lg font-bold">
                  ۱۲ سال سابقه تخصصی در معاملات املاک ممتاز
                </p>
                <p className="text-xs leading-6 text-white/80">
                  پوشش متمرکز محله‌های الهیه، زعفرانیه، نیاوران، فرمانیه، شهرک غرب، لواسان و مهرشهر کرج.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Quantitative Proof Tray */}
        <section
          aria-label="آمار و عملکرد ملک تو"
          className="rounded-2xl bg-[#F3F4F4] p-3 sm:p-4"
        >
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tabular-nums">
                +{formatNumberFa(240)}
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground">
                فایل فعال و کارشناسی‌شده
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                بازدید حضوری و بررسی مدارک ثبتی
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tabular-nums">
                {formatNumberFa(ADVISORS.length)} نفر
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground">
                مشاور ارشد و ناظر حقوقی
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                متخصص در تفکیک محله و کاربری ملک
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tabular-nums">
                ۹۸٪
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground">
                رضایت خریداران و مالکان
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                بر اساس نظرسنجی قراردادهای سال اخیر
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tabular-nums">
                {formatNumberFa(PROPERTIES.length)} نمونه
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground">
                پروژه شاخص آماده بازدید
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                خرید، رهن و اجاره و پیش‌فروش
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: 4-Step Methodology */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                فرآیند چهارمرحله‌ای ارزیابی و معامله در ملک تو
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                هر معامله در چارچوب استاندارد حقوقی و فنی گام‌به‌گام مدیریت می‌شود.
              </p>
            </div>
            <Link
              href="/buy"
              prefetch={false}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              <span>مشاهده فایل‌های خرید</span>
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-2xl bg-[#F3F4F4] p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {METHODOLOGY_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-heading text-lg font-extrabold text-primary tabular-nums">
                        {step.number}
                      </span>
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#EAF1ED] text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Senior Advisory Team Preview & CTA */}
        <section className="rounded-2xl bg-[#F3F4F4] p-4 sm:p-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                همراهی مشاوران ارشد منطقه
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                کارشناسان ما با شناخت دقیق هر خیابان و سازنده، بهترین گزینه‌ها را متناسب با بودجه شما معرفی می‌کنند.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/realtors"
                prefetch={false}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-xs sm:text-sm font-semibold text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:text-primary"
              >
                <Users className="size-4 text-primary" aria-hidden="true" />
                <span>مشاهده همه مشاوران</span>
              </Link>
              <Link
                href="/contact"
                prefetch={false}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#14523E]"
              >
                <Phone className="size-4" aria-hidden="true" />
                <span>تماس با دفاتر ما</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredAdvisors.map((advisor) => (
              <Link
                key={advisor.id}
                href={`/realtors/${advisor.id}`}
                prefetch={false}
                className="group flex flex-col justify-between gap-3 rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF1ED] font-heading text-sm font-bold text-primary">
                    {advisor.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('‌')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {advisor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{advisor.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs text-muted-foreground tabular-nums">
                  <span>{advisor.city}</span>
                  <span>{formatNumberFa(advisor.experienceYears)} سال سابقه</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="font-heading text-base font-bold text-foreground">
                قصد فروش، اجاره یا کارشناسی ملک خود را دارید؟
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                کارشناسان ارشد ملک تو در کمتر از ۲۴ ساعت ارزیابی مستند ملک شما را ارائه می‌دهند.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setConsultationOpen(true)}
              className="h-11 rounded-xl bg-primary px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[#14523E] whitespace-nowrap shrink-0"
            >
              ثبت درخواست کارشناسی رایگان
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
