'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowUpDown,
  Bath,
  BedDouble,
  Bookmark,
  Building2,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Compass,
  FileText,
  Flame,
  KeyRound,
  Layers,
  LayoutGrid,
  MapPin,
  Maximize2,
  Package,
  Share2,
  Snowflake,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyGallery } from '@/components/properties/PropertyGallery';
import { PropertyLocationMap } from '@/components/properties/PropertyLocationMap';
import { VisitBookingModal } from '@/components/properties/VisitBookingModal';
import { RealtorCard } from '@/components/realtors/RealtorCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppShell } from '@/hooks/useAppShell';
import {
  convertRahnEjareh,
  formatNumberFa,
  formatPricePerSqm,
  formatPriceToman,
  getCategoryLabel,
  getTransactionLabel,
  toPersianDigits,
} from '@/lib/propertyLogic';
import { Advisor, Property } from '@/types/property';

interface PropertyDetailClientProps {
  property: Property;
  advisor: Advisor;
  similarProperties: Property[];
}

type PropertyTabId = 'overview' | 'specs' | 'amenities' | 'map' | 'realtor';

const PROPERTY_TABS: Array<{ id: PropertyTabId; label: string }> = [
  { id: 'overview', label: 'بررسی' },
  { id: 'specs', label: 'مشخصات' },
  { id: 'amenities', label: 'امکانات' },
  { id: 'map', label: 'موقعیت' },
  { id: 'realtor', label: 'مشاور' },
];

