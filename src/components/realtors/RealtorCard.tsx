'use client';

import Link from 'next/link';
import { ArrowLeft, BadgeCheck, CalendarCheck, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatScoreFa, toPersianDigits } from '@/lib/propertyLogic';
import { Advisor } from '@/types/property';

interface RealtorCardProps {
  advisor: Advisor;
  onOpenVisitModal: () => void;
}

export function RealtorCard({ advisor, onOpenVisitModal }: RealtorCardProps) {
  return (
    <aside
      data-testid="realtor-card"
      className="space-y-5 rounded-xl border border-border bg-white p-5 sm:p-6 shadow-xs"
    >
      {/* Advisor Identity Header */}
      <div className="flex items-start gap-3.5">
        <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-heading text-xl font-bold">
          {advisor.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="inline-flex min-w-0 items-center gap-1.5 font-heading text-lg font-bold text-foreground">
              <BadgeCheck
                className="size-5 shrink-0 text-primary"
                aria-label="کارشناس تاییدشده"
              />
              <span className="truncate">{advisor.name}</span>
            </h2>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-foreground tabular-nums">
              <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
              {formatScoreFa(advisor.score)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{advisor.role}</p>
        </div>
      </div>

      <Separator />

      {/* Action Buttons: Visit Modal + Direct Call + View Active Listings */}
      <div className="space-y-2.5">
        <Button
          type="button"
          onClick={onOpenVisitModal}
          data-testid="realtor-book-visit-btn"
          className="min-h-[46px] w-full gap-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-[#14523E]"
        >
          <CalendarCheck className="size-4" aria-hidden="true" />
          <span>هماهنگی بازدید حضوری</span>
        </Button>

        <a
          href={`tel:${advisor.phone}`}
          className="flex min-h-[44px] w-full items-center justify-between rounded-lg border border-primary/25 bg-[#EAF1ED]/60 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <span className="inline-flex items-center gap-2">
            <Phone className="size-4" aria-hidden="true" />
            <span>تماس مستقیم با مشاور</span>
          </span>
          <span dir="ltr" className="tabular-nums font-bold">
            {toPersianDigits(advisor.phone)}
          </span>
        </a>

        <Link
          href={`/realtors/${advisor.id}`}
          prefetch={false}
          data-testid="realtor-card-view-profile"
          className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-primary transition-colors hover:bg-[#EAF1ED]/70"
        >
          <span>مشاهده آگهی‌های فعال</span>
          <ArrowLeft className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
