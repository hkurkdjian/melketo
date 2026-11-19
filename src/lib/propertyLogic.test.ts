import test from 'node:test';
import assert from 'node:assert/strict';
import { ADVISORS, PROPERTIES } from './properties';
import {
  convertRahnEjareh,
  createDefaultTransactionFilters,
  filterAdvisorsByCity,
  filterAndSortProperties,
  filterTransactionProperties,
  formatPricePerSqm,
  formatPriceToman,
  formatScoreFa,
  getAvailableAdvisorCities,
  getAvailableCities,
  getAvailableSuburbs,
  getEstimatedDeliveryMonths,
  getRealtorActiveListings,
  getSimilarProperties,
  getTransactionRangeBounds,
  toPersianDigits,
  validateConsultationForm,
  validateIranianPhone,
  validateOtpCode,
  validateVisitForm,
} from './propertyLogic';

test('toPersianDigits converts ASCII numerals to Persian numerals', () => {
  assert.equal(toPersianDigits('1403-0912'), '۱۴۰۳-۰۹۱۲');
  assert.equal(toPersianDigits(380), '۳۸۰');
  assert.equal(formatScoreFa(4.9), '۴.۹');
});

test('formatPriceToman formats millions and billions properly', () => {
  assert.equal(formatPriceToman(114000), '۱۱۴ میلیارد تومان');
  assert.equal(formatPriceToman(44500), '۴۴.۵ میلیارد تومان');
  assert.equal(formatPriceToman(850), '۸۵۰ میلیون تومان');
  assert.equal(formatPriceToman(0), 'توافقی');
});

test('formatPricePerSqm computes rounded price per square meter', () => {
  assert.equal(formatPricePerSqm(114000, 380), 'متری ۳۰۰ میلیون');
  assert.equal(formatPricePerSqm(0, 100), '—');
});

test('filterAndSortProperties filters by transaction type, category, city, suburb, bedrooms, and search query', () => {
  const rentResults = filterAndSortProperties(PROPERTIES, {
    searchQuery: '',
    transactionType: 'rent',
    category: 'all',
    city: 'all',
    suburb: 'all',
    minBedrooms: 0,
    sortBy: 'newest',
  });
  assert.equal(rentResults.length, 3);
  assert.ok(rentResults.every((p) => p.transactionType === 'rent'));

  const karajResults = filterAndSortProperties(PROPERTIES, {
    searchQuery: '',
    transactionType: 'all',
    category: 'all',
    city: 'کرج',
    suburb: 'all',
    minBedrooms: 0,
    sortBy: 'newest',
  });
  assert.equal(karajResults.length, 2);
  assert.ok(karajResults.every((p) => p.city === 'کرج'));

  const mehrshahrResults = filterAndSortProperties(PROPERTIES, {
    searchQuery: '',
    transactionType: 'all',
    category: 'all',
    city: 'کرج',
    suburb: 'مهرشهر',
    minBedrooms: 0,
    sortBy: 'newest',
  });
  assert.equal(mehrshahrResults.length, 1);
  assert.equal(mehrshahrResults[0].neighborhood, 'مهرشهر');

  const niavaranResults = filterAndSortProperties(PROPERTIES, {
    searchQuery: 'نیاوران',
    transactionType: 'all',
    category: 'all',
    city: 'all',
    suburb: 'all',
    minBedrooms: 0,
    sortBy: 'newest',
  });
  assert.equal(niavaranResults.length, 1);
  assert.equal(niavaranResults[0].neighborhood, 'نیاوران');

  const highBedBuy = filterAndSortProperties(PROPERTIES, {
    searchQuery: '',
    transactionType: 'buy',
    category: 'all',
    city: 'all',
    suburb: 'all',
    minBedrooms: 4,
    sortBy: 'area-desc',
  });
  assert.equal(highBedBuy[0].areaSqm >= highBedBuy[1].areaSqm, true);
});

