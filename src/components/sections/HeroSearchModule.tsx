'use client';

import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppShell } from '@/hooks/useAppShell';
import { PROPERTIES } from '@/lib/properties';
import { getAvailableCities } from '@/lib/propertyLogic';
import { TransactionType } from '@/types/property';

const TRANSACTION_TABS: Array<{
  value: TransactionType | 'all';
  label: string;
}> = [
  { value: 'all', label: 'همه فایل‌ها' },
  { value: 'buy', label: 'خرید' },
  { value: 'rent', label: 'رهن و اجاره' },
  { value: 'presale', label: 'پیش‌فروش' },
];

const AVAILABLE_CITIES = getAvailableCities(PROPERTIES);

export function HeroSearchModule() {
  const { filters, updateFilters, exploreListings } = useAppShell();

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    exploreListings();
  };

  return (
    <form
      onSubmit={handleQuickSubmit}
      data-testid="hero-filter-box"
      className="w-full max-w-3xl rounded-[28px] bg-white p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] space-y-3.5"
    >
      {/* Top Row: Transaction Filter Pills */}
      <div
        className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-3"
        role="tablist"
        aria-label="فیلتر سریع نوع معامله"
      >
        {TRANSACTION_TABS.map((tab) => {
          const active = filters.transactionType === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => updateFilters({ transactionType: tab.value })}
              className={`inline-flex h-10 sm:h-11 items-center justify-center whitespace-nowrap rounded-full px-4 sm:px-5 text-sm sm:text-base transition-colors ${
                active
                  ? 'bg-[#E6F4EA] font-semibold text-[#0F3D2E]'
                  : 'bg-transparent font-medium text-[#4D5954] hover:bg-[#F3F4F4]/80 hover:text-[#0F3D2E]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: City Select (with City Icon) + Search Input + Square Green Search Button */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div className="w-32 sm:w-44 shrink-0">
          <Select
            value={filters.city}
            onValueChange={(value) => updateFilters({ city: value ?? 'all' })}
          >
            <SelectTrigger
              aria-label="انتخاب شهر در جستجوی سریع"
              className="h-13 sm:h-14 data-[size=default]:h-13 sm:data-[size=default]:h-14 w-full rounded-2xl border-0 bg-[#F3F4F4] px-3.5 sm:px-4 text-sm sm:text-base font-medium text-foreground shadow-none hover:bg-[#EAECEB] focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin
                  className="size-4 shrink-0 text-[#4D5954]"
                  aria-hidden="true"
                />
                <SelectValue>
                  {filters.city === 'all' ? 'شهر' : filters.city}
                </SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه شهرها</SelectItem>
              {AVAILABLE_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0 flex-1">
          <Input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            placeholder="محله، خیابان، کد ملک..."
            aria-label="جستجوی محله، خیابان یا کد ملک"
            className="h-13 sm:h-14 w-full rounded-2xl border-0 bg-[#F3F4F4] px-4 sm:px-5 text-sm sm:text-base text-foreground shadow-none placeholder:text-[#7A8580] focus-visible:bg-[#EAECEB] focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        <Button
          type="submit"
          aria-label="جستجوی فایل‌ها"
          className="h-13 w-13 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-[#1B4332] p-0 text-white shadow-none hover:bg-[#14523E]"
        >
          <Search className="size-5 text-white" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
