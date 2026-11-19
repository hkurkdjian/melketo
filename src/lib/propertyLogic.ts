import {
  Advisor,
  FilterState,
  Property,
  PropertyCategory,
  TransactionCatalogFilters,
  TransactionType,
} from '@/types/property';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

export function normalizeDigitsToLatin(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

export function formatNumberFa(value: number): string {
  return toPersianDigits(Math.round(value).toLocaleString('en-US'));
}

export function formatScoreFa(score: number): string {
  return toPersianDigits(score.toFixed(1));
}

export function formatPriceToman(amountInMillion: number): string {
  if (amountInMillion <= 0) {
    return 'توافقی';
  }
  if (amountInMillion >= 1000) {
    const billions = amountInMillion / 1000;
    const formatted =
      billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1).replace(/\.0$/, '');
    return `${toPersianDigits(formatted)} میلیارد تومان`;
  }
  return `${formatNumberFa(amountInMillion)} میلیون تومان`;
}

export function formatPricePerSqm(priceMillion: number, areaSqm: number): string {
  if (areaSqm <= 0 || priceMillion <= 0) {
    return '—';
  }
  const perSqm = Math.round(priceMillion / areaSqm);
  return `متری ${formatNumberFa(perSqm)} میلیون`;
}

export function getTransactionLabel(type: TransactionType): string {
  switch (type) {
    case 'buy':
      return 'خرید';
    case 'rent':
      return 'رهن و اجاره';
    case 'presale':
      return 'پیش‌فروش';
  }
}

export function getCategoryLabel(category: PropertyCategory): string {
  switch (category) {
    case 'apartment':
      return 'آپارتمان';
    case 'villa':
      return 'ویلا';
    case 'penthouse':
      return 'پنت‌هاوس';
    case 'office':
      return 'اداری و تجاری';
  }
}

export function getPropertySortValue(property: Property): number {
  if (property.transactionType === 'rent') {
    const deposit = property.depositMillion ?? 0;
    const rent = property.monthlyRentMillion ?? 0;
    return deposit + rent * 33.33;
  }
  return property.priceMillion ?? 0;
}

export function getAvailableCities(properties: Property[]): string[] {
  const seen = new Set<string>();
  const cities: string[] = [];
  for (const item of properties) {
    if (!seen.has(item.city)) {
      seen.add(item.city);
      cities.push(item.city);
    }
  }
  return cities;
}

export function getAvailableSuburbs(properties: Property[], city: string): string[] {
  const seen = new Set<string>();
  const suburbs: string[] = [];
  for (const item of properties) {
    if (city !== 'all' && item.city !== city) {
      continue;
    }
    if (!seen.has(item.neighborhood)) {
      seen.add(item.neighborhood);
      suburbs.push(item.neighborhood);
    }
  }
  return suburbs;
}

export function getAvailableAdvisorCities(advisors: Advisor[]): string[] {
  const seen = new Set<string>();
  const cities: string[] = [];
  for (const advisor of advisors) {
    if (!seen.has(advisor.city)) {
      seen.add(advisor.city);
      cities.push(advisor.city);
    }
  }
  return cities;
}

export function filterAdvisorsByCity(
  advisors: Advisor[],
  city: string,
  searchQuery = ''
): Advisor[] {
  const query = searchQuery.trim().toLowerCase();
  return advisors.filter((advisor) => {
    if (city !== 'all' && advisor.city !== city) {
      return false;
    }
    if (query.length > 0) {
      const searchable = `${advisor.name} ${advisor.role} ${advisor.specialty} ${advisor.city} ${advisor.suburbs.join(' ')}`.toLowerCase();
      if (!searchable.includes(query)) {
        return false;
      }
    }
    return true;
  });
}

export function getRealtorActiveListings(
  advisorId: string,
  properties: Property[]
): Property[] {
  return properties
    .filter((property) => property.advisorId === advisorId)
    .sort((a, b) => b.createdAtOrder - a.createdAtOrder);
}

