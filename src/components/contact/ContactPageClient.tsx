'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  LocateFixed,
  Mail,
  MapPin,
  MessageSquareText,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toPersianDigits } from '@/lib/propertyLogic';

interface OfficeBranch {
  id: string;
  title: string;
  city: string;
  address: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  hours: string;
  lat: number;
  lng: number;
  mainStreet: string;
  crossStreet: string;
}

const OFFICE_BRANCHES: OfficeBranch[] = [
  {
    id: 'tehran-elahieh',
    title: 'دفتر مرکزی الهیه تهران',
    city: 'تهران',
    address: 'تهران، الهیه، خیابان فرشته (شهید فیاضی)، نبش خیابان چناران، پلاک ۴۲، طبقه ۴',
    phoneDisplay: '۰۲۱ - ۲۲۶۵۸۴۰۰',
    phoneTel: '02122658400',
    email: 'central@melkto.ir',
    hours: 'شنبه تا چهارشنبه ۹:۰۰ الی ۲۰:۰۰ — پنجشنبه‌ها ۹:۰۰ الی ۱۶:۰۰',
    lat: 35.7914,
    lng: 51.4258,
    mainStreet: 'خیابان فرشته (فیاضی)',
    crossStreet: 'خیابان چناران',
  },
  {
    id: 'tehran-niavaran',
    title: 'شعبه نیاوران و فرمانیه',
    city: 'تهران',
    address: 'تهران، چهارراه کامرانیه، ابتدای خیابان باهنر (نیاوران)، ساختمان اطلس، طبقه ۲',
    phoneDisplay: '۰۲۱ - ۲۲۸۰۹۱۰۰',
    phoneTel: '02122809100',
    email: 'niavaran@melkto.ir',
    hours: 'شنبه تا پنجشنبه ۹:۳۰ الی ۱۹:۳۰',
    lat: 35.8086,
    lng: 51.4625,
    mainStreet: 'خیابان باهنر (نیاوران)',
    crossStreet: 'بلوار کامرانیه شمالی',
  },
  {
    id: 'lavasan-branch',
    title: 'دفتر لواسان و شمیرانات',
    city: 'لواسان',
    address: 'لواسان، بلوار امام خمینی، روبه‌روی خیابان باستی، پلاک ۱۱۸',
    phoneDisplay: '۰۲۱ - ۲۶۵۴۳۲۰۰',
    phoneTel: '02126543200',
    email: 'lavasan@melkto.ir',
    hours: 'همه‌روزه حتی ایام تعطیل ۱۰:۰۰ الی ۱۹:۰۰',
    lat: 35.8235,
    lng: 51.6412,
    mainStreet: 'بلوار امام خمینی لواسان',
    crossStreet: 'ورودی باستی‌هیلز',
  },
  {
    id: 'karaj-mehrshahr',
    title: 'دفتر مهرشهر کرج',
    city: 'کرج',
    address: 'کرج، مهرشهر، فاز ۱، بلوار شهرداری، بین خیابان ۱۰fd و ۱۱۱، پلاک ۶۴'.replace('10fd', '۱۰۹'),
    phoneDisplay: '۰۲۶ - ۳۳۴۱۸۵۰۰',
    phoneTel: '02633418500',
    email: 'mehrshahr@melkto.ir',
    hours: 'شنبه تا پنجشنبه ۹:۳۰ الی ۲۰:۰۰',
    lat: 35.8032,
    lng: 50.9045,
    mainStreet: 'بلوار شهرداری مهرشهر',
    crossStreet: 'خیابان ۱۰۹ شرقی',
  },
];

const SUBJECT_OPTIONS = [
  'مشاوره خرید ملک',
  'رهن و اجاره مسکونی یا اداری',
  'پیش‌فروش و سرمایه‌گذاری',
  'ثبت و کارشناسی ملک من',
] as const;

