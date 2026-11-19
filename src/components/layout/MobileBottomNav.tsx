'use client';

import {
  Bookmark,
  Building2,
  CalendarCheck,
  MessageSquareText,
  Phone,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { useAppShell } from '@/hooks/useAppShell';
import { ADVISORS } from '@/lib/properties';
import { formatPriceToman, toPersianDigits } from '@/lib/propertyLogic';

export function MobileBottomNav() {
  const {
    activeProperty,
    favoriteProperties,
    activeFilterCount,
    user,
    exploreListings,
    openMobileFilters,
    setFavoritesOpen,
    setConsultationOpen,
    setAuthOpen,
    setVisitModalOpen,
  } = useAppShell();

  const favoritesCount = favoriteProperties.length;
  const isLoggedIn = user !== null;

  if (activeProperty) {
    const advisor =
      ADVISORS.find((a) => a.id === activeProperty.advisorId) ?? ADVISORS[0];
    const isRent = activeProperty.transactionType === 'rent';

    return (
      <div
        data-testid="mobile-property-cta-bar"
        role="region"
        aria-label="نوار اقدام سریع ملک"
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-between gap-3 border-t border-border bg-white/95 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden"
      >
        {/* Price Summary */}
        <div className="min-w-0 flex-1 tabular-nums">
          {isRent ? (
            <>
              <p className="text-[11px] text-muted-foreground truncate">
                رهن {formatPriceToman(activeProperty.depositMillion ?? 0)}
              </p>
              <p className="font-heading text-sm font-bold text-primary truncate">
                اجاره {formatPriceToman(activeProperty.monthlyRentMillion ?? 0)}
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] text-muted-foreground">ارزش کارشناسی</p>
              <p className="font-heading text-sm sm:text-base font-extrabold text-primary truncate">
                {formatPriceToman(activeProperty.priceMillion ?? 0)}
              </p>
            </>
          )}
        </div>

        {/* Thumb-Zone CTAs (>= 44x44px) */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${advisor.phone}`}
            aria-label="تماس مستقیم با مشاور"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg border border-primary/25 bg-[#EAF1ED]/70 px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-white"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">تماس</span>
          </a>

          <button
            type="button"
            onClick={() => setVisitModalOpen(true)}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#14523E]"
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            <span>هماهنگی بازدید</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <nav
      data-testid="mobile-bottom-nav"
      aria-label="ناوبری پایین صفحه"
      className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-border bg-white/95 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden"
    >
      <button
        type="button"
        onClick={exploreListings}
        className="flex min-h-[48px] flex-col items-center justify-center gap-1 text-[10.5px] sm:text-xs font-medium text-primary hover:bg-secondary/50"
      >
        <Building2 className="size-5" aria-hidden="true" />
        <span>آگهی‌ها</span>
      </button>

      <button
        type="button"
        onClick={openMobileFilters}
        className="relative flex min-h-[48px] flex-col items-center justify-center gap-1 text-[10.5px] sm:text-xs font-medium text-foreground/80 hover:bg-secondary/50 hover:text-primary"
      >
        <div className="relative">
          <SlidersHorizontal className="size-5" aria-hidden="true" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -left-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white tabular-nums">
              {toPersianDigits(activeFilterCount)}
            </span>
          )}
        </div>
        <span>جستجو</span>
      </button>

      <button
        type="button"
        onClick={() => setFavoritesOpen(true)}
        className="relative flex min-h-[48px] flex-col items-center justify-center gap-1 text-[10.5px] sm:text-xs font-medium text-foreground/80 hover:bg-secondary/50 hover:text-primary"
      >
        <div className="relative">
          <Bookmark className="size-5" aria-hidden="true" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1.5 -left-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white tabular-nums">
              {toPersianDigits(favoritesCount)}
            </span>
          )}
        </div>
        <span>نشان‌شده‌ها</span>
      </button>

      <button
        type="button"
        onClick={() => setConsultationOpen(true)}
        className="flex min-h-[48px] flex-col items-center justify-center gap-1 text-[10.5px] sm:text-xs font-medium text-foreground/80 hover:bg-secondary/50 hover:text-primary"
      >
        <MessageSquareText className="size-5" aria-hidden="true" />
        <span>مشاوره</span>
      </button>

      <button
        type="button"
        onClick={() => setAuthOpen(true)}
        data-testid="mobile-bottom-nav-profile"
        className="relative flex min-h-[48px] flex-col items-center justify-center gap-1 text-[10.5px] sm:text-xs font-medium text-foreground/80 hover:bg-secondary/50 hover:text-primary"
      >
        <div className="relative">
          <User className={`size-5 ${isLoggedIn ? 'text-primary' : ''}`} aria-hidden="true" />
          {isLoggedIn && (
            <span
              className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-primary ring-2 ring-white"
              aria-hidden="true"
            />
          )}
        </div>
        <span>پروفایل</span>
      </button>
    </nav>
  );
}