export function filterAndSortProperties(
  properties: Property[],
  filters: FilterState
): Property[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = properties.filter((item) => {
    if (filters.transactionType !== 'all' && item.transactionType !== filters.transactionType) {
      return false;
    }
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (filters.city !== 'all' && item.city !== filters.city) {
      return false;
    }
    if (filters.suburb !== 'all' && item.neighborhood !== filters.suburb) {
      return false;
    }
    if (filters.minBedrooms > 0 && item.bedrooms < filters.minBedrooms) {
      return false;
    }
    if (query.length > 0) {
      const searchable = `${item.title} ${item.neighborhood} ${item.address} ${item.city} ${item.code}`.toLowerCase();
      if (!searchable.includes(query)) {
        return false;
      }
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return getPropertySortValue(a) - getPropertySortValue(b);
      case 'price-desc':
        return getPropertySortValue(b) - getPropertySortValue(a);
      case 'area-desc':
        return b.areaSqm - a.areaSqm;
      case 'newest':
      default:
        return b.createdAtOrder - a.createdAtOrder;
    }
  });
}

export interface TransactionRangeBounds {
  minPriceMillion: number;
  maxPriceMillion: number;
  minDepositMillion: number;
  maxDepositMillion: number;
  minRentMillion: number;
  maxRentMillion: number;
  minAreaSqm: number;
  maxAreaSqm: number;
}

export function getTransactionRangeBounds(
  properties: Property[],
  transactionType: TransactionType
): TransactionRangeBounds {
  const scoped = properties.filter((p) => p.transactionType === transactionType);
  if (scoped.length === 0) {
    return {
      minPriceMillion: 0,
      maxPriceMillion: 100000,
      minDepositMillion: 0,
      maxDepositMillion: 5000,
      minRentMillion: 0,
      maxRentMillion: 200,
      minAreaSqm: 50,
      maxAreaSqm: 500,
    };
  }

  const areas = scoped.map((p) => p.areaSqm);
  const minAreaSqm = Math.floor(Math.min(...areas) / 10) * 10;
  const maxAreaSqm = Math.ceil(Math.max(...areas) / 10) * 10;

  if (transactionType === 'rent') {
    const deposits = scoped.map((p) => p.depositMillion ?? 0);
    const rents = scoped.map((p) => p.monthlyRentMillion ?? 0);
    return {
      minPriceMillion: 0,
      maxPriceMillion: 0,
      minDepositMillion: Math.max(0, Math.floor(Math.min(...deposits) / 500) * 500),
      maxDepositMillion: Math.ceil(Math.max(...deposits) / 500) * 500,
      minRentMillion: Math.max(0, Math.floor(Math.min(...rents) / 10) * 10),
      maxRentMillion: Math.ceil(Math.max(...rents) / 10) * 10,
      minAreaSqm,
      maxAreaSqm,
    };
  }

  const prices = scoped.map((p) => p.priceMillion ?? 0);
  const step = 5000;
  return {
    minPriceMillion: Math.max(0, Math.floor(Math.min(...prices) / step) * step),
    maxPriceMillion: Math.ceil(Math.max(...prices) / step) * step,
    minDepositMillion: 0,
    maxDepositMillion: 0,
    minRentMillion: 0,
    maxRentMillion: 0,
    minAreaSqm,
    maxAreaSqm,
  };
}

export function createDefaultTransactionFilters(
  bounds: TransactionRangeBounds,
  transactionType: TransactionType,
  initialQuery = ''
): TransactionCatalogFilters {
  return {
    searchQuery: initialQuery,
    category: 'all',
    city: 'all',
    suburb: 'all',
    minBedrooms: 0,
    minArea: bounds.minAreaSqm,
    sortBy: 'newest',
    minPriceMillion: transactionType === 'rent' ? undefined : bounds.minPriceMillion,
    maxPriceMillion: transactionType === 'rent' ? undefined : bounds.maxPriceMillion,
    minDepositMillion: transactionType === 'rent' ? bounds.minDepositMillion : undefined,
    maxDepositMillion: transactionType === 'rent' ? bounds.maxDepositMillion : undefined,
    minRentMillion: transactionType === 'rent' ? bounds.minRentMillion : undefined,
    maxRentMillion: transactionType === 'rent' ? bounds.maxRentMillion : undefined,
    deedScope: 'all',
    singleUnitOnly: false,
    newlyBuiltOnly: false,
    minParkingCount: 0,
    officeDeedOnly: false,
    convertibleOnly: false,
    readyToMoveOnly: false,
    maxDeliveryMonths: null,
    installmentPaymentOnly: false,
    officialContractOnly: false,
  };
}

