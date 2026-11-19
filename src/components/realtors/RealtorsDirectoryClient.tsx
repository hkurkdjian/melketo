'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  RotateCcw,
  Search,
  Star,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAppShell } from '@/hooks/useAppShell';
import {
  filterAdvisorsByCity,
  formatNumberFa,
  formatScoreFa,
  getAvailableAdvisorCities,
  getRealtorActiveListings,
  toPersianDigits,
} from '@/lib/propertyLogic';
import { Advisor, Property } from '@/types/property';

interface RealtorsDirectoryClientProps {
  advisors: Advisor[];
  properties: Property[];
}

export function RealtorsDirectoryClient({
  advisors,
  properties,
}: RealtorsDirectoryClientProps) {
  const { setConsultationOpen } = useAppShell();
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const availableCities = useMemo(() => getAvailableAdvisorCities(advisors), [advisors]);

  const filteredAdvisors = useMemo(
    () => filterAdvisorsByCity(advisors, selectedCity, searchQuery),
    [advisors, selectedCity, searchQuery]
  );

  const handleReset = () => {
    setSelectedCity('all');
    setSearchQuery('');
  };

  return (
    <section
      data-testid="realtors-directory-page"
      className="bg-white pb-20 lg:pb-16"
    >
      {/* Top Directory Header */}
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary">
                <UserCheck className="size-4" aria-hidden="true" />
                <span>مشاوران تاییدشده سامانه ملک تو</span>
              </div>
              <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl lg:text-4xl">
                فهرست کامل مشاوران تخصصی املاک
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="rounded-xl border border-border bg-white px-4 py-2.5 text-xs sm:text-sm tabular-nums">
                <span className="text-muted-foreground">تعداد مشاوران فعال: </span>
                <strong className="font-heading font-bold text-primary">
                  {formatNumberFa(filteredAdvisors.length)} کارشناس
                </strong>
              </div>
              <Button
                type="button"
                onClick={() => setConsultationOpen(true)}
                className="min-h-[44px] gap-2 px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-[#14523E]"
              >
                <MessageSquareText className="size-4" aria-hidden="true" />
                <span>درخواست مشاوره اختصاصی</span>
              </Button>
            </div>
          </div>

          {/* City Segmented Filter Tabs & Quick Search */}
          <div className="flex flex-col gap-2.5 rounded-2xl bg-[#F3F4F4] p-2.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-1.5 text-xs font-semibold text-muted-foreground">
                شهر فعالیت:
              </span>
              <div
                data-testid="realtors-city-filter"
                role="tablist"
                aria-label="فیلتر مشاوران بر اساس شهر"
                className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-black/[0.06] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCity === 'all'}
                  onClick={() => setSelectedCity('all')}
                  className={`min-h-[36px] whitespace-nowrap rounded-lg px-3.5 text-xs sm:text-sm transition-all tabular-nums ${
                    selectedCity === 'all'
                      ? 'bg-white font-bold text-primary shadow-xs ring-1 ring-primary/25'
                      : 'font-medium text-foreground/75 hover:bg-white/50 hover:text-foreground'
                  }`}
                >
                  همه شهرها ({formatNumberFa(advisors.length)})
                </button>
                {availableCities.map((city) => {
                  const isActive = selectedCity === city;
                  const count = advisors.filter((a) => a.city === city).length;
                  return (
                    <button
                      key={city}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCity(city)}
                      className={`min-h-[36px] whitespace-nowrap rounded-lg px-3.5 text-xs sm:text-sm transition-all tabular-nums ${
                        isActive
                          ? 'bg-white font-bold text-primary shadow-xs ring-1 ring-primary/25'
                          : 'font-medium text-foreground/75 hover:bg-white/50 hover:text-foreground'
                      }`}
                    >
                      {city} ({formatNumberFa(count)})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="realtors-search-input"
                placeholder="جستجوی نام مشاور یا محله..."
                aria-label="جستجوی نام مشاور یا محله"
                className="min-h-[40px] rounded-xl border border-border/80 bg-white pr-10 text-sm shadow-none placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Realtors Cards Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        {filteredAdvisors.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-secondary/35 px-6 py-16 text-center">
            <UserCheck className="size-10 text-primary/70" strokeWidth={1.5} />
            <div className="space-y-1.5">
              <h2 className="font-heading text-xl font-bold text-foreground">
                مشاوری با فیلتر انتخابی یافت نشد
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                می‌توانید شهر دیگری را انتخاب کنید یا عبارت جستجو را پاک‌سازی نمایید.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="min-h-[44px] gap-2 px-5 text-sm font-medium border-primary/30 text-primary hover:bg-primary hover:text-white"
            >
              <RotateCcw className="size-4" />
              <span>نمایش همه مشاوران</span>
            </Button>
          </div>
        ) : (
          <div
            data-testid="realtors-directory-grid"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredAdvisors.map((advisor) => {
              const activeListings = getRealtorActiveListings(advisor.id, properties);
              const profileHref = `/realtors/${advisor.id}`;

              return (
                <article
                  key={advisor.id}
                  data-testid={`realtor-directory-card-${advisor.id}`}
                  className="flex flex-col justify-between rounded-xl border border-border bg-white p-5 sm:p-6 transition-shadow hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* 1. Summary Info Header */}
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-heading text-lg font-bold">
                        {advisor.name.slice(0, 1)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="inline-flex min-w-0 items-center gap-1.5 font-heading text-lg font-bold text-foreground">
                            <BadgeCheck
                              className="size-5 shrink-0 text-primary"
                              aria-label="مشاور تاییدشده"
                            />
                            <Link
                              href={profileHref}
                              prefetch={false}
                              className="truncate text-right hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                            >
                              {advisor.name}
                            </Link>
                          </h2>
                          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-foreground tabular-nums">
                            <Star
                              className="size-3.5 fill-amber-500 text-amber-500"
                              aria-hidden="true"
                            />
                            <span>{formatScoreFa(advisor.score)}</span>
                            <span className="font-normal text-muted-foreground">
                              ({formatNumberFa(advisor.reviewCount)})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* City & Suburbs Metadata */}
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                      <p className="leading-5">
                        <strong className="font-semibold text-foreground">{advisor.city}</strong>
                        <span aria-hidden="true"> · </span>
                        <span>{advisor.suburbs.join('، ')}</span>
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm leading-6 text-muted-foreground line-clamp-2">
                      {advisor.specialty}
                    </p>

                    {/* Key Summary Metrics */}
                    <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border rounded-lg border border-border bg-secondary/35 py-2.5 text-center tabular-nums">
                      <div className="px-2">
                        <p className="font-heading text-sm font-bold text-primary">
                          {formatNumberFa(activeListings.length)} فایل
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
                  </div>

                  {/* Contacts & Profile Actions */}
                  <div className="mt-5 space-y-3">
                    <Separator />

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <a
                        href={`tel:${advisor.phone}`}
                        dir="ltr"
                        className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary tabular-nums"
                      >
                        <Phone className="size-3.5 text-primary" aria-hidden="true" />
                        <span>{toPersianDigits(advisor.phone)}</span>
                      </a>
                      <a
                        href={`mailto:${advisor.email}`}
                        dir="ltr"
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary truncate max-w-[170px]"
                      >
                        <Mail className="size-3.5 text-primary shrink-0" aria-hidden="true" />
                        <span className="truncate">{advisor.email}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={profileHref}
                        prefetch={false}
                        data-testid={`realtor-profile-btn-${advisor.id}`}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs sm:text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#14523E]"
                      >
                        <span>مشاهده پروفایل و امتیاز</span>
                        <ArrowLeft className="size-4" aria-hidden="true" />
                      </Link>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConsultationOpen(true)}
                        aria-label={`ارسال پیام مشاوره به ${advisor.name}`}
                        className="min-h-[44px] px-3 text-xs font-semibold border-primary/25 text-primary hover:bg-[#EAF1ED]"
                      >
                        <MessageSquareText className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
