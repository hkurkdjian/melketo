export type TransactionType = 'buy' | 'rent' | 'presale';

export type PropertyCategory = 'apartment' | 'villa' | 'penthouse' | 'office';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'area-desc';

export type NearbyPlaceType = 'metro' | 'park' | 'shopping' | 'highway';

export interface PropertyGalleryItem {
  id: string;
  url: string;
  title: string;
  caption: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  type: NearbyPlaceType;
  distance: string;
  x: number;
  y: number;
}

export interface PropertyLocation {
  lat: number;
  lng: number;
  districtLabel: string;
  streets: [string, string, string];
  nearbyPlaces: NearbyPlace[];
}

export interface AdvisorReview {
  id: string;
  author: string;
  neighborhood: string;
  dealType: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Advisor {
  id: string;
  name: string;
  role: string;
  specialty: string;
  city: string;
  suburbs: string[];
  experienceYears: number;
  closedDeals: number;
  score: number;
  reviewCount: number;
  responseTime: string;
  phone: string;
  email: string;
  officeAddress: string;
  licenseCode: string;
  bio: string;
  scoreBreakdown: {
    responsiveness: number;
    priceTransparency: number;
    legalAccuracy: number;
  };
  reviews: AdvisorReview[];
}

export interface Property {
  id: string;
  code: string;
  title: string;
  transactionType: TransactionType;
  category: PropertyCategory;
  neighborhood: string;
  city: string;
  address: string;
  /** Total price in million Toman (for buy & presale) */
  priceMillion?: number;
  /** Deposit (رهن / ودیعه) in million Toman (for rent) */
  depositMillion?: number;
  /** Monthly rent (اجاره ماهیانه) in million Toman (for rent) */
  monthlyRentMillion?: number;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  unitsPerFloor: number;
  ceilingHeightMeters: number;
  buildYear: number;
  parkingCount: number;
  hasElevator: boolean;
  hasStorage: boolean;
  deedType: string;
  orientation: string;
  coolingSystem: string;
  heatingSystem: string;
  floorMaterial: string;
  cabinetType: string;
  availabilityStatus: string;
  description: string;
  highlights: string[];
  amenities: string[];
  imageUrl: string;
  gallery: PropertyGalleryItem[];
  location: PropertyLocation;
  advisorId: string;
  createdAtOrder: number;
  featuredLabel?: string;
}

export interface FilterState {
  searchQuery: string;
  transactionType: TransactionType | 'all';
  category: PropertyCategory | 'all';
  city: string;
  suburb: string;
  minBedrooms: number;
  sortBy: SortOption;
}

export interface TransactionCatalogFilters {
  searchQuery: string;
  category: PropertyCategory | 'all';
  city: string;
  suburb: string;
  minBedrooms: number;
  minArea: number;
  sortBy: SortOption;
  /** Buy & Presale total price bounds (million Toman) */
  minPriceMillion?: number;
  maxPriceMillion?: number;
  /** Rent deposit bounds (million Toman) */
  minDepositMillion?: number;
  maxDepositMillion?: number;
  /** Rent monthly rent bounds (million Toman) */
  minRentMillion?: number;
  maxRentMillion?: number;
  /** Buy semantic filters */
  deedScope?: 'all' | 'single-deed';
  singleUnitOnly?: boolean;
  newlyBuiltOnly?: boolean;
  minParkingCount?: number;
  /** Rent semantic filters */
  officeDeedOnly?: boolean;
  convertibleOnly?: boolean;
  readyToMoveOnly?: boolean;
  /** Presale semantic filters */
  maxDeliveryMonths?: number | null;
  installmentPaymentOnly?: boolean;
  officialContractOnly?: boolean;
}

export interface VisitFormValues {
  name: string;
  phone: string;
  preferredDate: string;
  note: string;
}

export interface ConsultationFormValues {
  name: string;
  phone: string;
  requestType: 'buy' | 'rent' | 'sell';
  neighborhood: string;
  details: string;
}
