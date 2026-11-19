'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function PropertyImage({
  src,
  alt,
  title,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}: PropertyImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F4F7F5] to-[#E3ECE7] p-6 text-center text-[#0F3D2E]',
          className
        )}
        role="img"
        aria-label={alt}
      >
        <Building2 className="size-8 opacity-60" strokeWidth={1.5} />
        <span className="font-heading text-sm font-semibold">{title}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
      className={cn('object-cover', className)}
    />
  );
}