export function ContactPageClient() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(OFFICE_BRANCHES[0].id);
  const [mapZoom, setMapZoom] = useState(1);

  const [subject, setSubject] = useState<string>(SUBJECT_OPTIONS[0]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('تهران');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const activeBranch =
    OFFICE_BRANCHES.find((b) => b.id === selectedBranchId) ?? OFFICE_BRANCHES[0];

  const osmUrl = `https://www.openstreetmap.org/?mlat=${activeBranch.lat}&mlon=${activeBranch.lng}#map=16/${activeBranch.lat}/${activeBranch.lng}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const normalizedPhone = phone
      .trim()
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      .replace(/[\s-]/g, '');

    if (trimmedName.length < 3) {
      setErrorMessage('لطفاً نام و نام خانوادگی خود را به صورت کامل وارد کنید.');
      return;
    }

    if (!/^(\+98|0)?9\d{9}$/.test(normalizedPhone) && !/^0\d{10}$/.test(normalizedPhone)) {
      setErrorMessage('لطفاً شماره موبایل یا تلفن معتبر (مثلاً ۰۹۱۲۱۲۳۴۵۶۷) وارد کنید.');
      return;
    }

    if (message.trim().length < 8) {
      setErrorMessage('لطفاً توضیح کوتاهی درباره درخواست یا مشخصات ملک مورد نظر بنویسید.');
      return;
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setSubmittedCode(`MT-${toPersianDigits(1405)}-${toPersianDigits(randomCode)}`);
  };

  const handleResetForm = () => {
    setSubmittedCode(null);
    setFullName('');
    setPhone('');
    setMessage('');
    setErrorMessage(null);
  };

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
            <span className="font-semibold text-foreground">تماس با ما</span>
          </nav>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-primary">
                پاسخگویی مستقیم کارشناسان و واحد حقوقی
              </p>
              <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-4xl lg:text-[2.65rem]">
                ارتباط با دفاتر و کارشناسان ملک تو
              </h1>
            </div>

            <a
              href={`tel:${activeBranch.phoneTel}`}
              dir="ltr"
              className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-white px-4 text-sm font-bold text-primary shadow-[0_1px_2px_rgba(0,0,0,0.05)] tabular-nums transition-colors hover:bg-primary hover:text-white md:self-auto"
            >
              <Phone className="size-4" aria-hidden="true" />
              <span>{activeBranch.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main 2-Column Split Layout */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Right Column in RTL: Office Branches & Interactive Map */}
          <div className="space-y-6 lg:col-span-6">
            <div className="rounded-2xl bg-[#F3F4F4] p-3.5 space-y-3">
              <div className="px-1.5 py-1">
                <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">
                  دفاتر حضوری ملک تو
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  شعبه مورد نظر خود را برای مشاهده نشانی، تلفن مستقیم و موقعیت روی نقشه انتخاب کنید.
                </p>
              </div>

              {/* Branch Selector Tiles */}
              <div
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                role="tablist"
                aria-label="انتخاب شعبه ملک تو"
              >
                {OFFICE_BRANCHES.map((branch) => {
                  const isSelected = branch.id === activeBranch.id;
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedBranchId(branch.id);
                        setCity(branch.city);
                      }}
                      className={`flex flex-col items-start gap-1 rounded-xl p-3.5 text-right transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                          : 'bg-white text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:text-primary'
                      }`}
                    >
                      <span className="font-heading text-sm font-bold">{branch.title}</span>
                      <span
                        dir="ltr"
                        className={`text-xs tabular-nums ${
                          isSelected ? 'text-white/85' : 'text-muted-foreground'
                        }`}
                      >
                        {branch.phoneDisplay}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Branch Details Card */}
              <div className="rounded-xl bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1ED] text-primary">
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">نشانی دقیق</p>
                    <p className="text-xs sm:text-sm font-medium leading-7 text-foreground">
                      {activeBranch.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 border-t border-border/60 pt-3.5 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1ED] text-primary">
                      <Phone className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[11px] text-muted-foreground">تلفن مستقیم</p>
                      <a
                        href={`tel:${activeBranch.phoneTel}`}
                        dir="ltr"
                        className="text-xs sm:text-sm font-bold text-foreground hover:text-primary tabular-nums"
                      >
                        {activeBranch.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1ED] text-primary">
                      <Mail className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[11px] text-muted-foreground">پست الکترونیک</p>
                      <a
                        href={`mailto:${activeBranch.email}`}
                        dir="ltr"
                        className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary"
                      >
                        {activeBranch.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-border/60 pt-3.5">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1ED] text-primary">
                    <Clock className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] text-muted-foreground">ساعات مراجعه و پاسخگویی</p>
                    <p className="text-xs sm:text-sm font-medium text-foreground tabular-nums">
                      {activeBranch.hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Office Vector Map */}
              <div className="rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground">
                    موقعیت {activeBranch.title} روی نقشه
                  </span>
                  <a
                    href={osmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
                  >
                    <span>مسیریابی در نقشه</span>
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div className="relative h-60 w-full overflow-hidden rounded-xl border border-border bg-[#F4F7F5]">
                  <div
                    className="relative h-full w-full transition-transform duration-300 ease-out"
                    style={{
                      transform: `scale(${mapZoom})`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <svg
                      viewBox="0 0 800 420"
                      className="h-full w-full"
                      preserveAspectRatio="xMidYMid slice"
                      aria-hidden="true"
                    >
                      <rect width="800" height="420" fill="#F3F6F4" />
                      <g fill="#E8EEEA" stroke="#DCE5DF" strokeWidth="1.5">
                        <rect x="40" y="30" width="170" height="110" rx="8" />
                        <rect x="250" y="30" width="210" height="110" rx="8" />
                        <rect x="500" y="30" width="250" height="110" rx="8" />
                        <rect x="40" y="175" width="170" height="100" rx="8" />
                        <rect x="250" y="175" width="210" height="100" rx="8" />
                        <rect x="500" y="175" width="250" height="100" rx="8" />
                        <rect x="40" y="305" width="290" height="85" rx="8" />
                        <rect x="370" y="305" width="380" height="85" rx="8" />
                      </g>
                      <g stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round">
                        <line x1="230" y1="0" x2="230" y2="420" />
                        <line x1="480" y1="0" x2="480" y2="420" />
                        <line x1="0" y1="158" x2="800" y2="158" />
                        <line x1="0" y1="290" x2="800" y2="290" />
                      </g>
                    </svg>

                    <div className="pointer-events-none absolute top-3 right-3 rounded bg-white/90 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-2xs">
                      {activeBranch.mainStreet}
                    </div>
                    <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-white/90 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-2xs">
                      {activeBranch.crossStreet}
                    </div>

                    <div
                      style={{ left: '50%', top: '50%' }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-4 flex flex-col items-center"
                    >
                      <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg">
                        <Building2 className="size-5" aria-hidden="true" />
                      </div>
                      <div className="mt-1.5 whitespace-nowrap rounded-lg border border-primary/30 bg-white/95 px-2.5 py-1 text-center shadow-md">
                        <p className="font-heading text-xs font-bold text-primary">
                          {activeBranch.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 z-30 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setMapZoom((z) => Math.min(1.5, Number((z + 0.2).toFixed(2))))}
                      aria-label="بزرگنمایی نقشه"
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-white/95 text-foreground hover:bg-primary hover:text-white"
                    >
                      <Plus className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapZoom((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))}
                      aria-label="کوچک‌نمایی نقشه"
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-white/95 text-foreground hover:bg-primary hover:text-white"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapZoom(1)}
                      aria-label="بازنشانی نقشه"
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-white/95 text-foreground hover:bg-primary hover:text-white"
                    >
                      <LocateFixed className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column in RTL: Validated Contact & Evaluation Request Form */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-[#F3F4F4] p-3.5 sm:p-4 space-y-3">
              <div className="px-1.5 py-1">
                <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">
                  فرم ارسال پیام و درخواست مشاوره
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  درخواست خود را ثبت کنید تا کارشناس تخصصی همان منطقه در کمتر از ۳۰ دقیقه با شما تماس بگیرد.
                </p>
              </div>

              {submittedCode ? (
                <div
                  data-testid="contact-form-success"
                  className="rounded-xl bg-white p-6 sm:p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4"
                >
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EAF1ED] text-primary">
                    <CheckCircle2 className="size-7" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      پیام شما با موفقیت ثبت شد
                    </h3>
                    <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
                      کارشناسان دفتر {city} ملک تو به‌زودی با شماره{' '}
                      <span dir="ltr" className="font-bold text-foreground tabular-nums">
                        {toPersianDigits(phone)}
                      </span>{' '}
                      تماس خواهند گرفت.
                    </p>
                  </div>

                  <div className="mx-auto max-w-xs rounded-xl bg-[#F3F4F4] px-4 py-3 text-xs space-y-1">
                    <span className="text-muted-foreground block">کد پیگیری درخواست:</span>
                    <span
                      dir="ltr"
                      className="font-heading text-sm font-extrabold text-primary tabular-nums"
                    >
                      {submittedCode}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetForm}
                    className="h-10 gap-1.5 rounded-xl px-5 text-xs font-semibold"
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    <span>ثبت پیام جدید</span>
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  data-testid="contact-page-form"
                  className="space-y-3"
                  noValidate
                >
                  {/* Subject Selector Card */}
                  <div className="rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2">
                    <Label
                      htmlFor="contact-subject"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <MessageSquareText className="size-3.5 text-primary" aria-hidden="true" />
                      <span>موضوع درخواست</span>
                    </Label>
                    <Select
                      value={subject}
                      onValueChange={(v) => setSubject(v ?? SUBJECT_OPTIONS[0])}
                    >
                      <SelectTrigger
                        id="contact-subject"
                        className="h-11 data-[size=default]:h-11 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
                      >
                        <SelectValue>{subject}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECT_OPTIONS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact Inputs Card */}
                  <div className="rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-name" className="text-xs font-semibold">
                          نام و نام خانوادگی *
                        </Label>
                        <Input
                          id="contact-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="مثلاً آرش رحیمی"
                          className="h-11 rounded-lg border-transparent bg-[#F3F4F4] text-sm focus-visible:border-border focus-visible:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="contact-phone" className="text-xs font-semibold">
                          شماره تماس (موبایل یا ثابت) *
                        </Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          dir="ltr"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="09121234567"
                          className="h-11 rounded-lg border-transparent bg-[#F3F4F4] text-left text-sm tabular-nums focus-visible:border-border focus-visible:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-city" className="text-xs font-semibold">
                        شهر یا شعبه مورد نظر
                      </Label>
                      <Select value={city} onValueChange={(v) => setCity(v ?? 'تهران')}>
                        <SelectTrigger
                          id="contact-city"
                          className="h-11 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
                        >
                          <SelectValue>{city}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="تهران">تهران (الهیه، زعفرانیه، نیاوران، شهرک غرب)</SelectItem>
                          <SelectItem value="لواسان">لواسان و شمیرانات</SelectItem>
                          <SelectItem value="کرج">کرج (مهرشهر)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-message" className="text-xs font-semibold">
                        توضیحات درخواست یا مشخصات ملک *
                      </Label>
                      <Textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="محله مورد نظر، بودجه تقریبی، متراژ یا مشخصات ملک خود را بنویسید..."
                        className="rounded-lg border-transparent bg-[#F3F4F4] text-sm leading-7 focus-visible:border-border focus-visible:bg-white"
                      />
                    </div>

                    {errorMessage && (
                      <p
                        role="alert"
                        className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
                      >
                        {errorMessage}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="h-11 w-full gap-2 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-[#14523E]"
                    >
                      <Send className="size-4" aria-hidden="true" />
                      <span>ارسال درخواست به کارشناس</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
