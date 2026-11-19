'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  formatValue: (val: number) => string;
  minAriaLabel: string;
  maxAriaLabel: string;
  className?: string;
}

export function DualRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  minAriaLabel,
  maxAriaLabel,
  className,
}: DualRangeSliderProps) {
  const safeMax = Math.max(min + step, max);
  const clampedMin = Math.max(min, Math.min(value[0], value[1]));
  const clampedMax = Math.min(safeMax, Math.max(value[1], clampedMin));

  const span = safeMax - min || 1;
  const minPct = ((clampedMin - min) / span) * 100;
  const maxPct = ((clampedMax - min) / span) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const nextMin = Math.min(raw, clampedMax - step);
    onChange([Math.max(min, nextMin), clampedMax]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const nextMax = Math.max(raw, clampedMin + step);
    onChange([clampedMin, Math.min(safeMax, nextMax)]);
  };

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="grid grid-cols-2 gap-2 text-xs tabular-nums">
        <div className="rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5">
          <span className="block text-[10px] text-muted-foreground">حداقل</span>
          <span className="block text-[11px] font-semibold leading-snug text-foreground">
            {formatValue(clampedMin)}
          </span>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5">
          <span className="block text-[10px] text-muted-foreground">حداکثر</span>
          <span className="block text-[11px] font-semibold leading-snug text-primary">
            {formatValue(clampedMax)}
          </span>
        </div>
      </div>

      <div className="relative flex h-6 items-center select-none" dir="rtl">
        {/* Base Track */}
        <div className="relative h-1.5 w-full rounded-full bg-border">
          {/* Active Fill (RTL: min starts at right, max ends at left) */}
          <div
            className="absolute inset-y-0 rounded-full bg-[#0F3D2E]"
            style={{
              right: `${minPct}%`,
              left: `${100 - maxPct}%`,
            }}
          />
        </div>

        {/* Min Thumb */}
        <input
          type="range"
          min={min}
          max={safeMax}
          step={step}
          value={clampedMin}
          onChange={handleMinChange}
          aria-label={minAriaLabel}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0F3D2E] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0F3D2E] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm"
        />

        {/* Max Thumb */}
        <input
          type="range"
          min={min}
          max={safeMax}
          step={step}
          value={clampedMax}
          onChange={handleMaxChange}
          aria-label={maxAriaLabel}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0F3D2E] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0F3D2E] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm"
        />
      </div>
    </div>
  );
}
