'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProfileDialog, type UserProfile } from '@/components/modals/AuthProfileDialog';
import { ConsultationDialog } from '@/components/modals/ConsultationDialog';
import { FavoritesSheet } from '@/components/modals/FavoritesSheet';
import { PROPERTIES } from '@/lib/properties';
import { getAvailableSuburbs } from '@/lib/propertyLogic';
import { FilterState, Property, TransactionType } from '@/types/property';

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  transactionType: 'all',
  category: 'all',
  city: 'all',
  suburb: 'all',
  minBedrooms: 0,
  sortBy: 'newest',
};

const FAVORITES_STORAGE_KEY = 'melkto_favorites_v1';
const USER_STORAGE_KEY = 'melkto_user_v1';

export type ActiveView =
  | 'home'
  | 'buy'
  | 'rent'
  | 'presale'
  | 'property'
  | 'realtors'
  | 'realtor'
  | 'about'
  | 'contact';

export interface AppShellContextValue {
  activeView: ActiveView;
  activeProperty: Property | null;
  filters: FilterState;
  activeFilterCount: number;
  favoriteIds: string[];
  favoriteProperties: Property[];
  user: UserProfile | null;
  favoritesOpen: boolean;
  consultationOpen: boolean;
  filterSheetOpen: boolean;
  visitModalOpen: boolean;
  authOpen: boolean;
  setFavoritesOpen: (open: boolean) => void;
  setConsultationOpen: (open: boolean) => void;
  setFilterSheetOpen: (open: boolean) => void;
  setVisitModalOpen: (open: boolean) => void;
  setAuthOpen: (open: boolean) => void;
  updateFilters: (patch: Partial<FilterState>) => void;
  resetFilters: () => void;
  selectTransactionAndScroll: (type: TransactionType | 'all') => void;
  exploreListings: () => void;
  openMobileFilters: () => void;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  setUser: (user: UserProfile | null) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [storageHydrated, setStorageHydrated] = useState(false);

  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    try {
      const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed.filter((id): id is string => typeof id === 'string'));
        }
      }
      const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (
          parsedUser &&
          typeof parsedUser.name === 'string' &&
          typeof parsedUser.phone === 'string'
        ) {
          setUser(parsedUser);
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setStorageHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!storageHydrated) return;
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage errors
    }
  }, [favoriteIds, storageHydrated]);

  useEffect(() => {
    if (!storageHydrated) return;
    try {
      if (user) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [user, storageHydrated]);

  useEffect(() => {
    setVisitModalOpen(false);
  }, [pathname]);

  const activeView: ActiveView = useMemo(() => {
    if (pathname === '/buy') return 'buy';
    if (pathname === '/rent') return 'rent';
    if (pathname === '/presale') return 'presale';
    if (pathname.startsWith('/properties/')) return 'property';
    if (pathname === '/realtors') return 'realtors';
    if (pathname.startsWith('/realtors/')) return 'realtor';
    if (pathname === '/about') return 'about';
    if (pathname === '/contact') return 'contact';
    return 'home';
  }, [pathname]);

  const activeProperty = useMemo(() => {
    if (!pathname.startsWith('/properties/')) return null;
    const propertyId = pathname.replace('/properties/', '').split('/')[0];
    return PROPERTIES.find((p) => p.id === propertyId) ?? null;
  }, [pathname]);

  const favoriteProperties = useMemo(
    () => PROPERTIES.filter((p) => favoriteIds.includes(p.id)),
    [favoriteIds]
  );

  const activeFilterCount =
    (filters.transactionType !== 'all' ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.city !== 'all' ? 1 : 0) +
    (filters.suburb !== 'all' ? 1 : 0) +
    (filters.minBedrooms > 0 ? 1 : 0) +
    (filters.sortBy !== 'newest' ? 1 : 0) +
    (filters.searchQuery.trim().length > 0 ? 1 : 0);

  const updateFilters = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      if (patch.city !== undefined) {
        const validSuburbs = getAvailableSuburbs(PROPERTIES, patch.city);
        if (next.suburb !== 'all' && !validSuburbs.includes(next.suburb)) {
          next.suburb = 'all';
        }
      }
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const scrollToListings = useCallback(
    (delayMs = 0) => {
      setTimeout(() => {
        document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, delayMs);
    },
    []
  );

  const exploreListings = useCallback(() => {
    if (pathname !== '/') {
      router.push('/#listings');
      return;
    }
    scrollToListings(0);
  }, [pathname, router, scrollToListings]);

  const selectTransactionAndScroll = useCallback(
    (transactionType: TransactionType | 'all') => {
      if (transactionType === 'buy' || transactionType === 'rent' || transactionType === 'presale') {
        router.push(`/${transactionType}`);
        return;
      }
      updateFilters({ transactionType });
      if (pathname !== '/') {
        router.push('/#listings');
        return;
      }
      scrollToListings(0);
    },
    [pathname, router, scrollToListings, updateFilters]
  );

  const openMobileFilters = useCallback(() => {
    if (pathname !== '/') {
      router.push('/#listings');
      setTimeout(() => {
        setFilterSheetOpen(true);
      }, 150);
      return;
    }
    scrollToListings(0);
    setFilterSheetOpen(true);
  }, [pathname, router, scrollToListings]);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
  }, []);

  const value: AppShellContextValue = {
    activeView,
    activeProperty,
    filters,
    activeFilterCount,
    favoriteIds,
    favoriteProperties,
    user,
    favoritesOpen,
    consultationOpen,
    filterSheetOpen,
    visitModalOpen,
    authOpen,
    setFavoritesOpen,
    setConsultationOpen,
    setFilterSheetOpen,
    setVisitModalOpen,
    setAuthOpen,
    updateFilters,
    resetFilters,
    selectTransactionAndScroll,
    exploreListings,
    openMobileFilters,
    toggleFavorite,
    clearFavorites,
    setUser,
  };

  return (
    <AppShellContext.Provider value={value}>
      {children}

      <AuthProfileDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        user={user}
        favoritesCount={favoriteProperties.length}
        onLogin={(loggedInUser) => setUser(loggedInUser)}
        onLogout={() => setUser(null)}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onOpenConsultation={() => setConsultationOpen(true)}
      />

      <FavoritesSheet
        open={favoritesOpen}
        favorites={favoriteProperties}
        onOpenChange={setFavoritesOpen}
        onRemoveFavorite={toggleFavorite}
        onClearFavorites={clearFavorites}
      />

      <ConsultationDialog open={consultationOpen} onOpenChange={setConsultationOpen} />
    </AppShellContext.Provider>
  );
}

export function useAppShellContext(): AppShellContextValue {
  const ctx = useContext(AppShellContext);
  if (!ctx) {
    throw new Error('useAppShell must be used inside AppShellProvider');
  }
  return ctx;
}
