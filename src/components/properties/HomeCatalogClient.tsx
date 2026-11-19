'use client';

import { useMemo } from 'react';
import { Building2, RotateCcw } from 'lucide-react';
import { ListingToolbar } from '@/components/properties/ListingToolbar';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { useAppShell } from '@/hooks/useAppShell';
import {
  filterAndSortProperties,
  getAvailableCities,
  getAvailableSuburbs,
} from '@/lib/propertyLogic';
import { Property } from '@/types/property';

interface HomeCatalogClientProps {
  properties: Property[];
}

export function HomeCatalogClient({ properties }: HomeCatalogClientProps) {
  const {
    filters,
    favoriteIds,
    filterSheetOpen,
    setFilterSheetOpen,
    updateFilters,
    resetFilters,
    toggleFavorite,
  } = useAppShell();

  const availableCities = useMemo(() => getAvailableCities(properties), [properties]);
  const availableSuburbs = useMemo(
    () => getAvailableSuburbs(properties, filters.city),
    [properties, filters.city]
  );

  const filteredProperties = useMemo(
    () => filterAndSortProperties(properties, filters),
    [properties, filters]
  );

  return (
    <section
      id="listings"
      className="scroll-mt-20 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16 space-y-8"
    >
      <ListingToolbar
        filters={filters}
        availableCities={availableCities}
        availableSuburbs={availableSuburbs}
        totalCount={filteredProperties.length}
        filterSheetOpen={filterSheetOpen}
        onFilterSheetOpenChange={setFilterSheetOpen}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
      />

      {filteredProperties.length === 0 ? (
        <div
          data-testid="empty-listings-state"
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-secondary/35 px-6 py-16 text-center"
        >
          <Building2 className="size-10 text-primary/70" strokeWidth={1.5} />
          <div className="space-y-1.5">
            <h3 className="font-heading text-xl font-bold text-foreground">
              ملکی با مشخصات انتخابی یافت نشد
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              می‌توانید عبارت جستجو یا شهر و محله را تغییر دهید یا فیلترهای فعال را پاک‌سازی کنید.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            className="min-h-[44px] gap-2 px-5 text-sm font-medium border-primary/30 text-primary hover:bg-primary hover:text-white"
          >
            <RotateCcw className="size-4" />
            <span>پاک‌سازی فیلترها</span>
          </Button>
        </div>
      ) : (
        <div
          data-testid="property-grid"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7"
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
    </section>
  );
}
