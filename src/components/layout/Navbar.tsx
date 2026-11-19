'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Menu, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppShell } from '@/hooks/useAppShell';
import { formatNumberFa } from '@/lib/propertyLogic';

export function Navbar() {
  const {
    activeView,
    filters,
    favoriteProperties,
    user,
    updateFilters,
    exploreListings,
    setFavoritesOpen,
    setAuthOpen,
    setConsultationOpen,
  } = useAppShell();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isRealtorsActive = activeView === 'realtors' || activeView === 'realtor';
  const isBuyActive = activeView === 'buy';
  const isRentActive = activeView === 'rent';
  const isPresaleActive = activeView === 'presale';
  const isAboutActive = activeView === 'about';
  const isContactActive = activeView === 'contact';
  const favoritesCount = favoriteProperties.length;

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    exploreListings();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-16 lg:gap-6 lg:px-8">
        {/* Zone 1: Brand Logo */}
        <Link
          href="/"
          prefetch={false}
          aria-label="ملک تو"
          className="flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
        >
          <span className="relative block h-10 lg:h-11 aspect-[1280/905]">
            <Image
              src="/assets/aistudio/logo__1__8e650d40.jpg"
              alt="ملک تو"
              fill
              sizes="120px"
              priority
              className="object-contain"
            />
          </span>
        </Link>

        {/* Zone 2: Nav Links (Desktop lg+) */}
        <nav
          aria-label="منوی اصلی"
          className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-foreground/80"
        >
          <Link
            href="/buy"
            prefetch={false}
            data-testid="desktop-nav-buy"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-primary hover:underline underline-offset-8 decoration-2 decoration-primary/60 ${
              isBuyActive ? 'font-bold text-primary underline' : ''
            }`}
          >
            خرید ملک
          </Link>
          <Link
            href="/rent"
            prefetch={false}
            data-testid="desktop-nav-rent"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-primary hover:underline underline-offset-8 decoration-2 decoration-primary/60 ${
              isRentActive ? 'font-bold text-primary underline' : ''
            }`}
          >
            رهن و اجاره
          </Link>
          <Link
            href="/presale"
            prefetch={false}
            data-testid="desktop-nav-presale"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-primary hover:underline underline-offset-8 decoration-2 decoration-primary/60 ${
              isPresaleActive ? 'font-bold text-primary underline' : ''
            }`}
          >
            پیش‌فروش
          </Link>
          <Link
            href="/realtors"
            prefetch={false}
            data-testid="desktop-nav-realtors"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-primary hover:underline underline-offset-8 decoration-2 decoration-primary/60 ${
              isRealtorsActive ? 'font-bold text-primary underline' : ''
            }`}
          >
            مشاوران
          </Link>
          <Link
            href="/about"
            prefetch={false}
            data-testid="desktop-nav-about"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-primary hover:underline underline-offset-8 decoration-2 decoration-primary/60 ${
              isAboutActive ? 'font-bold text-primary underline' : ''
            }`}
          >
            درباره ما
          </Link>
          <Link
            href="/contact"
            prefetch={false}
            data-testid="desktop-nav-contact"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-primary hover:underline underline-offset-8 decoration-2 decoration-primary/60 ${
              isContactActive ? 'font-bold text-primary underline' : ''
            }`}
          >
            تماس با ما
          </Link>
        </nav>

        {/* Zone 3: Desktop Search, Bookmarks & Login + Mobile/Tablet Drawer Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Desktop Search */}
          <form
            onSubmit={handleHeaderSearchSubmit}
            data-testid="desktop-header-search"
            className="relative hidden lg:block w-48 xl:w-64"
          >
            <Search
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              placeholder="جستجوی شهر، محله یا کد..."
              aria-label="جستجوی سریع در هدر"
              className="h-10 rounded-lg border-transparent bg-[#F3F4F4] pr-10 text-xs xl:text-sm shadow-none transition-colors placeholder:text-muted-foreground/80 focus-visible:border-border focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
            />
          </form>

          {/* Desktop Bookmarks (Icon-only) */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setFavoritesOpen(true)}
            data-testid="desktop-header-bookmarks"
            aria-label={`نشان‌شده‌ها (${formatNumberFa(favoritesCount)})`}
            title="نشان‌شده‌ها"
            className="relative hidden lg:inline-flex size-10 shrink-0 rounded-lg border-border/80 bg-white hover:border-primary hover:text-primary"
          >
            <Bookmark
              className={`size-4 ${
                favoritesCount > 0 ? 'fill-primary text-primary' : 'text-foreground'
              }`}
              aria-hidden="true"
            />
            {favoritesCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-white"
                aria-hidden="true"
              />
            )}
          </Button>

          {/* Desktop Login / Profile */}
          <Button
            type="button"
            onClick={() => setAuthOpen(true)}
            data-testid="desktop-header-login"
            className="hidden lg:inline-flex h-10 gap-1.5 rounded-lg px-4 text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0 bg-primary text-primary-foreground hover:bg-[#14523E]"
          >
            <User className="size-4" aria-hidden="true" />
            <span className="max-w-[110px] truncate">
              {user ? user.name : 'ورود / ثبت‌نام'}
            </span>
          </Button>

          {/* Tablet (sm-md) Primary CTA */}
          <Button
            type="button"
            onClick={() => setConsultationOpen(true)}
            className="hidden sm:inline-flex lg:hidden min-h-[40px] rounded-lg px-4 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 bg-primary text-primary-foreground hover:bg-[#14523E]"
          >
            ثبت درخواست مشاوره
          </Button>

          {/* Mobile & Tablet Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={mobileOpen}
            className="inline-flex lg:hidden size-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Slide Menu Drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-2 text-sm font-medium" aria-label="منوی موبایل و تبلت">
            <Link
              href="/buy"
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              data-testid="mobile-nav-buy"
              className={`flex min-h-[44px] items-center justify-start rounded-lg px-3 text-right hover:bg-secondary hover:text-primary ${
                isBuyActive ? 'bg-secondary/70 font-bold text-primary' : ''
              }`}
            >
              خرید ملک
            </Link>
            <Link
              href="/rent"
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              data-testid="mobile-nav-rent"
              className={`flex min-h-[44px] items-center justify-start rounded-lg px-3 text-right hover:bg-secondary hover:text-primary ${
                isRentActive ? 'bg-secondary/70 font-bold text-primary' : ''
              }`}
            >
              رهن و اجاره
            </Link>
            <Link
              href="/presale"
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              data-testid="mobile-nav-presale"
              className={`flex min-h-[44px] items-center justify-start rounded-lg px-3 text-right hover:bg-secondary hover:text-primary ${
                isPresaleActive ? 'bg-secondary/70 font-bold text-primary' : ''
              }`}
            >
              پیش‌فروش
            </Link>
            <Link
              href="/realtors"
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              data-testid="mobile-nav-realtors"
              className={`flex min-h-[44px] items-center justify-start rounded-lg px-3 text-right hover:bg-secondary hover:text-primary ${
                isRealtorsActive ? 'bg-secondary/70 font-bold text-primary' : ''
              }`}
            >
              مشاوران
            </Link>
            <Link
              href="/about"
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              data-testid="mobile-nav-about"
              className={`flex min-h-[44px] items-center justify-start rounded-lg px-3 text-right hover:bg-secondary hover:text-primary ${
                isAboutActive ? 'bg-secondary/70 font-bold text-primary' : ''
              }`}
            >
              درباره ما
            </Link>
            <Link
              href="/contact"
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              data-testid="mobile-nav-contact"
              className={`flex min-h-[44px] items-center justify-start rounded-lg px-3 text-right hover:bg-secondary hover:text-primary ${
                isContactActive ? 'bg-secondary/70 font-bold text-primary' : ''
              }`}
            >
              تماس با ما
            </Link>
            <Button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setConsultationOpen(true);
              }}
              className="mt-1 min-h-[44px] w-full text-sm font-semibold bg-primary text-primary-foreground sm:hidden"
            >
              ثبت درخواست مشاوره
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
