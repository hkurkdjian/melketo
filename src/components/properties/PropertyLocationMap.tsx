'use client';

import { useState } from 'react';
import {
  ExternalLink,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  ShoppingBag,
  TrainFront,
  Trees,
} from 'lucide-react';
import { toPersianDigits } from '@/lib/propertyLogic';
import { NearbyPlace, NearbyPlaceType, Property } from '@/types/property';

interface PropertyLocationMapProps {
  property: Property;
}

const PLACE_TYPE_LABELS: Record<NearbyPlaceType, string> = {
  metro: 'ایستگاه مترو / حمل‌ونقل',
  park: 'فضای سبز و بوستان',
  shopping: 'مرکز خرید و خدمات',
  highway: 'دسترسی بزرگراهی',
};

function PlaceIcon({ type, className }: { type: NearbyPlaceType; className?: string }) {
  switch (type) {
    case 'metro':
      return <TrainFront className={className} aria-hidden="true" />;
    case 'park':
      return <Trees className={className} aria-hidden="true" />;
    case 'shopping':
      return <ShoppingBag className={className} aria-hidden="true" />;
    case 'highway':
      return <Navigation className={className} aria-hidden="true" />;
  }
}

export function PropertyLocationMap({ property }: PropertyLocationMapProps) {
  const { location, neighborhood, address } = property;
  const [zoom, setZoom] = useState(1);
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(
    location.nearbyPlaces[0] ?? null
  );

  const osmUrl = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=16/${location.lat}/${location.lng}`;

  const handleZoomIn = () => setZoom((z) => Math.min(1.6, Number((z + 0.2).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))));
  const handleReset = () => setZoom(1);

  return (
    <section
      aria-labelledby="location-map-heading"
      data-testid="property-location-map"
      className="space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 id="location-map-heading" className="font-heading text-xl font-bold text-foreground">
            موقعیت ملک روی نقشه و دسترسی‌های محلی
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {location.districtLabel} — {address}
          </p>
        </div>

        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/45 px-3.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white whitespace-nowrap shrink-0"
        >
          <span>مسیریابی در نقشه خارجی</span>
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Interactive District Vector Map */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-xl border border-border bg-[#F4F7F5]">
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <svg
            viewBox="0 0 800 420"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <rect width="800" height="420" fill="#F3F6F4" />

            <g fill="#E8EEEA" stroke="#DCE5DF" strokeWidth="1.5">
              <rect x="40" y="30" width="170" height="110" rx="8" />
              <rect x="250" y="30" width="210" height="110" rx="8" />
              <rect x="500" y="30" width="250" height="110" rx="8" />
              <rect x="40" y="175" width="170" height="100" rx="8" />
              <rect x="250" y="175" width="210" height="100" rx="8" />
              <rect x="500" y="175" width="250" height="100" rx="8" />
              <rect x="40" y="305" width="290" height="85" rx="8" />
              <rect x="370" y="305" width="380" height="85" rx="8" />
            </g>

            <rect x="515" y="45" width="120" height="78" rx="14" fill="#D8E7DD" stroke="#BFD6C7" />
            <circle cx="545" cy="78" r="14" fill="#BDD4C5" />
            <circle cx="585" cy="92" r="18" fill="#B5CEBD" />

            <g stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round">
              <line x1="230" y1="0" x2="230" y2="420" />
              <line x1="480" y1="0" x2="480" y2="420" />
              <line x1="0" y1="158" x2="800" y2="158" />
              <line x1="0" y1="290" x2="800" y2="290" />
            </g>

            <path
              d="M 0 218 Q 220 205 400 212 T 800 200"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="18"
            />
            <path
              d="M 0 218 Q 220 205 400 212 T 800 200"
              fill="none"
              stroke="#0F3D2E"
              strokeOpacity="0.14"
              strokeWidth="2"
              strokeDasharray="8 6"
            />

            {selectedPlace && (
              <line
                x1="400"
                y1="210"
                x2={(selectedPlace.x / 100) * 800}
                y2={(selectedPlace.y / 100) * 420}
                stroke="#0F3D2E"
                strokeWidth="2.5"
                strokeDasharray="6 5"
              />
            )}
          </svg>

          <div className="pointer-events-none absolute top-3 right-4 rounded bg-white/90 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-2xs">
            {location.streets[0]}
          </div>
          <div className="pointer-events-none absolute bottom-3 left-4 rounded bg-white/90 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-2xs">
            {location.streets[2]}
          </div>

          {location.nearbyPlaces.map((place) => {
            const isSelected = selectedPlace?.id === place.id;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelectedPlace(place)}
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                aria-label={`${place.name} - ${place.distance}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm transition-all ${
                  isSelected
                    ? 'z-20 border-primary bg-primary text-white scale-105'
                    : 'z-10 border-border bg-white text-foreground hover:border-primary hover:text-primary'
                }`}
              >
                <PlaceIcon type={place.type} className="size-3.5 shrink-0" />
                <span className="max-w-[115px] truncate">{place.name}</span>
              </button>
            );
          })}

          <div
            style={{ left: '50%', top: '50%' }}
            className="absolute z-30 -translate-x-1/2 -translate-y-4 flex flex-col items-center"
          >
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg">
              <MapPin className="size-5" aria-hidden="true" />
            </div>
            <div className="mt-1.5 whitespace-nowrap rounded-lg border border-primary/30 bg-white/95 px-2.5 py-1 text-center shadow-md backdrop-blur-xs">
              <p className="font-heading text-xs font-bold text-primary">
                موقعیت ملک ({neighborhood})
              </p>
              <p className="text-[10px] text-muted-foreground max-w-[165px] truncate">
                {address}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="بزرگنمایی نقشه"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-white/95 text-foreground shadow-xs hover:bg-primary hover:text-white"
          >
            <Plus className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="کوچک‌نمایی نقشه"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-white/95 text-foreground shadow-xs hover:bg-primary hover:text-white"
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="بازگشت به مرکز نقشه"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-white/95 text-foreground shadow-xs hover:bg-primary hover:text-white"
          >
            <LocateFixed className="size-4" />
          </button>
        </div>

        <div
          dir="ltr"
          className="pointer-events-none absolute top-3 left-3 z-20 rounded-md border border-border bg-white/95 px-2.5 py-1 text-[11px] font-medium text-muted-foreground tabular-nums shadow-2xs"
        >
          {toPersianDigits(location.lat.toFixed(4))}° N, {toPersianDigits(location.lng.toFixed(4))}° E
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-foreground">
          اماکن شاخص و دسترسی‌های اطراف (برای نمایش مسیر روی نقشه کلیک کنید):
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {location.nearbyPlaces.map((place) => {
            const isSelected = selectedPlace?.id === place.id;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelectedPlace(place)}
                className={`flex min-h-[48px] items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-right transition-colors ${
                  isSelected
                    ? 'border-primary bg-[#EAF1ED]/70'
                    : 'border-border bg-secondary/30 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-primary text-white' : 'bg-white text-primary border border-border'
                    }`}
                  >
                    <PlaceIcon type={place.type} className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{place.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {PLACE_TYPE_LABELS[place.type]}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-bold text-primary tabular-nums">
                  {place.distance}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