export function getEstimatedDeliveryMonths(property: Property): number | null {
  const combined = `${property.availabilityStatus} ${property.featuredLabel ?? ''}`;
  const normalized = normalizeDigitsToLatin(combined);
  const match = normalized.match(/(\d+)\s*ماه/);
  if (!match) {
    return null;
  }
  const months = Number(match[1]);
  return Number.isFinite(months) ? months : null;
}

export function filterTransactionProperties(
  properties: Property[],
  transactionType: TransactionType,
  filters: TransactionCatalogFilters
): Property[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = properties.filter((item) => {
    if (item.transactionType !== transactionType) {
      return false;
    }
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (filters.city !== 'all' && item.city !== filters.city) {
      return false;
    }
    if (filters.suburb !== 'all' && item.neighborhood !== filters.suburb) {
      return false;
    }
    if (filters.minBedrooms > 0 && item.bedrooms < filters.minBedrooms) {
      return false;
    }
    if (filters.minArea > 0 && item.areaSqm < filters.minArea) {
      return false;
    }

    if (transactionType === 'rent') {
      const deposit = item.depositMillion ?? 0;
      const rent = item.monthlyRentMillion ?? 0;
      if (filters.minDepositMillion !== undefined && deposit < filters.minDepositMillion) {
        return false;
      }
      if (filters.maxDepositMillion !== undefined && deposit > filters.maxDepositMillion) {
        return false;
      }
      if (filters.minRentMillion !== undefined && rent < filters.minRentMillion) {
        return false;
      }
      if (filters.maxRentMillion !== undefined && rent > filters.maxRentMillion) {
        return false;
      }
      if (filters.officeDeedOnly && !item.deedType.includes('اداری')) {
        return false;
      }
      if (filters.convertibleOnly) {
        const convertibleText = `${item.featuredLabel ?? ''} ${item.highlights.join(' ')}`;
        if (!convertibleText.includes('تبدیل')) {
          return false;
        }
      }
      if (filters.readyToMoveOnly) {
        const readyText = item.availabilityStatus;
        if (!readyText.includes('آماده') && !readyText.includes('تخلیه')) {
          return false;
        }
      }
    } else {
      const price = item.priceMillion ?? 0;
      if (filters.minPriceMillion !== undefined && price < filters.minPriceMillion) {
        return false;
      }
      if (filters.maxPriceMillion !== undefined && price > filters.maxPriceMillion) {
        return false;
      }
    }

    if (transactionType === 'buy') {
      if (
        filters.deedScope === 'single-deed' &&
        !item.deedType.includes('تک‌برگ')
      ) {
        return false;
      }
      if (filters.singleUnitOnly && item.unitsPerFloor !== 1) {
        return false;
      }
      if (filters.newlyBuiltOnly && item.buildYear < 1403) {
        return false;
      }
      if ((filters.minParkingCount ?? 0) > 0 && item.parkingCount < (filters.minParkingCount ?? 0)) {
        return false;
      }
    }

    if (transactionType === 'presale') {
      if (filters.maxDeliveryMonths != null) {
        const months = getEstimatedDeliveryMonths(item);
        if (months === null || months > filters.maxDeliveryMonths) {
          return false;
        }
      }
      if (filters.installmentPaymentOnly) {
        const paymentText = `${item.description} ${item.featuredLabel ?? ''} ${item.highlights.join(' ')} ${item.amenities.join(' ')}`;
        if (
          !paymentText.includes('اقساط') &&
          !paymentText.includes('مرحله') &&
          !paymentText.includes('پرداخت')
        ) {
          return false;
        }
      }
      if (filters.officialContractOnly) {
        if (!item.deedType.includes('رسمی') && !item.deedType.includes('کد رهگیری')) {
          return false;
        }
      }
      if (filters.singleUnitOnly && item.unitsPerFloor !== 1) {
        return false;
      }
    }

    if (query.length > 0) {
      const searchable = `${item.title} ${item.neighborhood} ${item.address} ${item.city} ${item.code} ${item.deedType}`.toLowerCase();
      if (!searchable.includes(query)) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return getPropertySortValue(a) - getPropertySortValue(b);
      case 'price-desc':
        return getPropertySortValue(b) - getPropertySortValue(a);
      case 'area-desc':
        return b.areaSqm - a.areaSqm;
      case 'newest':
      default:
        return b.createdAtOrder - a.createdAtOrder;
    }
  });
}

