import Link from 'next/link';
import { ArrowLeft, Phone, Star } from 'lucide-react';
import { ConsultationTriggerButton } from '@/components/sections/ConsultationTriggerButton';
import { ADVISORS, PROPERTIES } from '@/lib/properties';
import {
  formatNumberFa,
  formatScoreFa,
  getRealtorActiveListings,
  toPersianDigits,
} from '@/lib/propertyLogic';

export function AdvisorsSection() {
  const featuredAdvisors = ADVISORS.slice(0, 3);

  return (
    <section id="advisors" className="scroll-mt-20 border-t border-border bg-secondary/45 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-sm font-medium text-primary">تیم کارشناسی و حقوقی</p>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              مشاوران تخصصی شهرهای منتخب
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              هر پرونده ملکی توسط کارشناس مقیم همان محدوده از مرحله کارشناسی قیمت تا
              استعلام ثبتی و تنظیم قرارداد رسمی همراهی می‌شود.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/realtors"
              prefetch={false}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-5 text-sm font-semibold whitespace-nowrap text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <span>مشاهده همه مشاوران ({formatNumberFa(ADVISORS.length)})</span>
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
            <ConsultationTriggerButton
              label="گفتگو با کارشناس منطقه"
              className="h-11 px-6 text-sm font-semibold whitespace-nowrap bg-primary text-primary-foreground hover:bg-[#14523E]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredAdvisors.map((advisor) => {
            const activeCount = getRealtorActiveListings(advisor.id, PROPERTIES).length;
            return (
              <article
                key={advisor.id}
                className="flex flex-col justify-between gap-5 rounded-xl border border-border bg-white p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-white font-heading text-base font-bold">
                      {advisor.name.slice(0, 1)}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground tabular-nums">
                      <span className="inline-flex items-center gap-1 font-bold text-foreground">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                        {formatScoreFa(advisor.score)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {formatNumberFa(advisor.experienceYears)} سال سابقه ·{' '}
                        {formatNumberFa(activeCount)} آگهی فعال
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      <Link
                        href={`/realtors/${advisor.id}`}
                        prefetch={false}
                        className="text-right hover:text-primary transition-colors"
                      >
                        {advisor.name}
                      </Link>
                    </h3>
                    <p className="text-xs font-medium text-primary mt-0.5">
                      {advisor.city} · {advisor.role}
                    </p>
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {advisor.specialty}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
                  <Link
                    href={`/realtors/${advisor.id}`}
                    prefetch={false}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline underline-offset-4"
                  >
                    <span>مشاهده پروفایل</span>
                    <ArrowLeft className="size-3.5" aria-hidden="true" />
                  </Link>
                  <span
                    dir="ltr"
                    className="inline-flex items-center gap-1.5 font-semibold text-foreground tabular-nums"
                  >
                    <Phone className="size-3.5 text-primary" aria-hidden="true" />
                    {toPersianDigits(advisor.phone)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
