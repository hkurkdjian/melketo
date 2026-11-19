'use client';

import {
  ArrowUpDown,
  BedDouble,
  Building2,
  Compass,
  HardHat,
  Home,
  KeyRound,
  LayoutGrid,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Tag,
  type LucideIcon,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatNumberFa, toPersianDigits } from '@/lib/propertyLogic';
import {
  FilterState,
  PropertyCategory,
  SortOption,
  TransactionType,
} from '@/types/property';

interface ListingToolbarProps {
  filters: FilterState;
  availableCities: string[];
  availableSuburbs: string[];
  totalCount: number;
  filterSheetOpen: boolean;
  onFilterSheetOpenChange: (open: boolean) => void;
  onUpdateFilters: (patch: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

const TRANSACTION_OPTIONS: Array<{
  value: TransactionType | 'all';
  label: string;
  icon: LucideIcon;
}> = [
  { value: 'all', label: 'همه معاملات', icon: LayoutGrid },
  { value: 'buy', label: 'خرید', icon: Home },
  { value: 'rent', label: 'رهن و اجاره', icon: KeyRound },
  { value: 'presale', label: 'پیش‌فروش', icon: HardHat },
];

const TRANSACTION_LABELS: Record<TransactionType | 'all', string> = {
  all: 'همه معاملات',
  buy: 'خرید',
  rent: 'رهن و اجاره',
  presale: 'پیش‌فروش',
};

const CATEGORY_LABELS: Record<PropertyCategory | 'all', string> = {
  all: 'همه کاربری‌ها',
  apartment: 'آپارتمان',
  villa: 'ویلا',
  penthouse: 'پنت‌هاوس',
  office: 'اداری و تجاری',
};

const BEDROOM_LABELS: Record<string, string> = {
  '0': 'تعداد خواب',
  '2': '۲ خواب به بالا',
  '3': '۳ خواب به بالا',
  '4': '۴ خواب به بالا',
};

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'جدیدترین‌ها',
  'price-asc': 'ارزان‌ترین',
  'price-desc': 'گران‌ترین',
  'area-desc': 'بیشترین متراژ',
};

export function ListingToolbar({
  filters,
  availableCities,
  availableSuburbs,
  totalCount,
  filterSheetOpen,
  onFilterSheetOpenChange,
  onUpdateFilters,
  onResetFilters,
}: ListingToolbarProps) {
  const activeFilterCount =
    (filters.transactionType !== 'all' ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.city !== 'all' ? 1 : 0) +
    (filters.suburb !== 'all' ? 1 : 0) +
    (filters.minBedrooms > 0 ? 1 : 0) +
    (filters.sortBy !== 'newest' ? 1 : 0) +
    (filters.searchQuery.trim().length > 0 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            فهرست املاک منتخب
          </h2>
          <p
            data-testid="listings-count-summary"
            className="mt-1 text-sm text-muted-foreground tabular-nums"
          >
            {hasActiveFilters
              ? `نمایش ${formatNumberFa(totalCount)} ملک متناسب با فیلتر انتخابی شما`
              : `نمایش ${formatNumberFa(totalCount)} آگهی فعال`}
          </p>
        </div>
      </div>

      {/* Mobile & Tablet Minimalist 2x2 Tile Tray (< lg) */}
      <div className="flex flex-col gap-2 rounded-2xl bg-[#F3F4F4] p-2.5 lg:hidden">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="جستجوی محله، خیابان یا کد ملک..."
            aria-label="جستجوی سریع در فهرست"
            className="min-h-[44px] rounded-xl border-transparent bg-white pr-10 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] placeholder:text-muted-foreground/80 focus-visible:border-border focus-visible:ring-2 focus-visible:ring-primary/15"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filters.transactionType}
            onValueChange={(value) =>
              onUpdateFilters({
                transactionType: (value ?? 'all') as TransactionType | 'all',
              })
            }
          >
            <SelectTrigger
              aria-label="فیلتر سریع نوع معامله"
              className="min-h-[44px] w-full rounded-xl border-transparent bg-white px-3 text-xs sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <Tag className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                <SelectValue>{TRANSACTION_LABELS[filters.transactionType]}</SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.city}
            onValueChange={(value) => onUpdateFilters({ city: value ?? 'all' })}
          >
            <SelectTrigger
              aria-label="فیلتر شهر"
              className="min-h-[44px] w-full rounded-xl border-transparent bg-white px-3 text-xs sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                <SelectValue>
                  {filters.city === 'all' ? 'همه شهرها' : filters.city}
                </SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه شهرها</SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onUpdateFilters({ sortBy: (value ?? 'newest') as SortOption })
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
              <SelectItem value="newest">جدیدترین‌ها</SelectItem>
              <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
              <SelectItem value="price-desc">گران‌ترین</SelectItem>
              <SelectItem value="area-desc">بیشترین متراژ</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onFilterSheetOpenChange(true)}
            data-testid="mobile-filter-sheet-trigger"
            className="min-h-[44px] w-full justify-between rounded-xl bg-white px-3 text-xs sm:text-sm font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-white hover:text-primary"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-primary" aria-hidden="true" />
              <span>فیلتر بیشتر</span>
            </span>
            {activeFilterCount > 0 && (
              <span className="inline-flex size-5 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white tabular-nums">
                {toPersianDigits(activeFilterCount)}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Desktop Minimalist Modular Filter Bar (lg+) */}
      <div className="hidden lg:flex items-center justify-between gap-2 rounded-2xl bg-[#F3F4F4] p-2">
        {/* Right/Start Cluster: Bordered Select Inputs with Field Prefix */}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.transactionType}
            onValueChange={(value) =>
              onUpdateFilters({
                transactionType: (value ?? 'all') as TransactionType | 'all',
              })
            }
          >
            <SelectTrigger
              aria-label="فیلتر وضعیت معامله"
              className="h-10 rounded-xl border border-border/80 bg-white px-3 text-xs xl:text-sm font-medium shadow-none hover:border-primary/40 hover:bg-white"
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Tag className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="text-muted-foreground text-xs">معامله:</span>
                <SelectValue>{TRANSACTION_LABELS[filters.transactionType]}</SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.city}
            onValueChange={(value) => onUpdateFilters({ city: value ?? 'all' })}
          >
            <SelectTrigger
              data-testid="filter-city-select"
              aria-label="فیلتر شهر"
              className="h-10 rounded-xl border border-border/80 bg-white px-3 text-xs xl:text-sm font-medium shadow-none hover:border-primary/40 hover:bg-white"
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="text-muted-foreground text-xs">شهر:</span>
                <SelectValue>
                  {filters.city === 'all' ? 'همه شهرها' : filters.city}
                </SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه شهرها</SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.suburb}
            onValueChange={(value) => onUpdateFilters({ suburb: value ?? 'all' })}
          >
            <SelectTrigger
              data-testid="filter-suburb-select"
              aria-label="فیلتر محله و منطقه"
              className="h-10 rounded-xl border border-border/80 bg-white px-3 text-xs xl:text-sm font-medium shadow-none hover:border-primary/40 hover:bg-white"
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Compass className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="text-muted-foreground text-xs">محله:</span>
                <SelectValue>
                  {filters.suburb === 'all' ? 'همه محله‌ها' : filters.suburb}
                </SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه محله‌ها</SelectItem>
              {availableSuburbs.map((suburb) => (
                <SelectItem key={suburb} value={suburb}>
                  {suburb}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(value) =>
              onUpdateFilters({ category: (value ?? 'all') as PropertyCategory | 'all' })
            }
          >
            <SelectTrigger
              aria-label="فیلتر نوع کاربری"
              className="h-10 rounded-xl border border-border/80 bg-white px-3 text-xs xl:text-sm font-medium shadow-none hover:border-primary/40 hover:bg-white"
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Building2 className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="text-muted-foreground text-xs">کاربری:</span>
                <SelectValue>{CATEGORY_LABELS[filters.category]}</SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه کاربری‌ها</SelectItem>
              <SelectItem value="apartment">آپارتمان</SelectItem>
              <SelectItem value="villa">ویلا</SelectItem>
              <SelectItem value="penthouse">پنت‌هاوس</SelectItem>
              <SelectItem value="office">اداری و تجاری</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={String(filters.minBedrooms)}
            onValueChange={(value) =>
              onUpdateFilters({ minBedrooms: Number(value ?? 0) })
            }
          >
            <SelectTrigger
              aria-label="فیلتر تعداد خواب"
              className="h-10 rounded-xl border border-border/80 bg-white px-3 text-xs xl:text-sm font-medium shadow-none hover:border-primary/40 hover:bg-white"
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <BedDouble className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="text-muted-foreground text-xs">خواب:</span>
                <SelectValue>{BEDROOM_LABELS[String(filters.minBedrooms)]}</SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">همه</SelectItem>
              <SelectItem value="2">۲ خواب به بالا</SelectItem>
              <SelectItem value="3">۳ خواب به بالا</SelectItem>
              <SelectItem value="4">۴ خواب به بالا</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onUpdateFilters({ sortBy: (value ?? 'newest') as SortOption })
            }
          >
            <SelectTrigger
              aria-label="مرتب‌سازی نتایج"
              className="h-10 rounded-xl border border-border/80 bg-white px-3 text-xs xl:text-sm font-medium shadow-none hover:border-primary/40 hover:bg-white"
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="text-muted-foreground text-xs">مرتب‌سازی:</span>
                <SelectValue>{SORT_LABELS[filters.sortBy]}</SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">جدیدترین‌ها</SelectItem>
              <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
              <SelectItem value="price-desc">گران‌ترین</SelectItem>
              <SelectItem value="area-desc">بیشترین متراژ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Left/End Cluster: Integrated Reset Button with Inline Count */}
        <div className="flex items-center gap-2 shrink-0">
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              onClick={onResetFilters}
              className="h-10 gap-2 rounded-xl border border-primary/20 bg-white px-3.5 text-xs font-semibold text-primary hover:bg-[#EAF1ED] whitespace-nowrap"
            >
              <span className="inline-flex size-5 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white tabular-nums">
                {toPersianDigits(activeFilterCount)}
              </span>
              <span>بازنشانی فیلترها</span>
              <RotateCcw className="size-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Adaptive Filter Drawer Sheet for Mobile & Tablet */}
      <Sheet open={filterSheetOpen} onOpenChange={onFilterSheetOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader className="pl-8 text-right">
            <SheetTitle className="font-heading text-xl font-bold">
              فیلتر پیشرفته و مرتب‌سازی
            </SheetTitle>
            <SheetDescription>
              فایل‌های ملک تو را بر اساس شهر، محله، نوع معامله، کاربری و تعداد خواب محدود کنید.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 flex-1 space-y-4 overflow-y-auto px-4 pb-2">
            <div className="rounded-2xl bg-[#F3F4F4] p-3 space-y-3">
              <div className="space-y-1.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Label htmlFor="sheet-search" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <Search className="size-3.5 text-primary" aria-hidden="true" />
                  <span>جستجوی محله، خیابان یا کد ملک</span>
                </Label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="sheet-search"
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
                    placeholder="مثلاً الهیه، مهرشهر، AS-1404..."
                    className="min-h-[42px] rounded-lg border-transparent bg-[#F3F4F4] pr-9 text-sm focus-visible:border-border focus-visible:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <Label htmlFor="sheet-city" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                    <span>شهر</span>
                  </Label>
                  <Select
                    value={filters.city}
                    onValueChange={(value) => onUpdateFilters({ city: value ?? 'all' })}
                  >
                    <SelectTrigger id="sheet-city" className="min-h-[40px] w-full border-transparent bg-[#F3F4F4]">
                      <SelectValue>
                        {filters.city === 'all' ? 'همه شهرها' : filters.city}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه شهرها</SelectItem>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <Label htmlFor="sheet-suburb" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    <Compass className="size-3.5 text-primary" aria-hidden="true" />
                    <span>محله / منطقه</span>
                  </Label>
                  <Select
                    value={filters.suburb}
                    onValueChange={(value) => onUpdateFilters({ suburb: value ?? 'all' })}
                  >
                    <SelectTrigger id="sheet-suburb" className="min-h-[40px] w-full border-transparent bg-[#F3F4F4]">
                      <SelectValue>
                        {filters.suburb === 'all' ? 'همه محله‌ها' : filters.suburb}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه محله‌ها</SelectItem>
                      {availableSuburbs.map((suburb) => (
                        <SelectItem key={suburb} value={suburb}>
                          {suburb}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Label className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <Tag className="size-3.5 text-primary" aria-hidden="true" />
                  <span>نوع معامله</span>
                </Label>
                <div
                  className="grid grid-cols-2 gap-1.5 rounded-xl bg-black/[0.06] p-1"
                  role="tablist"
                >
                  {TRANSACTION_OPTIONS.map((opt) => {
                    const isActive = filters.transactionType === opt.value;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onUpdateFilters({ transactionType: opt.value })}
                        className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg px-3 text-xs transition-all ${
                          isActive
                            ? 'bg-white font-bold text-primary shadow-xs ring-1 ring-primary/25'
                            : 'font-medium text-foreground/75 hover:bg-white/50 hover:text-foreground'
                        }`}
                      >
                        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Label htmlFor="sheet-category" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <Building2 className="size-3.5 text-primary" aria-hidden="true" />
                  <span>نوع کاربری ملک</span>
                </Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    onUpdateFilters({ category: (value ?? 'all') as PropertyCategory | 'all' })
                  }
                >
                  <SelectTrigger id="sheet-category" className="min-h-[40px] w-full border-transparent bg-[#F3F4F4]">
                    <SelectValue>{CATEGORY_LABELS[filters.category]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه کاربری‌ها</SelectItem>
                    <SelectItem value="apartment">آپارتمان</SelectItem>
                    <SelectItem value="villa">ویلا</SelectItem>
                    <SelectItem value="penthouse">پنت‌هاوس</SelectItem>
                    <SelectItem value="office">اداری و تجاری</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Label htmlFor="sheet-bedrooms" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <BedDouble className="size-3.5 text-primary" aria-hidden="true" />
                  <span>حداقل تعداد اتاق خواب</span>
                </Label>
                <Select
                  value={String(filters.minBedrooms)}
                  onValueChange={(value) =>
                    onUpdateFilters({ minBedrooms: Number(value ?? 0) })
                  }
                >
                  <SelectTrigger id="sheet-bedrooms" className="min-h-[40px] w-full border-transparent bg-[#F3F4F4]">
                    <SelectValue>{BEDROOM_LABELS[String(filters.minBedrooms)]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">همه تعداد خواب</SelectItem>
                    <SelectItem value="2">۲ خواب به بالا</SelectItem>
                    <SelectItem value="3">۳ خواب به بالا</SelectItem>
                    <SelectItem value="4">۴ خواب به بالا</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Label htmlFor="sheet-sort" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <ArrowUpDown className="size-3.5 text-primary" aria-hidden="true" />
                  <span>مرتب‌سازی نتایج</span>
                </Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    onUpdateFilters({ sortBy: (value ?? 'newest') as SortOption })
                  }
                >
                  <SelectTrigger id="sheet-sort" className="min-h-[40px] w-full border-transparent bg-[#F3F4F4]">
                    <SelectValue>{SORT_LABELS[filters.sortBy]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">جدیدترین‌ها</SelectItem>
                    <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                    <SelectItem value="price-desc">گران‌ترین</SelectItem>
                    <SelectItem value="area-desc">بیشترین متراژ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={onResetFilters}
                className="min-h-[44px] gap-1.5 rounded-xl px-4 text-xs font-semibold"
              >
                <RotateCcw className="size-4" />
                <span>بازنشانی</span>
              </Button>
            )}
            <Button
              type="button"
              onClick={() => onFilterSheetOpenChange(false)}
              className="min-h-[44px] flex-1 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-[#14523E]"
            >
              نمایش {formatNumberFa(totalCount)} ملک
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