test('getAvailableCities and getAvailableSuburbs return scoped city and suburb options', () => {
  const cities = getAvailableCities(PROPERTIES);
  assert.deepEqual(cities, ['تهران', 'کرج', 'اصفهان', 'شیراز']);

  const karajSuburbs = getAvailableSuburbs(PROPERTIES, 'کرج');
  assert.deepEqual(karajSuburbs, ['مهرشهر', 'عظیمیه']);

  const allSuburbs = getAvailableSuburbs(PROPERTIES, 'all');
  assert.equal(allSuburbs.length, 12);
});

test('advisor filtering by city and active listings lookup work accurately', () => {
  const advisorCities = getAvailableAdvisorCities(ADVISORS);
  assert.deepEqual(advisorCities, ['تهران', 'کرج', 'اصفهان', 'شیراز']);

  const tehranAdvisors = filterAdvisorsByCity(ADVISORS, 'تهران');
  assert.equal(tehranAdvisors.length, 3);

  const shirazAdvisors = filterAdvisorsByCity(ADVISORS, 'شیراز');
  assert.equal(shirazAdvisors.length, 1);
  assert.equal(shirazAdvisors[0].id, 'adv-6');

  const adv1Listings = getRealtorActiveListings('adv-1', PROPERTIES);
  assert.equal(adv1Listings.length, 3);
  assert.ok(adv1Listings.every((p) => p.advisorId === 'adv-1'));
});

test('getSimilarProperties excludes target and ranks similar transaction/category listings first', () => {
  const target = PROPERTIES[0]; // buy, penthouse
  const similar = getSimilarProperties(target, PROPERTIES, 3);
  assert.equal(similar.length, 3);
  assert.ok(similar.every((item) => item.id !== target.id));
  assert.ok(
    similar.some((item) => item.transactionType === 'buy' || item.category === 'penthouse')
  );
  assert.equal(similar.some((item) => item.id === 'prop-6'), false);
});

test('convertRahnEjareh converts deposit and monthly rent accurately', () => {
  const fullRahn = convertRahnEjareh(3000, 30, 4000);
  assert.equal(fullRahn.depositMillion, 4000);
  assert.equal(fullRahn.monthlyRentMillion, 0);

  const halfRahn = convertRahnEjareh(3000, 30, 2000);
  assert.equal(halfRahn.depositMillion, 2000);
  assert.equal(halfRahn.monthlyRentMillion, 60);
});

test('validateIranianPhone handles both Latin and Persian digits', () => {
  assert.equal(validateIranianPhone('09123456789'), true);
  assert.equal(validateIranianPhone('۰۹۱۲۳۴۵۶۷۸۹'), true);
  assert.equal(validateIranianPhone('0912 345 6789'), true);
  assert.equal(validateIranianPhone('02122334455'), false);
  assert.equal(validateIranianPhone('0912345'), false);
});

test('validateOtpCode validates 4-digit Persian and Latin verification codes', () => {
  assert.equal(validateOtpCode('1234'), true);
  assert.equal(validateOtpCode('۱۲۳۴'), true);
  assert.equal(validateOtpCode('123'), false);
  assert.equal(validateOtpCode('abcd'), false);
});

test('validateVisitForm and validateConsultationForm return field-specific Persian errors', () => {
  const invalidVisit = validateVisitForm({
    name: 'ا',
    phone: '1234',
    preferredDate: '',
  });
  assert.ok(invalidVisit.name);
  assert.ok(invalidVisit.phone);
  assert.ok(invalidVisit.preferredDate);

  const validVisit = validateVisitForm({
    name: 'سارا محمدی',
    phone: '۰۹۱۲۸۷۶۵۴۳۲',
    preferredDate: 'فردا ساعت ۱۷ تا ۱۸',
  });
  assert.deepEqual(validVisit, {});

  const invalidConsult = validateConsultationForm({
    name: '',
    phone: '0912',
    neighborhood: '',
  });
  assert.ok(invalidConsult.name);
  assert.ok(invalidConsult.phone);
  assert.ok(invalidConsult.neighborhood);
});

