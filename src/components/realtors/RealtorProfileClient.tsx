'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageSquareQuote,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAppShell } from '@/hooks/useAppShell';
import { formatNumberFa, formatScoreFa, toPersianDigits } from '@/lib/propertyLogic';
import { Advisor, Property, TransactionType } from '@/types/property';

interface RealtorProfileClientProps {
  advisor: Advisor;
  activeListings: Property[];
}

const TRANSACTION_FILTERS: Array<{ value: TransactionType | 'all'; label: string }> = [
  { value: 'all', label: 'همه آگهی‌ها' },
  { value: 'buy', label: 'خرید' },
  { value: 'rent', label: 'رهن و اجاره' },
  { value: 'presale', label: 'پیش‌فروش' },
];

export function RealtorProfileClient({
  advisor,
  activeListings,
}: RealtorProfileClientProps) {
  const { favoriteIds, toggleFavorite, setConsultationOpen } = useAppShell();
  const [transactionFilter, setTransactionFilter] = useState<TransactionType | 'all'>('all');
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const visibleListings = useMemo(() => {
    if (transactionFilter === 'all') {
      return activeListings;
    }
    return activeListings.filter((item) => item.transactionType === transactionFilter);
  }, [activeListings, transactionFilter]);

  const breakdownRows = [
    { label: 'سرعت و کیفیت پاسخگویی', score: advisor.scoreBreakdown.responsiveness },
    { label: 'شفافیت کارشناسی قیمت', score: advisor.scoreBreakdown.priceTransparency },
    { label: 'دقت بررسی اسناد و قرارداد', score: advisor.scoreBreakdown.legalAccuracy },
  ];

  return (
    <article
      data-testid="realtor-profile-page"
      className="bg-white pb-20 lg:pb-16"
    >
      {/* Desktop & Tablet Top Breadcrumb Bar */}
      <div className="hidden md:block border-b border-border bg-secondary/35">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <nav
            aria-label="مسیر صفحه مشاور"
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Link href="/" prefetch={false} className="hover:text-primary transition-colors">
              ملک تو
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/realtors" prefetch={false} className="hover:text-primary transition-colors">
              مشاوران
            </Link>
            <span aria-hidden="true">/</span>
            <span>{advisor.city}</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-foreground">{advisor.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8 space-y-10">
        {/* Top Advisor Identity & Contact Hero */}
        <section className="rounded-xl border border-border bg-secondary/25 p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-white font-heading text-2xl sm:text-3xl font-extrabold">
                  {advisor.name.slice(0, 1)}
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-primary">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="size-4" aria-hidden="true" />
                      <span>کارشناس رسمی تاییدشده</span>
                    </span>
                    <span aria-hidden="true" className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground tabular-nums">
                      کد صنفی {toPersianDigits(advisor.licenseCode)}
                    </span>
                  </div>

                  <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                    {advisor.name}
                  </h1>
                  <p className="text-sm font-medium text-primary">{advisor.role}</p>
                </div>
              </div>

              <p className="text-sm sm:text-base leading-7 text-foreground/85 max-w-3xl">
                {advisor.bio}
              </p>

              {/* Contact & Territory Metadata */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs sm:text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-foreground">{advisor.city}</strong> ·{' '}
                    {advisor.suburbs.join('، ')}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-primary shrink-0" aria-hidden="true" />
                  <span>پاسخگویی: {advisor.responseTime}</span>
                </span>
                <a
                  href={`mailto:${advisor.email}`}
                  dir="ltr"
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                >
                  <Mail className="size-4 text-primary shrink-0" aria-hidden="true" />
                  <span>{advisor.email}</span>
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                نشانی دفتر: {advisor.officeAddress}
              </p>
            </div>

            {/* Direct Contact Action Column */}
            <div className="lg:col-span-4 flex flex-col gap-3 rounded-xl border border-border bg-white p-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>امتیاز رضایت مراجعین</span>
                <span className="inline-flex items-center gap-1 font-bold text-foreground tabular-nums">
                  <Star className="size-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                  <span>{formatScoreFa(advisor.score)} از ۵</span>
                </span>
              </div>

              <a
                href={`tel:${advisor.phone}`}
                className="flex min-h-[46px] w-full items-center justify-between rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#14523E]"
              >
                <span className="inline-flex items-center gap-2">
                  <Phone className="size-4" aria-hidden="true" />
                  <span>تماس مستقیم با مشاور</span>
                </span>
                <span dir="ltr" className="tabular-nums font-bold">
                  {toPersianDigits(advisor.phone)}
                </span>
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={() => setConsultationOpen(true)}
                className="min-h-[44px] w-full gap-2 text-sm font-semibold border-primary/25 text-primary hover:bg-[#EAF1ED]"
              >
                <MessageSquareText className="size-4" aria-hidden="true" />
                <span>ثبت درخواست مشاوره اختصاصی</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Split: Active Listings (Right / 8 cols) + Score & Reviews Trigger (Left / 4 cols) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Primary Right Column: Active Listings */}
          <section
            data-testid="realtor-active-listings"
            aria-labelledby="realtor-listings-heading"
            className="lg:col-span-8 space-y-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Building2 className="size-4" aria-hidden="true" />
                  <span>فایل‌های تحت مدیریت کارشناس</span>
                </div>
                <h2
                  id="realtor-listings-heading"
                  className="mt-1 font-heading text-2xl font-bold text-foreground"
                >
                  آگهی‌های فعال {advisor.name} ({formatNumberFa(activeListings.length)})
                </h2>
              </div>

              {activeListings.length > 1 && (
                <div
                  role="group"
                  aria-label="فیلتر نوع معامله آگهی‌های مشاور"
                  className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-border bg-secondary/35 p-1"
                >
                  {TRANSACTION_FILTERS.map((opt) => {
                    const isActive = transactionFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTransactionFilter(opt.value)}
                        className={`min-h-[38px] whitespace-nowrap rounded-md px-3 text-xs sm:text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground/75 hover:bg-white hover:text-primary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {visibleListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  در این نوع معامله در حال حاضر آگهی فعالی برای این مشاور ثبت نشده است.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTransactionFilter('all')}
                  className="min-h-[42px] px-4 text-xs font-semibold"
                >
                  نمایش همه آگهی‌های فعال ({formatNumberFa(activeListings.length)})
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {visibleListings.map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    property={listing}
                    isFavorite={favoriteIds.includes(listing.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Secondary Left Column: Sticky Score Card + Read All Reviews Trigger */}
          <aside
            data-testid="realtor-score-section"
            aria-labelledby="realtor-score-heading"
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-20 space-y-5 rounded-xl border border-border bg-white p-5 sm:p-6">
              <div className="space-y-1">
                <h2
                  id="realtor-score-heading"
                  className="font-heading text-lg font-bold text-foreground"
                >
                  امتیاز و ارزیابی مراجعین
                </h2>
                <p className="text-xs leading-5 text-muted-foreground">
                  بر اساس نظرسنجی پس از بازدید و عقد قرارداد رسمی
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/30 p-4">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">امتیاز کل</p>
                  <div className="mt-0.5 flex items-baseline gap-1.5 tabular-nums">
                    <span
                      data-testid="realtor-overall-score"
                      className="font-heading text-3xl font-extrabold text-primary"
                    >
                      {formatScoreFa(advisor.score)}
                    </span>
                    <span className="text-xs text-muted-foreground">از ۵</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                    {formatNumberFa(advisor.reviewCount)} نظر تاییدشده
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`امتیاز ${formatScoreFa(advisor.score)} از ۵`}
                  >
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`size-4 ${
                          starIndex <= Math.round(advisor.score)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-border'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <Award className="size-3.5" aria-hidden="true" />
                    <span>عملکرد ممتاز منطقه</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {breakdownRows.map((row) => {
                  const percent = Math.min(100, Math.round((row.score / 5) * 100));
                  return (
                    <div key={row.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{row.label}</span>
                        <span className="font-bold text-primary tabular-nums">
                          {formatScoreFa(row.score)} / ۵
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border rounded-lg border border-border bg-secondary/35 py-2.5 text-center tabular-nums">
                <div className="px-2">
                  <p className="font-heading text-sm font-bold text-primary">
                    {formatNumberFa(activeListings.length)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">آگهی فعال</p>
                </div>
                <div className="px-2">
                  <p className="font-heading text-sm font-bold text-foreground">
                    {formatNumberFa(advisor.closedDeals)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">معامله موفق</p>
                </div>
                <div className="px-2">
                  <p className="font-heading text-sm font-bold text-foreground">
                    {formatNumberFa(advisor.experienceYears)} سال
                  </p>
                  <p className="text-[11px] text-muted-foreground">سابقه کاری</p>
                </div>
              </div>

              <Separator />

              <Button
                type="button"
                variant="outline"
                onClick={() => setReviewsOpen(true)}
                data-testid="realtor-read-reviews-btn"
                className="min-h-[44px] w-full gap-2 border-primary/25 bg-[#EAF1ED]/55 text-xs sm:text-sm font-semibold text-primary hover:bg-primary hover:text-white"
              >
                <MessageSquareQuote className="size-4" aria-hidden="true" />
                <span>خواندن همه نظرات ({formatNumberFa(advisor.reviews.length)})</span>
              </Button>
            </div>
          </aside>
        </div>

        {/* All Client Reviews Dialog / Mobile Bottom Sheet */}
        <Dialog open={reviewsOpen} onOpenChange={setReviewsOpen}>
          <DialogContent
            data-testid="realtor-reviews-modal"
            className="max-h-[88vh] overflow-y-auto p-5 sm:max-w-xl sm:p-6 max-sm:top-auto max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-2xl max-sm:rounded-b-none"
          >
            <div className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-border sm:hidden" aria-hidden="true" />

            <DialogHeader className="pl-8 text-right">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Star className="size-4 fill-amber-500 text-amber-500" aria-hidden="true" />
                <span>
                  امتیاز {formatScoreFa(advisor.score)} از ۵ ({formatNumberFa(advisor.reviewCount)} ارزیابی تاییدشده)
                </span>
              </div>
              <DialogTitle className="font-heading text-xl font-bold text-foreground">
                نظرات مراجعین درباره {advisor.name}
              </DialogTitle>
              <DialogDescription>
                تجربه خریداران و مستاجران پس از بازدید و انجام معامله رسمی
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              {advisor.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <strong className="font-heading text-sm font-bold text-foreground">
                        {review.author}
                      </strong>
                      <span aria-hidden="true" className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {review.dealType} در {review.neighborhood}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs tabular-nums">
                      <span className="text-muted-foreground">{review.date}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-foreground">
                        <Star
                          className="size-3.5 fill-amber-500 text-amber-500"
                          aria-hidden="true"
                        />
                        {formatScoreFa(review.rating)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-foreground/85">{review.comment}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
}