export function PropertyDetailClient({
  property,
  advisor,
  similarProperties,
}: PropertyDetailClientProps) {
  const {
    favoriteIds,
    visitModalOpen,
    setVisitModalOpen,
    toggleFavorite,
  } = useAppShell();

  const [copiedLink, setCopiedLink] = useState(false);
  const [targetDeposit, setTargetDeposit] = useState<number>(
    property.depositMillion ?? 2500
  );
  const [activeTab, setActiveTab] = useState<PropertyTabId>('overview');

  const tabListRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<Partial<Record<PropertyTabId, HTMLButtonElement | null>>>({});
  const sectionRefs = useRef<Partial<Record<PropertyTabId, HTMLElement | HTMLDivElement | null>>>({});
  const programmaticScrollUntilRef = useRef<number>(0);

  useEffect(() => {
    setTargetDeposit(property.depositMillion ?? 2500);
    setCopiedLink(false);
    setActiveTab('overview');
  }, [property.id, property.depositMillion]);

  useEffect(() => {
    let rafId = 0;

    const updateActiveTabFromScroll = () => {
      if (window.innerWidth >= 1024) {
        return;
      }
      if (Date.now() < programmaticScrollUntilRef.current) {
        return;
      }

      const threshold = 175;
      let current: PropertyTabId = 'overview';

      for (const tab of PROPERTY_TABS) {
        const el = sectionRefs.current[tab.id];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= threshold) {
          current = tab.id;
        }
      }

      setActiveTab((prev) => (prev === current ? prev : current));
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveTabFromScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [property.id]);

  useEffect(() => {
    const tabList = tabListRef.current;
    const activeBtn = tabButtonRefs.current[activeTab];
    if (!tabList || !activeBtn) return;

    const listRect = tabList.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const delta = btnRect.left + btnRect.width / 2 - (listRect.left + listRect.width / 2);
    if (Math.abs(delta) > 8) {
      tabList.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }, [activeTab]);

  const handleTabClick = (tabId: PropertyTabId) => {
    setActiveTab(tabId);
    programmaticScrollUntilRef.current = Date.now() + 750;
    const targetEl = sectionRefs.current[tabId];
    if (targetEl) {
      const top = targetEl.getBoundingClientRect().top + window.scrollY - 124;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  };

  const isRent = property.transactionType === 'rent';
  const isFavorite = favoriteIds.includes(property.id);

  const maxEquivalentDeposit = isRent
    ? Math.round(
        (property.depositMillion ?? 0) + ((property.monthlyRentMillion ?? 0) / 3) * 100
      )
    : 0;

  const convertedRent = isRent
    ? convertRahnEjareh(
        property.depositMillion ?? 0,
        property.monthlyRentMillion ?? 0,
        targetDeposit
      )
    : null;

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const specGroups: Array<{
    id: string;
    title: string;
    items: Array<{ label: string; value: string; icon: ReactNode }>;
  }> = [
    {
      id: 'structure',
      title: 'ابعاد و ساختار فضا',
      items: [
        {
          label: 'زیربنای کل',
          value: `${formatNumberFa(property.areaSqm)} متر مربع`,
          icon: <Maximize2 className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'تعداد اتاق خواب',
          value: `${formatNumberFa(property.bedrooms)} خواب`,
          icon: <BedDouble className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'سرویس بهداشتی',
          value: `${formatNumberFa(property.bathrooms)} سرویس`,
          icon: <Bath className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'موقعیت طبقه',
          value: `طبقه ${formatNumberFa(property.floor)} از ${formatNumberFa(property.totalFloors)}`,
          icon: <Layers className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'تعداد واحد در طبقه',
          value:
            property.unitsPerFloor === 1
              ? 'تک‌واحدی'
              : `${formatNumberFa(property.unitsPerFloor)} واحد`,
          icon: <Building2 className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'سال ساخت',
          value: toPersianDigits(property.buildYear),
          icon: <Calendar className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'ارتفاع سقف',
          value: `${toPersianDigits(property.ceilingHeightMeters)} متر`,
          icon: <ArrowUpDown className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'جهت نورگیری',
          value: property.orientation,
          icon: <Compass className="size-4 text-primary" aria-hidden="true" />,
        },
      ],
    },
    {
      id: 'systems',
      title: 'تاسیسات و متریال داخلی',
      items: [
        {
          label: 'سیستم سرمایش',
          value: property.coolingSystem,
          icon: <Snowflake className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'سیستم گرمایش',
          value: property.heatingSystem,
          icon: <Flame className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'جنس کف‌سازی',
          value: property.floorMaterial,
          icon: <LayoutGrid className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'کابینت و متریال',
          value: property.cabinetType,
          icon: <UtensilsCrossed className="size-4 text-primary" aria-hidden="true" />,
        },
      ],
    },
    {
      id: 'legal',
      title: 'امکانات پایه و وضعیت حقوقی',
      items: [
        {
          label: 'پارکینگ اختصاصی',
          value: `${formatNumberFa(property.parkingCount)} عدد سندی`,
          icon: <Car className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'آسانسور و انباری',
          value: `${property.hasElevator ? 'آسانسور فعال' : 'بدون آسانسور'} · ${
            property.hasStorage ? 'انباری سندی' : 'بدون انباری'
          }`,
          icon: <Package className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'وضعیت سند',
          value: property.deedType,
          icon: <FileText className="size-4 text-primary" aria-hidden="true" />,
        },
        {
          label: 'وضعیت تحویل',
          value: property.availabilityStatus,
          icon: <KeyRound className="size-4 text-primary" aria-hidden="true" />,
        },
      ],
    },
  ];

  const renderPriceActionsCard = (testId: string) => (
    <div
      data-testid={testId}
      className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/45 p-5 shadow-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {isRent ? 'شرایط رهن و اجاره ماهیانه' : 'قیمت کل کارشناسی‌شده'}
          </p>
          {isRent ? (
            <div className="mt-1.5 space-y-0.5 tabular-nums">
              <p className="font-heading text-2xl font-extrabold text-primary">
                رهن {formatPriceToman(property.depositMillion ?? 0)}
              </p>
              <p className="text-sm font-semibold text-foreground">
                اجاره ماهیانه {formatPriceToman(property.monthlyRentMillion ?? 0)}
              </p>
            </div>
          ) : (
            <div className="mt-1.5 space-y-0.5 tabular-nums">
              <p className="font-heading text-2xl font-extrabold text-primary">
                {formatPriceToman(property.priceMillion ?? 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatPricePerSqm(property.priceMillion ?? 0, property.areaSqm)}
              </p>
            </div>
          )}
        </div>

        {/* Icon-Only Bookmark & Share */}
        <div
          data-testid="property-actions-bar"
          className="flex shrink-0 items-center gap-2"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => toggleFavorite(property.id)}
            data-testid={`${testId}-bookmark-btn`}
            aria-label={isFavorite ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها'}
            title={isFavorite ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها'}
            aria-pressed={isFavorite}
            className={`size-11 shrink-0 ${
              isFavorite
                ? 'border-primary bg-primary text-white hover:bg-[#14523E] hover:text-white'
                : 'bg-white text-foreground hover:border-primary hover:text-primary'
            }`}
          >
            <Bookmark className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleShare}
            data-testid={`${testId}-share-btn`}
            aria-label={copiedLink ? 'لینک ملک کپی شد' : 'اشتراک‌گذاری ملک'}
            title={copiedLink ? 'لینک کپی شد' : 'اشتراک‌گذاری'}
            className={`size-11 shrink-0 ${
              copiedLink
                ? 'border-primary bg-primary text-white hover:bg-[#14523E] hover:text-white'
                : 'bg-white text-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {copiedLink ? <Check className="size-4" /> : <Share2 className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <article data-testid="single-property-page" className="bg-white pb-24 lg:pb-12">
      {/* Desktop & Tablet Breadcrumb Strip */}
      <div className="hidden md:block border-b border-border bg-secondary/35">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <nav
            aria-label="مسیر صفحه ملک"
            className="flex items-center gap-2 text-xs text-muted-foreground truncate"
          >
            <Link href="/" prefetch={false} className="hover:text-primary transition-colors">
              ملک تو
            </Link>
            <span aria-hidden="true">/</span>
            <span>{getTransactionLabel(property.transactionType)}</span>
            <span aria-hidden="true">/</span>
            <span>{property.neighborhood}</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-foreground tabular-nums">
              کد {toPersianDigits(property.code)}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 space-y-8">
        {/* Top Multi-Photo Gallery with Titled Expanded View */}
        <PropertyGallery propertyTitle={property.title} items={property.gallery} />

        {/* Property Title & Address Header (+ Mobile/Tablet Price Card) */}
        <header className="space-y-5">
          <div className="space-y-2.5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="font-bold text-primary">
                {getTransactionLabel(property.transactionType)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{getCategoryLabel(property.category)}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">کد ملک {toPersianDigits(property.code)}</span>
              {property.featuredLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-primary">{property.featuredLabel}</span>
                </>
              )}
            </div>

            <h1 className="font-heading text-2xl font-extrabold leading-snug text-foreground sm:text-3xl lg:text-[2rem]">
              {property.title}
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {property.city}، {property.neighborhood} — {property.address}
              </span>
            </p>
          </div>

          <div className="lg:hidden">{renderPriceActionsCard('mobile-price-card')}</div>
        </header>

        {/* Wrapper Scoping Mobile/Tablet Sticky Tab Bar Across All 5 Tabbed Sections */}
        <div className="space-y-6 lg:space-y-0">
          {/* Sticky Tabular Navigation Bar (Mobile & Tablet < lg) */}
          <div
            data-testid="mobile-property-tabs"
            className="sticky top-14 z-30 -mx-4 border-y border-border bg-white/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:hidden"
          >
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="بخش‌های اطلاعات ملک"
              className="flex items-center justify-between gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {PROPERTY_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabButtonRefs.current[tab.id] = el;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-testid={`property-tab-${tab.id}`}
                    onClick={() => handleTabClick(tab.id)}
                    className={`min-h-[38px] flex-1 shrink-0 whitespace-nowrap rounded-lg px-2.5 text-xs sm:text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-secondary/50 text-foreground/75 hover:bg-secondary hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 12-Column Detail Body + Sticky Price & Realtor Sidebar */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Main Details Column */}
            <div className="space-y-8 lg:col-span-8">
              {/* Tab 1: Overview */}
              <div
                ref={(el) => {
                  sectionRefs.current.overview = el;
                }}
                data-testid="property-section-overview"
                className="space-y-8 scroll-mt-32"
              >
                <div className="grid grid-cols-2 divide-y divide-border rounded-xl border border-border bg-secondary/35 sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:divide-x-reverse tabular-nums">
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-primary">
                      <Maximize2 className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">متراژ زیربنا</p>
                      <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                        {formatNumberFa(property.areaSqm)} متر
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-primary">
                      <BedDouble className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">تعداد خواب</p>
                      <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                        {formatNumberFa(property.bedrooms)} خواب
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-primary">
                      <Layers className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">طبقه</p>
                      <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                        {formatNumberFa(property.floor)} از {formatNumberFa(property.totalFloors)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-primary">
                      <Calendar className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">سال ساخت</p>
                      <p className="mt-0.5 font-heading text-lg font-bold text-foreground">
                        {toPersianDigits(property.buildYear)}
                      </p>
                    </div>
                  </div>
                </div>

                <section className="space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    بررسی تخصصی و توضیحات ملک
                  </h2>
                  <p className="text-sm sm:text-base leading-8 text-muted-foreground">
                    {property.description}
                  </p>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
                      <Sparkles className="size-4 text-primary" aria-hidden="true" />
                      <span>نقاط قوت و مزیت‌های شاخص</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {property.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-sm text-foreground"
                        >
                          <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {isRent && convertedRent && (
                  <section className="rounded-xl border border-border bg-secondary/35 p-5 sm:p-6 space-y-4">
                    <div className="space-y-1">
                      <h2 className="font-heading text-lg font-bold text-foreground">
                        شرایط تبدیل رهن و اجاره
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        تنظیم نسبت ودیعه و اجاره ماهیانه مطابق عرف کارشناسی منطقه
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <Label htmlFor="page-deposit-slider">مبلغ رهن پیشنهادی</Label>
                        <span className="font-bold text-primary tabular-nums">
                          {formatPriceToman(convertedRent.depositMillion)}
                        </span>
                      </div>
                      <input
                        id="page-deposit-slider"
                        type="range"
                        min={500}
                        max={Math.max(1000, maxEquivalentDeposit)}
                        step={100}
                        value={targetDeposit}
                        onChange={(e) => setTargetDeposit(Number(e.target.value))}
                        className="w-full accent-[#0F3D2E] cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-white p-4">
                        <p className="text-xs text-muted-foreground">مبلغ ودیعه (رهن)</p>
                        <p className="mt-1 font-heading text-lg font-bold text-primary tabular-nums">
                          {formatPriceToman(convertedRent.depositMillion)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border bg-white p-4">
                        <p className="text-xs text-muted-foreground">اجاره ماهیانه متناظر</p>
                        <p className="mt-1 font-heading text-lg font-bold text-foreground tabular-nums">
                          {convertedRent.monthlyRentMillion === 0
                            ? 'رهن کامل (بدون اجاره)'
                            : formatPriceToman(convertedRent.monthlyRentMillion)}
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Tab 2: Grouped Specifications */}
              <section
                ref={(el) => {
                  sectionRefs.current.specs = el;
                }}
                data-testid="grouped-specs-section"
                className="space-y-6 rounded-xl border border-border bg-white p-5 sm:p-6 scroll-mt-32"
              >
                <h2 className="font-heading text-xl font-bold text-foreground">
                  مشخصات فنی، معماری و حقوقی
                </h2>

                <div className="space-y-6">
                  {specGroups.map((group) => (
                    <div
                      key={group.id}
                      data-testid={`spec-group-${group.id}`}
                      className="space-y-3 rounded-xl border border-border bg-secondary/25 p-4 sm:p-5"
                    >
                      <h3 className="font-heading text-sm sm:text-base font-bold text-primary">
                        {group.title}
                      </h3>
                      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {group.items.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-3 rounded-lg border border-border bg-white px-3.5 py-3"
                          >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF1ED]">
                              {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <dt className="text-[11px] text-muted-foreground">
                                {item.label}
                              </dt>
                              <dd className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
                                {item.value}
                              </dd>
                            </div>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tab 3: Amenities */}
              <section
                ref={(el) => {
                  sectionRefs.current.amenities = el;
                }}
                data-testid="property-section-amenities"
                className="space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6 scroll-mt-32"
              >
                <h2 className="font-heading text-xl font-bold text-foreground">
                  امکانات و مشاعات ساختمان
                </h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/30 px-3.5 py-3 text-sm text-foreground"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tab 4: Interactive Location Map */}
              <div
                ref={(el) => {
                  sectionRefs.current.map = el;
                }}
                data-testid="property-section-map"
                className="scroll-mt-32"
              >
                <PropertyLocationMap property={property} />
              </div>
            </div>

            {/* Tab 5 (Mobile/Tablet Realtor Section) + Sticky Price & Realtor Sidebar (Desktop) */}
            <div
              ref={(el) => {
                sectionRefs.current.realtor = el;
              }}
              data-testid="property-section-realtor"
              className="lg:col-span-4 scroll-mt-32"
            >
              <div
                data-testid="desktop-sticky-sidebar"
                className="lg:sticky lg:top-20 space-y-5"
              >
                <div className="hidden lg:block">{renderPriceActionsCard('desktop-price-card')}</div>
                <RealtorCard
                  advisor={advisor}
                  onOpenVisitModal={() => setVisitModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <VisitBookingModal
          open={visitModalOpen}
          onOpenChange={setVisitModalOpen}
          property={property}
          advisor={advisor}
        />

        {/* Similar Property Offers Section (Horizontal Scroll on Mobile & Tablet) */}
        {similarProperties.length > 0 && (
          <section
            aria-labelledby="similar-properties-heading"
            data-testid="similar-properties-section"
            className="border-t border-border pt-10 space-y-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2
                  id="similar-properties-heading"
                  className="font-heading text-xl sm:text-2xl font-bold text-foreground"
                >
                  پیشنهادهای مشابه
                </h2>
              </div>
              <Link
                href={`/${property.transactionType}`}
                prefetch={false}
                className="inline-flex min-h-[40px] sm:min-h-[44px] shrink-0 items-center justify-center rounded-lg border border-border bg-white px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                مشاهده همه فایل‌ها
              </Link>
            </div>

            <div
              data-testid="similar-properties-track"
              className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-3 snap-x snap-mandatory sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {similarProperties.map((similar) => (
                <div
                  key={similar.id}
                  className="w-[82vw] max-w-[330px] shrink-0 snap-start sm:w-[46vw] lg:w-auto lg:max-w-none"
                >
                  <PropertyCard
                    property={similar}
                    isFavorite={favoriteIds.includes(similar.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
