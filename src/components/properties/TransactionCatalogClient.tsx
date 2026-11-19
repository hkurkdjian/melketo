'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpDown,
  Building2,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { TransactionFilterPanel } from '@/components/properties/TransactionFilterPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAppShell } from '@/hooks/useAppShell';
import {
  createDefaultTransactionFilters,
  filterTransactionProperties,
  formatNumberFa,
  getAvailableCities,
  getAvailableSuburbs,
  getTransactionRangeBounds,
  toPersianDigits,
} from '@/lib/propertyLogic';
import {
  Property,
  PropertyCategory,
  SortOption,
  TransactionCatalogFilters,
  TransactionType,
} from '@/types/property';

interface TransactionCatalogClientProps {
  transactionType: TransactionType;
  properties: Property[];
  title: string;
  subtitle?: string;
  breadcrumbLabel: string;
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'جدیدترین فایل‌ها',
  'price-asc': 'ارزان‌ترین',
  'price-desc': 'گران‌ترین',
  'area-desc': 'بیشترین متراژ',
};

export function TransactionCatalogClient({
  transactionType,
  properties,
  title,
  breadcrumbLabel,
}: TransactionCatalogClientProps) {
  const { favoriteIds, toggleFavorite } = useAppShell();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const scopedProperties = useMemo(
    () => properties.filter((p) => p.transactionType === transactionType),
    [properties, transactionType]
  );

  const bounds = useMemo(
    () => getTransactionRangeBounds(scopedProperties, transactionType),
    [scopedProperties, transactionType]
  );

  const [filters, setFilters] = useState<TransactionCatalogFilters>(() =>
    createDefaultTransactionFilters(bounds, transactionType)
  );

  const availableCities = useMemo(
    () => getAvailableCities(scopedProperties),
    [scopedProperties]
  );

  const availableSuburbs = useMemo(
    () => getAvailableSuburbs(scopedProperties, filters.city),
    [scopedProperties, filters.city]
  );

  const availableCategories = useMemo(() => {
    const seen = new Set<PropertyCategory>();
    const cats: PropertyCategory[] = [];
    for (const item of scopedProperties) {
      if (!seen.has(item.category)) {
        seen.add(item.category);
        cats.push(item.category);
      }
    }
    return cats;
  }, [scopedProperties]);

  const updateFilters = (patch: Partial<TransactionCatalogFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      if (patch.city !== undefined) {
        const validSuburbs = getAvailableSuburbs(scopedProperties, patch.city);
        if (next.suburb !== 'all' && !validSuburbs.includes(next.suburb)) {
          next.suburb = 'all';
        }
      }
      return next;
    });
  };

  const resetFilters = () => {
    setFilters(createDefaultTransactionFilters(bounds, transactionType));
  };

  const filteredProperties = useMemo(
    () => filterTransactionProperties(scopedProperties, transactionType, filters),
    [scopedProperties, transactionType, filters]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim().length > 0) count++;
    if (filters.category !== 'all') count++;
    if (filters.city !== 'all') count++;
    if (filters.suburb !== 'all') count++;
    if (filters.minBedrooms > 0) count++;
    if (filters.minArea > bounds.minAreaSqm) count++;
    if (filters.sortBy !== 'newest') count++;

    if (transactionType === 'rent') {
      if (
        (filters.minDepositMillion ?? bounds.minDepositMillion) > bounds.minDepositMillion ||
        (filters.maxDepositMillion ?? bounds.maxDepositMillion) < bounds.maxDepositMillion
      ) {
        count++;
      }
      if (
        (filters.minRentMillion ?? bounds.minRentMillion) > bounds.minRentMillion ||
        (filters.maxRentMillion ?? bounds.maxRentMillion) < bounds.maxRentMillion
      ) {
        count++;
      }
      if (filters.officeDeedOnly) count++;
      if (filters.convertibleOnly) count++;
      if (filters.readyToMoveOnly) count++;
    } else {
      if (
        (filters.minPriceMillion ?? bounds.minPriceMillion) > bounds.minPriceMillion ||
        (filters.maxPriceMillion ?? bounds.maxPriceMillion) < bounds.maxPriceMillion
      ) {
        count++;
      }
    }

    if (transactionType === 'buy') {
      if (filters.deedScope === 'single-deed') count++;
      if (filters.singleUnitOnly) count++;
      if (filters.newlyBuiltOnly) count++;
      if ((filters.minParkingCount ?? 0) > 0) count++;
    }

    if (transactionType === 'presale') {
      if (filters.maxDeliveryMonths != null) count++;
      if (filters.installmentPaymentOnly) count++;
      if (filters.officialContractOnly) count++;
      if (filters.singleUnitOnly) count++;
    }

    return count;
  }, [filters, bounds, transactionType]);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <section className="bg-white pb-20 lg:pb-16">
      {/* Header Banner & Breadcrumb */}
      <div className="border-b border-border bg-[#F8F7F4]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <nav
            aria-label="مسیر صفحه"
            className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Link href="/" prefetch={false} className="hover:text-primary transition-colors">
              ملک تو
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-foreground">{breadcrumbLabel}</span>
          </nav>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl lg:text-4xl">
                {title}
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground tabular-nums md:self-auto">
              <span>تعداد فایل‌های فعال:</span>
              <span className="text-primary">{formatNumberFa(scopedProperties.length)} ملک</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Right Filter Sidebar + Left Listings Column in RTL */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile & Tablet Minimalist Top Search + Filter Tiles (< lg) */}
        <div className="mb-6 flex flex-col gap-2 rounded-2xl bg-[#F3F4F4] p-2.5 lg:hidden">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              placeholder={`جستجو در ${breadcrumbLabel}...`}
              aria-label={`جستجو در ${breadcrumbLabel}`}
              className="min-h-[44px] rounded-xl border-transparent bg-white pr-10 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] placeholder:text-muted-foreground/80 focus-visible:border-border focus-visible:ring-2 focus-visible:ring-primary/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                updateFilters({ sortBy: (value ?? 'newest') as SortOption })
              }
            >
              <SelectTrigger
                aria-label="مرتب‌سازی نتایج"
                className="min-h-[44px] w-full rounded-xl border-transparent bg-white px-3 text-xs sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <span className="inline-flex min-w-0 items-center gap-2">
                  <ArrowUpDown className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <SelectValue>{SORT_LABELS[filters.sortBy]}</SelectValue>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">جدیدترین فایل‌ها</SelectItem>
                <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                <SelectItem value="price-desc">گران‌ترین</SelectItem>
                <SelectItem value="area-desc">بیشترین متراژ</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setMobileFiltersOpen(true)}
              data-testid="mobile-transaction-filter-trigger"
              className="min-h-[44px] w-full justify-between rounded-xl bg-white px-3 text-xs sm:text-sm font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-white hover:text-primary"
            >
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-primary" aria-hidden="true" />
                <span>فیلترهای تخصصی</span>
              </span>
              {activeFilterCount > 0 && (
                <span className="inline-flex size-5 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white tabular-nums">
                  {toPersianDigits(activeFilterCount)}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Desktop Right-Side Filter Sidebar (first column in RTL = RIGHT) */}
          <aside
            data-testid="transaction-filter-sidebar"
            aria-label={`فیلترهای ${breadcrumbLabel}`}
            className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24"
          >
            <div className="rounded-2xl bg-[#F3F4F4] p-3.5">
              <TransactionFilterPanel
                transactionType={transactionType}
                filters={filters}
                bounds={bounds}
                availableCities={availableCities}
                availableSuburbs={availableSuburbs}
                availableCategories={availableCategories}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                onUpdateFilters={updateFilters}
                onResetFilters={resetFilters}
                idPrefix="desktop"
              />
            </div>
          </aside>

          {/* Desktop Left-Side Listings Column (second column in RTL = LEFT) */}
          <div
            id="catalog-results"
            data-testid="transaction-listings-column"
            className="lg:col-span-8 xl:col-span-9 space-y-6"
          >
            {/* Results Summary & Desktop Sort Bar */}
            <div className="flex flex-col gap-2.5 rounded-2xl bg-[#F3F4F4] p-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex h-10 items-center px-3">
                <p
                  data-testid="transaction-results-count"
                  className="text-xs sm:text-sm font-medium text-foreground tabular-nums"
                >
                  {hasActiveFilters
                    ? `نمایش ${formatNumberFa(filteredProperties.length)} ملک متناسب با فیلترهای انتخابی`
                    : `نمایش ${formatNumberFa(filteredProperties.length)} آگهی فعال ${breadcrumbLabel}`}
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetFilters}
                    className="h-10 gap-2 rounded-xl border border-primary/20 bg-white px-3.5 text-xs font-semibold text-primary hover:bg-[#EAF1ED]"
                  >
                    <span className="inline-flex size-5 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white tabular-nums">
                      {toPersianDigits(activeFilterCount)}
                    </span>
                    <span>بازنشانی فیلترها</span>
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                  </Button>
                )}

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    updateFilters({ sortBy: (value ?? 'newest') as SortOption })
                  }
                >
                  <SelectTrigger
                    data-testid="desktop-transaction-sort"
                    aria-label="مرتب‌سازی نتایج"
                    className="h-10 rounded-xl border border-border/80 bg-white px-3.5 text-xs font-medium shadow-none hover:border-primary/40 hover:bg-white"
                  >
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="text-muted-foreground text-xs">مرتب‌سازی:</span>
                      <SelectValue>{SORT_LABELS[filters.sortBy]}</SelectValue>
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">جدیدترین فایل‌ها</SelectItem>
                    <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                    <SelectItem value="price-desc">گران‌ترین</SelectItem>
                    <SelectItem value="area-desc">بیشترین متراژ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div
                data-testid="transaction-empty-state"
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-[#F3F4F4]/60 px-6 py-16 text-center"
              >
                <Building2 className="size-10 text-primary/70" strokeWidth={1.5} />
                <div className="space-y-1.5">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    ملکی با شرایط انتخابی یافت نشد
                  </h2>
                  <p className="max-w-md text-sm text-muted-foreground">
                    بازه قیمت، شهر، محله یا ویژگی‌های تخصصی انتخاب‌شده را تغییر دهید یا فیلترها را بازنشانی کنید.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="min-h-[44px] gap-2 rounded-xl px-5 text-sm font-medium border-primary/30 bg-white text-primary hover:bg-primary hover:text-white"
                >
                  <RotateCcw className="size-4" />
                  <span>بازنشانی فیلترها</span>
                </Button>
              </div>
            ) : (
              <div
                data-testid="transaction-property-grid"
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavorite={favoriteIds.includes(property.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Filter Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader className="pl-8 text-right">
            <SheetTitle className="font-heading text-xl font-bold">
              فیلترهای تخصصی {breadcrumbLabel}
            </SheetTitle>
            <SheetDescription>
              محدوده قیمت و مشخصات دقیق مورد نظر خود را انتخاب کنید.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 flex-1 overflow-y-auto px-4 pb-2">
            <div className="rounded-2xl bg-[#F3F4F4] p-3">
              <TransactionFilterPanel
                transactionType={transactionType}
                filters={filters}
                bounds={bounds}
                availableCities={availableCities}
                availableSuburbs={availableSuburbs}
                availableCategories={availableCategories}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                onUpdateFilters={updateFilters}
                onResetFilters={resetFilters}
                idPrefix="mobile"
                hideHeading
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="min-h-[44px] gap-1.5 rounded-xl px-4 text-xs font-semibold"
              >
                <RotateCcw className="size-4" />
                <span>بازنشانی</span>
              </Button>
            )}
            <Button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="min-h-[44px] flex-1 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-[#14523E]"
            >
              نمایش {formatNumberFa(filteredProperties.length)} ملک
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
