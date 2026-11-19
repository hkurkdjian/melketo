'use client';

import Link from 'next/link';
import { Bookmark, MapPin } from 'lucide-react';
import { PropertyImage } from '@/components/properties/PropertyImage';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  formatNumberFa,
  formatPricePerSqm,
  formatPriceToman,
  getCategoryLabel,
  getTransactionLabel,
  toPersianDigits,
} from '@/lib/propertyLogic';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyCardProps) {
  const isRent = property.transactionType === 'rent';
  const detailHref = `/properties/${property.id}`;

  return (
    <Card className="group relative flex h-full cursor-pointer flex-col justify-between gap-0 rounded-xl border border-border bg-card py-0 ring-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      {/* Image Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        <PropertyImage
          src={property.imageUrl}
          alt={`${property.title} در ${property.neighborhood}`}
          title={property.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Action Icon Control (Top Left in RTL) - sits above stretched card link */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            aria-label={
              isFavorite
                ? `حذف ${property.title} از نشان‌شده‌ها`
                : `افزودن ${property.title} به نشان‌شده‌ها`
            }
            aria-pressed={isFavorite}
            className={`inline-flex size-11 sm:size-10 items-center justify-center rounded-lg border transition-colors ${
              isFavorite
                ? 'border-primary bg-primary text-white'
                : 'border-white/70 bg-white/95 text-foreground hover:border-primary hover:text-primary'
            }`}
          >
            <Bookmark className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Subtle Bottom Contrast Scrim + Unboxed Property Code */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent px-4 pt-8 pb-3">
          <div className="flex items-center justify-between text-xs font-medium text-white">
            <span>{getTransactionLabel(property.transactionType)}</span>
            <span className="tabular-nums opacity-90">
              کد {toPersianDigits(property.code)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/* Clean Unboxed Metadata with Dot Separators */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="font-medium text-foreground">
              {property.city}، {property.neighborhood}
            </span>
            <span aria-hidden="true">·</span>
            <span>{getCategoryLabel(property.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">ساخت {toPersianDigits(property.buildYear)}</span>
          </div>
          {property.featuredLabel && (
            <span className="shrink-0 font-medium text-primary">
              {property.featuredLabel}
            </span>
          )}
        </div>

        {/* Title with stretched link covering the entire card */}
        <h3 className="font-heading text-lg font-bold leading-snug text-foreground line-clamp-2">
          <Link
            href={detailHref}
            prefetch={false}
            aria-label={`مشاهده جزئیات ${property.title}`}
            className="text-right transition-colors group-hover:text-primary focus-visible:outline-none after:absolute after:inset-0 after:z-10 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {property.title}
          </Link>
        </h3>

        {/* Key Specs Line */}
        <div className="flex items-center gap-3 border-t border-border pt-3 text-xs sm:text-sm text-muted-foreground tabular-nums">
          <span>
            <strong className="font-semibold text-foreground">
              {formatNumberFa(property.areaSqm)}
            </strong>{' '}
            متر
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="font-semibold text-foreground">
              {formatNumberFa(property.bedrooms)}
            </strong>{' '}
            خواب
          </span>
          <span aria-hidden="true">·</span>
          <span>
            طبقه{' '}
            <strong className="font-semibold text-foreground">
              {formatNumberFa(property.floor)}
            </strong>{' '}
            از {formatNumberFa(property.totalFloors)}
          </span>
        </div>
      </CardContent>

      {/* Card Price Footer (No separate button — entire card is clickable) */}
      <CardFooter className="flex items-center justify-between gap-3 border-t border-border bg-secondary/40 px-5 py-3.5">
        {isRent ? (
          <div className="flex w-full items-baseline justify-between gap-2 tabular-nums">
            <p className="font-heading text-base font-bold text-primary truncate">
              رهن {formatPriceToman(property.depositMillion ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground shrink-0">
              اجاره {formatPriceToman(property.monthlyRentMillion ?? 0)}
            </p>
          </div>
        ) : (
          <div className="flex w-full items-baseline justify-between gap-2 tabular-nums">
            <p className="font-heading text-base font-bold text-primary truncate">
              {formatPriceToman(property.priceMillion ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground shrink-0">
              {formatPricePerSqm(property.priceMillion ?? 0, property.areaSqm)}
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
