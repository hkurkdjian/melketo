'use client';

import Link from 'next/link';
import { BookmarkX, Trash2 } from 'lucide-react';
import { PropertyImage } from '@/components/properties/PropertyImage';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatNumberFa, formatPriceToman } from '@/lib/propertyLogic';
import { Property } from '@/types/property';

interface FavoritesSheetProps {
  open: boolean;
  favorites: Property[];
  onOpenChange: (open: boolean) => void;
  onRemoveFavorite: (id: string) => void;
  onClearFavorites: () => void;
}

export function FavoritesSheet({
  open,
  favorites,
  onOpenChange,
  onRemoveFavorite,
  onClearFavorites,
}: FavoritesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pl-10 text-right">
          <SheetTitle className="font-heading text-lg font-bold text-foreground">
            املاک نشان‌شده ({formatNumberFa(favorites.length)})
          </SheetTitle>
          <SheetDescription>
            فایل‌هایی که برای بررسی بیشتر ذخیره کرده‌اید.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-6 text-center">
              <BookmarkX className="size-8 text-muted-foreground" />
              <p className="font-heading text-base font-semibold text-foreground">
                هنوز ملکی نشان نکرده‌اید
              </p>
              <p className="text-xs leading-6 text-muted-foreground">
                روی آیکون نشانه‌گذاری در بالای هر کارت ملک کلیک کنید تا در این فهرست ذخیره شود.
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-white p-2.5 transition-colors hover:border-primary/40"
              >
                <Link
                  href={`/properties/${item.id}`}
                  prefetch={false}
                  onClick={() => onOpenChange(false)}
                  className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
                >
                  <PropertyImage
                    src={item.imageUrl}
                    alt={item.title}
                    title={item.title}
                    sizes="80px"
                  />
                </Link>
                <div className="min-w-0 flex-1 space-y-1">
                  <Link
                    href={`/properties/${item.id}`}
                    prefetch={false}
                    onClick={() => onOpenChange(false)}
                    className="block w-full truncate text-right font-heading text-sm font-bold text-foreground hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {item.neighborhood} · {formatNumberFa(item.areaSqm)} متر
                  </p>
                  <p className="text-xs font-bold text-primary tabular-nums">
                    {item.transactionType === 'rent'
                      ? `رهن ${formatPriceToman(item.depositMillion ?? 0)}`
                      : formatPriceToman(item.priceMillion ?? 0)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onRemoveFavorite(item.id)}
                  aria-label={`حذف ${item.title} از نشان‌شده‌ها`}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {favorites.length > 0 && (
          <SheetFooter className="border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClearFavorites}
              className="h-10 w-full text-xs font-medium"
            >
              پاک‌کردن همه نشان‌شده‌ها
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