test('filterTransactionProperties enforces transaction scope, price range, and semantic filters for buy', () => {
  const buyBounds = getTransactionRangeBounds(PROPERTIES, 'buy');
  assert.equal(buyBounds.minPriceMillion <= 24500, true);
  assert.equal(buyBounds.maxPriceMillion >= 165000, true);

  const defaultBuy = createDefaultTransactionFilters(buyBounds, 'buy');
  const allBuy = filterTransactionProperties(PROPERTIES, 'buy', defaultBuy);
  assert.equal(allBuy.length, 6);
  assert.ok(allBuy.every((p) => p.transactionType === 'buy'));

  // Price range 20B to 60B (20,000 to 60,000 million)
  const midBudgetBuy = filterTransactionProperties(PROPERTIES, 'buy', {
    ...defaultBuy,
    minPriceMillion: 20000,
    maxPriceMillion: 60000,
  });
  assert.equal(midBudgetBuy.length, 3); // prop-4 (56B), prop-7 (44.5B), prop-10 (24.5B)
  assert.ok(midBudgetBuy.every((p) => (p.priceMillion ?? 0) >= 20000 && (p.priceMillion ?? 0) <= 60000));

  // Semantic buy filter: single-unit + buildYear >= 1403
  const newSingleUnits = filterTransactionProperties(PROPERTIES, 'buy', {
    ...defaultBuy,
    singleUnitOnly: true,
    newlyBuiltOnly: true,
  });
  assert.equal(newSingleUnits.length, 3); // prop-1, prop-9, prop-10
  assert.ok(newSingleUnits.every((p) => p.unitsPerFloor === 1 && p.buildYear >= 1403));
});

test('filterTransactionProperties filters rent by deposit range, monthly rent range, and rent-specific semantics', () => {
  const rentBounds = getTransactionRangeBounds(PROPERTIES, 'rent');
  const defaultRent = createDefaultTransactionFilters(rentBounds, 'rent');
  const allRent = filterTransactionProperties(PROPERTIES, 'rent', defaultRent);
  assert.equal(allRent.length, 3);

  // Office deed semantic filter
  const officeOnly = filterTransactionProperties(PROPERTIES, 'rent', {
    ...defaultRent,
    officeDeedOnly: true,
  });
  assert.equal(officeOnly.length, 1);
  assert.equal(officeOnly[0].id, 'prop-6');

  // Convertible deposit/rent semantic filter
  const convertibleOnly = filterTransactionProperties(PROPERTIES, 'rent', {
    ...defaultRent,
    convertibleOnly: true,
  });
  assert.equal(convertibleOnly.length, 1);
  assert.equal(convertibleOnly[0].id, 'prop-3');

  // Monthly rent range cap <= 120 million
  const rentCapped = filterTransactionProperties(PROPERTIES, 'rent', {
    ...defaultRent,
    maxRentMillion: 120,
  });
  assert.equal(rentCapped.length, 2);
  assert.ok(rentCapped.every((p) => (p.monthlyRentMillion ?? 0) <= 120));
});

test('filterTransactionProperties filters presale by price range, delivery months, and presale-specific semantics', () => {
  const presaleBounds = getTransactionRangeBounds(PROPERTIES, 'presale');
  const defaultPresale = createDefaultTransactionFilters(presaleBounds, 'presale');
  const allPresale = filterTransactionProperties(PROPERTIES, 'presale', defaultPresale);
  assert.equal(allPresale.length, 3);

  assert.equal(getEstimatedDeliveryMonths(PROPERTIES.find((p) => p.id === 'prop-5')!), 8);
  assert.equal(getEstimatedDeliveryMonths(PROPERTIES.find((p) => p.id === 'prop-11')!), 6);

  const within8Months = filterTransactionProperties(PROPERTIES, 'presale', {
    ...defaultPresale,
    maxDeliveryMonths: 8,
  });
  assert.equal(within8Months.length, 2); // prop-5 (8m), prop-11 (6m)

  const installmentOnly = filterTransactionProperties(PROPERTIES, 'presale', {
    ...defaultPresale,
    installmentPaymentOnly: true,
  });
  assert.equal(installmentOnly.length, 2); // prop-5, prop-8
});