/**
 * Returns ranked similar properties for a target listing based on transaction type,
 * category, city/neighborhood match, and area proximity.
 */
export function getSimilarProperties(
  target: Property,
  allProperties: Property[],
  limit = 3
): Property[] {
  const candidates = allProperties.filter((item) => item.id !== target.id);

  const scored = candidates.map((candidate) => {
    let score = 0;
    if (candidate.transactionType === target.transactionType) score += 50;
    if (candidate.category === target.category) score += 30;
    if (candidate.city === target.city) score += 15;
    if (candidate.neighborhood === target.neighborhood) score += 20;

    const areaDiffRatio =
      Math.abs(candidate.areaSqm - target.areaSqm) / Math.max(target.areaSqm, 1);
    score += Math.max(0, 15 - areaDiffRatio * 15);

    return { candidate, score };
  });

  scored.sort((a, b) => b.score - a.score || b.candidate.createdAtOrder - a.candidate.createdAtOrder);

  return scored.slice(0, limit).map((entry) => entry.candidate);
}

/**
 * Standard Iranian real estate Rahn-to-Ejareh conversion:
 * Every 100 million Toman deposit equals 3 million Toman monthly rent.
 */
export function convertRahnEjareh(
  baseDepositMillion: number,
  baseMonthlyRentMillion: number,
  targetDepositMillion: number,
  ratePer100Million = 3
): { depositMillion: number; monthlyRentMillion: number } {
  const totalEquivalentDeposit =
    baseDepositMillion + (baseMonthlyRentMillion / ratePer100Million) * 100;
  const clampedDeposit = Math.max(0, Math.min(targetDepositMillion, totalEquivalentDeposit));
  const remainingDeposit = totalEquivalentDeposit - clampedDeposit;
  const monthlyRent = Math.max(0, Math.round((remainingDeposit / 100) * ratePer100Million));

  return {
    depositMillion: Math.round(clampedDeposit),
    monthlyRentMillion: monthlyRent,
  };
}

export function validateIranianPhone(phone: string): boolean {
  const normalized = normalizeDigitsToLatin(phone).replace(/[\s-]/g, '');
  return /^09\d{9}$/.test(normalized);
}

export function validateOtpCode(code: string): boolean {
  const normalized = normalizeDigitsToLatin(code).replace(/\s/g, '');
  return /^\d{4}$/.test(normalized);
}

export function validateVisitForm(data: {
  name: string;
  phone: string;
  preferredDate: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (data.name.trim().length < 2) {
    errors.name = 'لطفاً نام و نام خانوادگی معتبر وارد کنید.';
  }
  if (!validateIranianPhone(data.phone)) {
    errors.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.';
  }
  if (!data.preferredDate.trim()) {
    errors.preferredDate = 'انتخاب زمان پیشنهادی بازدید الزامی است.';
  }
  return errors;
}

export function validateConsultationForm(data: {
  name: string;
  phone: string;
  neighborhood: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (data.name.trim().length < 2) {
    errors.name = 'لطفاً نام کامل خود را وارد کنید.';
  }
  if (!validateIranianPhone(data.phone)) {
    errors.phone = 'شماره تماس معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).';
  }
  if (data.neighborhood.trim().length < 2) {
    errors.neighborhood = 'لطفاً محله یا محدوده مورد نظر را مشخص کنید.';
  }
  return errors;
}
