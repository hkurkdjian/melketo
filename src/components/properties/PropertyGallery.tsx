'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Images, X } from 'lucide-react';
import { PropertyImage } from '@/components/properties/PropertyImage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { toPersianDigits } from '@/lib/propertyLogic';
import { PropertyGalleryItem } from '@/types/property';

interface PropertyGalleryProps {
  propertyTitle: string;
  items: PropertyGalleryItem[];
}

export function PropertyGallery({ propertyTitle, items }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeItems = items.length > 0 ? items : [];
  const total = safeItems.length;
  const activeItem = safeItems[activeIndex] ?? safeItems[0];

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [propertyTitle]);

  const openAt = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const goPrev = () => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, total]);

  if (total === 0) {
    return null;
  }

  const primary = safeItems[0];
  const secondary = safeItems.slice(1, 5);

  return (
    <div className="space-y-3">
      {/* Desktop & Tablet Editorial Multi-Photo Grid (md+) */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-3">
        {/* Primary Featured Photo */}
        <div className="group relative md:col-span-7 overflow-hidden rounded-xl border border-border bg-secondary">
          <button
            type="button"
            onClick={() => openAt(0)}
            aria-label={`بزرگنمایی تصویر: ${primary.title}`}
            className="relative block aspect-[16/11] w-full text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PropertyImage
              src={primary.url}
              alt={`${propertyTitle} - ${primary.title}`}
              title={primary.title}
              sizes="(max-width: 1024px) 60vw, 55vw"
              priority
              className="transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pt-10 pb-3.5">
              <div className="flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="font-heading text-base font-bold">{primary.title}</p>
                  <p className="text-xs text-white/80 line-clamp-1">{primary.caption}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1 text-xs font-medium backdrop-blur-xs">
                  <Expand className="size-3.5" aria-hidden="true" />
                  <span>بزرگنمایی</span>
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Secondary 2x2 Grid */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3">
          {secondary.map((item, idx) => {
            const realIndex = idx + 1;
            const isLastTile = idx === secondary.length - 1;
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-secondary"
              >
                <button
                  type="button"
                  onClick={() => openAt(realIndex)}
                  aria-label={`بزرگنمایی تصویر: ${item.title}`}
                  className="relative block h-full min-h-[135px] w-full text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <PropertyImage
                    src={item.url}
                    alt={`${propertyTitle} - ${item.title}`}
                    title={item.title}
                    sizes="(max-width: 1024px) 25vw, 20vw"
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 pt-7 pb-2.5">
                    <p className="text-xs font-semibold text-white line-clamp-1">
                      {item.title}
                    </p>
                  </div>
                  {isLastTile && (
                    <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-xs">
                      <Images className="size-3.5 text-primary" aria-hidden="true" />
                      <span className="tabular-nums">{toPersianDigits(total)} تصویر</span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Adaptive Gallery (< md) */}
      <div className="md:hidden space-y-2.5">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-secondary">
          <button
            type="button"
            onClick={() => openAt(activeIndex)}
            aria-label={`بزرگنمایی تصویر: ${activeItem.title}`}
            className="relative block h-full w-full text-right"
          >
            <PropertyImage
              src={activeItem.url}
              alt={`${propertyTitle} - ${activeItem.title}`}
              title={activeItem.title}
              sizes="100vw"
              priority
            />
          </button>

          {/* Touch Prev / Next Controls (>= 44x44px) */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="تصویر قبلی"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-xs hover:bg-primary"
              >
                <ChevronRight className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="تصویر بعدی"
                className="absolute top-1/2 left-2.5 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-xs hover:bg-primary"
              >
                <ChevronLeft className="size-5" />
              </button>
            </>
          )}

          {/* Top Left Counter + Expand Button */}
          <button
            type="button"
            onClick={() => openAt(activeIndex)}
            className="absolute top-3 left-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs"
          >
            <Expand className="size-3.5 text-primary" aria-hidden="true" />
            <span className="tabular-nums">
              تصویر {toPersianDigits(activeIndex + 1)} از {toPersianDigits(total)}
            </span>
          </button>

          {/* Active Image Title Scrim */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pt-8 pb-3 text-white">
            <p className="font-heading text-sm font-bold">{activeItem.title}</p>
            <p className="text-[11px] text-white/80 line-clamp-1">{activeItem.caption}</p>
          </div>
        </div>

        {/* Titled Thumbnail Strip on Mobile */}
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="انتخاب بخش‌های ملک"
        >
          {safeItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`flex w-28 shrink-0 flex-col overflow-hidden rounded-lg border text-right transition-colors ${
                  isActive
                    ? 'border-primary ring-1 ring-primary bg-primary/5'
                    : 'border-border bg-white'
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                  <PropertyImage
                    src={item.url}
                    alt={item.title}
                    title={item.title}
                    sizes="120px"
                  />
                </div>
                <span className="px-2 py-1.5 text-[11px] font-medium text-foreground line-clamp-1">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Bar Below Grid */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          برای مشاهده نمای بزرگ و نام هر بخش از ملک، روی تصویر کلیک کنید.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => openAt(activeIndex)}
          className="min-h-[44px] gap-2 px-4 text-xs sm:text-sm font-semibold border-primary/25 text-primary hover:bg-primary hover:text-white"
        >
          <Images className="size-4" aria-hidden="true" />
          <span>مشاهده تمام تصاویر با عنوان بخش‌ها ({toPersianDigits(total)})</span>
        </Button>
      </div>

      {/* Expanded Gallery Lightbox Modal with Image Titles */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          data-testid="gallery-lightbox"
          className="max-h-[95vh] w-full overflow-hidden border-neutral-800 bg-neutral-950 p-0 text-white sm:max-w-5xl"
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3.5 sm:px-6">
            <div className="min-w-0 space-y-1 text-right">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span className="font-semibold text-emerald-300 tabular-nums">
                  تصویر {toPersianDigits(activeIndex + 1)} از {toPersianDigits(total)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{propertyTitle}</span>
              </div>
              <DialogTitle
                data-testid="lightbox-image-title"
                className="font-heading text-lg font-bold text-white sm:text-xl"
              >
                {activeItem.title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-white/75">
                {activeItem.caption}
              </DialogDescription>
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="بستن گالری تصاویر"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center bg-black px-2 py-3 sm:px-6 sm:py-5">
            <div className="relative aspect-[16/10] max-h-[55vh] w-full overflow-hidden rounded-lg bg-neutral-900">
              <PropertyImage
                src={activeItem.url}
                alt={`${propertyTitle} - ${activeItem.title}`}
                title={activeItem.title}
                sizes="90vw"
              />
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="تصویر قبلی گالری"
                  data-testid="lightbox-prev"
                  className="absolute top-1/2 right-4 -translate-y-1/2 inline-flex size-11 sm:size-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-colors hover:bg-[#0F3D2E]"
                >
                  <ChevronRight className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="تصویر بعدی گالری"
                  data-testid="lightbox-next"
                  className="absolute top-1/2 left-4 -translate-y-1/2 inline-flex size-11 sm:size-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition-colors hover:bg-[#0F3D2E]"
                >
                  <ChevronLeft className="size-6" />
                </button>
              </>
            )}
          </div>

          <div className="border-t border-white/10 bg-neutral-900/95 px-4 py-3 sm:px-6">
            <div className="flex gap-2.5 overflow-x-auto pb-1" role="list" aria-label="فهرست تصاویر ملک">
              {safeItems.map((item, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`flex w-36 shrink-0 flex-col overflow-hidden rounded-lg border text-right transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-white/10 ring-1 ring-emerald-400'
                        : 'border-white/15 bg-black/40 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <PropertyImage
                        src={item.url}
                        alt={item.title}
                        title={item.title}
                        sizes="144px"
                      />
                    </div>
                    <div className="px-2.5 py-1.5">
                      <p className="text-[11px] font-semibold text-white line-clamp-1">
                        {item.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
