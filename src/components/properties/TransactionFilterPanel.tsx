'use client';

import {
  Banknote,
  BedDouble,
  Building2,
  CalendarClock,
  Check,
  Compass,
  FileCheck2,
  MapPin,
  Maximize2,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DualRangeSlider } from '@/components/ui/range-slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  formatNumberFa,
  formatPriceToman,
  getCategoryLabel,
  toPersianDigits,
  type TransactionRangeBounds,
} from '@/lib/propertyLogic';
import {
  PropertyCategory,
  TransactionCatalogFilters,
  TransactionType,
} from '@/types/property';

interface TransactionFilterPanelProps {
  transactionType: TransactionType;
  filters: TransactionCatalogFilters;
  bounds: TransactionRangeBounds;
  availableCities: string[];
  availableSuburbs: string[];
  availableCategories: PropertyCategory[];
  hasActiveFilters: boolean;
  activeFilterCount?: number;
  onUpdateFilters: (patch: Partial<TransactionCatalogFilters>) => void;
  onResetFilters: () => void;
  idPrefix?: string;
  hideHeading?: boolean;
}

function SemanticToggle({
  label,
  description,
  checked,
  onChange,
  testId,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  testId?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-testid={testId}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-right transition-colors ${
        checked
          ? 'bg-[#EAF1ED] text-primary'
          : 'bg-[#F3F4F4]/70 text-foreground hover:bg-[#EAF1ED]/45'
      }`}
    >
      <span
        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? 'border-primary bg-primary text-white'
            : 'border-muted-foreground/40 bg-white'
        }`}
        aria-hidden="true"
      >
        {checked && <Check className="size-3" strokeWidth={2.5} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs sm:text-sm font-semibold leading-snug">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[11px] text-muted-foreground leading-relaxed">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}

const BEDROOM_LABELS: Record<string, string> = {
  '0': 'همه',
  '2': '۲ خواب به بالا',
  '3': '۳ خواب به بالا',
  '4': '۴ خواب به بالا',
};

const AREA_OPTIONS = [
  { value: 0, label: 'همه متراژها' },
  { value: 180, label: '۱۸۰ متر به بالا' },
  { value: 220, label: '۲۲۰ متر به بالا' },
  { value: 300, label: '۳۰۰ متر به بالا' },
  { value: 450, label: '۴۵۰ متر به بالا' },
];

export function TransactionFilterPanel({
  transactionType,
  filters,
  bounds,
  availableCities,
  availableSuburbs,
  availableCategories,
  hasActiveFilters,
  activeFilterCount = 0,
  onUpdateFilters,
  onResetFilters,
  idPrefix = 'sidebar',
  hideHeading = false,
}: TransactionFilterPanelProps) {
  const isRent = transactionType === 'rent';
  const isBuy = transactionType === 'buy';
  const isPresale = transactionType === 'presale';

  return (
    <div className="space-y-3">
      {(!hideHeading || hasActiveFilters) && (
        <div className="flex items-center justify-between gap-2 px-1.5 py-1.5">
          {!hideHeading ? (
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-sm font-bold text-foreground">
                فیلترهای تخصصی
              </h2>
              {hasActiveFilters && activeFilterCount > 0 && (
                <span className="inline-flex size-5 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white tabular-nums">
                  {toPersianDigits(activeFilterCount)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">فیلترهای فعال</span>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              data-testid={`${idPrefix}-reset-filters`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
            >
              <span>بازنشانی</span>
              <RotateCcw className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {/* Search Card */}
      <div className="space-y-2 rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <Label
          htmlFor={`${idPrefix}-search`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold"
        >
          <Search className="size-3.5 text-primary" aria-hidden="true" />
          <span>جستجو در عنوان، محله یا کد</span>
        </Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id={`${idPrefix}-search`}
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="نام محله، خیابان یا کد ملک..."
            className="min-h-[40px] rounded-lg border-transparent bg-[#F3F4F4] pr-9 text-sm shadow-none focus-visible:border-border focus-visible:bg-white"
          />
        </div>
      </div>

      {/* Semantic Price Range Card */}
      <div className="rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {isRent ? (
          <div className="space-y-4">
            <div className="space-y-2" data-testid={`${idPrefix}-deposit-range`}>
              <Label className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <Banknote className="size-3.5 text-primary" aria-hidden="true" />
                <span>بازه مبلغ ودیعه (رهن)</span>
              </Label>
              <DualRangeSlider
                min={bounds.minDepositMillion}
                max={bounds.maxDepositMillion}
                step={100}
                value={[
                  filters.minDepositMillion ?? bounds.minDepositMillion,
                  filters.maxDepositMillion ?? bounds.maxDepositMillion,
                ]}
                onChange={([minDepositMillion, maxDepositMillion]) =>
                  onUpdateFilters({ minDepositMillion, maxDepositMillion })
                }
                formatValue={(v) => formatPriceToman(v)}
                minAriaLabel="حداقل ودیعه رهن"
                maxAriaLabel="حداکثر ودیعه رهن"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60" data-testid={`${idPrefix}-rent-range`}>
              <Label className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <Banknote className="size-3.5 text-primary" aria-hidden="true" />
                <span>بازه اجاره ماهیانه</span>
              </Label>
              <DualRangeSlider
                min={bounds.minRentMillion}
                max={bounds.maxRentMillion}
                step={5}
                value={[
                  filters.minRentMillion ?? bounds.minRentMillion,
                  filters.maxRentMillion ?? bounds.maxRentMillion,
                ]}
                onChange={([minRentMillion, maxRentMillion]) =>
                  onUpdateFilters({ minRentMillion, maxRentMillion })
                }
                formatValue={(v) => formatPriceToman(v)}
                minAriaLabel="حداقل اجاره ماهیانه"
                maxAriaLabel="حداکثر اجاره ماهیانه"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2" data-testid={`${idPrefix}-price-range`}>
            <Label className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <Banknote className="size-3.5 text-primary" aria-hidden="true" />
              <span>{isPresale ? 'بازه قیمت کل پروژه' : 'بازه قیمت کل ملک'}</span>
            </Label>
            <DualRangeSlider
              min={bounds.minPriceMillion}
              max={bounds.maxPriceMillion}
              step={5000}
              value={[
                filters.minPriceMillion ?? bounds.minPriceMillion,
                filters.maxPriceMillion ?? bounds.maxPriceMillion,
              ]}
              onChange={([minPriceMillion, maxPriceMillion]) =>
                onUpdateFilters({ minPriceMillion, maxPriceMillion })
              }
              formatValue={(v) => formatPriceToman(v)}
              minAriaLabel="حداقل قیمت کل"
              maxAriaLabel="حداکثر قیمت کل"
            />
          </div>
        )}
      </div>

      {/* Location, Category, Bedrooms & Area Module */}
      <div className="space-y-3 rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-city`} className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" />
              <span>شهر</span>
            </Label>
            <Select
              value={filters.city}
              onValueChange={(value) => onUpdateFilters({ city: value ?? 'all' })}
            >
              <SelectTrigger
                id={`${idPrefix}-city`}
                data-testid={`${idPrefix}-city-select`}
                className="h-10 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
              >
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

          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-suburb`} className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <Compass className="size-3.5 text-primary" aria-hidden="true" />
              <span>محله / منطقه</span>
            </Label>
            <Select
              value={filters.suburb}
              onValueChange={(value) => onUpdateFilters({ suburb: value ?? 'all' })}
            >
              <SelectTrigger
                id={`${idPrefix}-suburb`}
                data-testid={`${idPrefix}-suburb-select`}
                className="h-10 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
              >
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

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-category`} className="inline-flex items-center gap-1.5 text-xs font-semibold">
            <Building2 className="size-3.5 text-primary" aria-hidden="true" />
            <span>نوع کاربری ملک</span>
          </Label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              onUpdateFilters({ category: (value ?? 'all') as PropertyCategory | 'all' })
            }
          >
            <SelectTrigger
              id={`${idPrefix}-category`}
              data-testid={`${idPrefix}-category-select`}
              className="h-10 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
            >
              <SelectValue>
                {filters.category === 'all'
                  ? 'همه کاربری‌های مجاز'
                  : getCategoryLabel(filters.category)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه کاربری‌های مجاز</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-bedrooms`} className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <BedDouble className="size-3.5 text-primary" aria-hidden="true" />
              <span>{isRent ? 'حداقل تعداد اتاق / خواب' : 'حداقل تعداد خواب'}</span>
            </Label>
            <Select
              value={String(filters.minBedrooms)}
              onValueChange={(value) => onUpdateFilters({ minBedrooms: Number(value ?? 0) })}
            >
              <SelectTrigger
                id={`${idPrefix}-bedrooms`}
                className="h-10 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
              >
                <SelectValue>{BEDROOM_LABELS[String(filters.minBedrooms)] ?? 'همه'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">همه</SelectItem>
                <SelectItem value="2">۲ خواب به بالا</SelectItem>
                <SelectItem value="3">۳ خواب به بالا</SelectItem>
                <SelectItem value="4">۴ خواب به بالا</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-area`} className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <Maximize2 className="size-3.5 text-primary" aria-hidden="true" />
              <span>حداقل متراژ بنا</span>
            </Label>
            <Select
              value={String(filters.minArea <= bounds.minAreaSqm ? 0 : filters.minArea)}
              onValueChange={(value) => {
                const num = Number(value ?? 0);
                onUpdateFilters({ minArea: num === 0 ? bounds.minAreaSqm : num });
              }}
            >
              <SelectTrigger
                id={`${idPrefix}-area`}
                className="h-10 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
              >
                <SelectValue>
                  {filters.minArea <= bounds.minAreaSqm
                    ? 'همه متراژها'
                    : `${formatNumberFa(filters.minArea)} متر به بالا`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {AREA_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Semantic Filters Specific to Each Page */}
      {isBuy && (
        <div
          className="space-y-3 rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          data-testid={`${idPrefix}-semantic-buy`}
        >
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-deed`} className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <FileCheck2 className="size-3.5 text-primary" aria-hidden="true" />
              <span>وضعیت سند مالکیت</span>
            </Label>
            <Select
              value={filters.deedScope ?? 'all'}
              onValueChange={(value) =>
                onUpdateFilters({
                  deedScope: (value ?? 'all') as 'all' | 'single-deed',
                })
              }
            >
              <SelectTrigger
                id={`${idPrefix}-deed`}
                className="h-10 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
              >
                <SelectValue>
                  {filters.deedScope === 'single-deed'
                    ? 'فقط سند تک‌برگ شش‌دانگ'
                    : 'همه اسناد معتبر'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه اسناد معتبر</SelectItem>
                <SelectItem value="single-deed">فقط سند تک‌برگ شش‌دانگ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-1">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              <span>ویژگی‌های اختصاصی خرید</span>
            </p>
            <SemanticToggle
              label="فقط ساختمان تک‌واحدی"
              description="یک واحد در هر طبقه برای آرامش بیشتر"
              checked={Boolean(filters.singleUnitOnly)}
              onChange={(checked) => onUpdateFilters({ singleUnitOnly: checked })}
              testId={`${idPrefix}-toggle-single-unit`}
            />
            <SemanticToggle
              label="نوساز و کلیدنخورده (۱۴۰۳+)"
              checked={Boolean(filters.newlyBuiltOnly)}
              onChange={(checked) => onUpdateFilters({ newlyBuiltOnly: checked })}
              testId={`${idPrefix}-toggle-newly-built`}
            />
            <SemanticToggle
              label="حداقل ۳ پارکینگ سندی"
              checked={(filters.minParkingCount ?? 0) >= 3}
              onChange={(checked) => onUpdateFilters({ minParkingCount: checked ? 3 : 0 })}
              testId={`${idPrefix}-toggle-parking`}
            />
          </div>
        </div>
      )}

      {isRent && (
        <div
          className="space-y-2 rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          data-testid={`${idPrefix}-semantic-rent`}
        >
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <FileCheck2 className="size-3.5 text-primary" aria-hidden="true" />
            <span>شرایط قرارداد و کاربری اجاره</span>
          </p>
          <SemanticToggle
            label="سند رسمی اداری"
            description="مناسب دفاتر شرکت‌ها و کلینیک‌ها"
            checked={Boolean(filters.officeDeedOnly)}
            onChange={(checked) => onUpdateFilters({ officeDeedOnly: checked })}
            testId={`${idPrefix}-toggle-office-deed`}
          />
          <SemanticToggle
            label="قابل تبدیل ودیعه و اجاره"
            description="انعطاف در نسبت رهن و اجاره ماهیانه"
            checked={Boolean(filters.convertibleOnly)}
            onChange={(checked) => onUpdateFilters({ convertibleOnly: checked })}
            testId={`${idPrefix}-toggle-convertible`}
          />
          <SemanticToggle
            label="تخلیه و آماده سکونت فوری"
            checked={Boolean(filters.readyToMoveOnly)}
            onChange={(checked) => onUpdateFilters({ readyToMoveOnly: checked })}
            testId={`${idPrefix}-toggle-ready`}
          />
        </div>
      )}

      {isPresale && (
        <div
          className="space-y-3 rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          data-testid={`${idPrefix}-semantic-presale`}
        >
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-delivery`} className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <CalendarClock className="size-3.5 text-primary" aria-hidden="true" />
              <span>حداکثر زمان تحویل پروژه</span>
            </Label>
            <Select
              value={filters.maxDeliveryMonths == null ? 'all' : String(filters.maxDeliveryMonths)}
              onValueChange={(value) =>
                onUpdateFilters({
                  maxDeliveryMonths: value === 'all' || !value ? null : Number(value),
                })
              }
            >
              <SelectTrigger
                id={`${idPrefix}-delivery`}
                data-testid={`${idPrefix}-delivery-select`}
                className="h-10 w-full rounded-lg border-transparent bg-[#F3F4F4] text-xs sm:text-sm font-medium"
              >
                <SelectValue>
                  {filters.maxDeliveryMonths == null
                    ? 'همه زمان‌های تحویل'
                    : `تحویل تا ${formatNumberFa(filters.maxDeliveryMonths)} ماه آینده`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه زمان‌های تحویل</SelectItem>
                <SelectItem value="6">تحویل تا ۶ ماه آینده</SelectItem>
                <SelectItem value="8">تحویل تا ۸ ماه آینده</SelectItem>
                <SelectItem value="10">تحویل تا ۱۰ ماه آینده</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-1">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <FileCheck2 className="size-3.5 text-primary" aria-hidden="true" />
              <span>شرایط قرارداد و پروژه</span>
            </p>
            <SemanticToggle
              label="پرداخت مرحله‌ای و اقساطی"
              description="پیش‌پرداخت منعطف همزمان با پیشرفت ساخت"
              checked={Boolean(filters.installmentPaymentOnly)}
              onChange={(checked) => onUpdateFilters({ installmentPaymentOnly: checked })}
              testId={`${idPrefix}-toggle-installment`}
            />
            <SemanticToggle
              label="قرارداد رسمی با کد رهگیری"
              checked={Boolean(filters.officialContractOnly)}
              onChange={(checked) => onUpdateFilters({ officialContractOnly: checked })}
              testId={`${idPrefix}-toggle-official`}
            />
            <SemanticToggle
              label="پروژه تک‌واحدی"
              checked={Boolean(filters.singleUnitOnly)}
              onChange={(checked) => onUpdateFilters({ singleUnitOnly: checked })}
              testId={`${idPrefix}-toggle-presale-single`}
            />
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onResetFilters}
          className="min-h-[42px] w-full gap-1.5 rounded-xl bg-white text-xs font-semibold text-primary shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-primary hover:text-white"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          <span>بازنشانی همه فیلترها</span>
        </Button>
      )}
    </div>
  );
}
