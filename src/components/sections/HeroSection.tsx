import { PropertyImage } from '@/components/properties/PropertyImage';
import { HeroSearchModule } from '@/components/sections/HeroSearchModule';
import { HERO_IMAGE_URL } from '@/lib/properties';

export function HeroSection() {
  return (
    <section id="top" className="bg-white">
      {/* Full-Screen Architectural Media Backdrop with Overlaid Typography & Filter Box */}
      <div className="relative flex min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4.5rem)] w-full flex-col justify-center overflow-hidden bg-[#0A1813]">
        {/* Full-Bleed Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <PropertyImage
              src={HERO_IMAGE_URL}
              alt="نمای معماری مدرن ساختمان مسکونی در شمال تهران با فضای سبز و بالکن شیشه‌ای"
              title="معماری معاصر شمال تهران"
              sizes="100vw"
              priority
            />
          </div>

          {/* Measured Multi-Stop Contrast Scrim for WCAG AA/AAA Text Legibility */}
          <div
            aria-hidden="true"
            className="
              absolute inset-0
              bg-gradient-to-t from-[#06130E]/92 via-[#091C14]/60 to-[#06130E]/45
            "
          />
        </div>

        {/* Center Overlay Content: Headline & Interactive Filter Box */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-5xl space-y-8 text-center lg:text-right">
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/85">
                سامانه تخصصی معاملات و کارشناسی املاک منتخب تهران
              </p>
              <h1 className="font-heading text-3xl font-extrabold leading-[1.25] text-white sm:text-5xl lg:text-[3.5rem] text-balance">
                انتخابی مطمئن برای خانه‌ای هم‌تراز با آرامش شما
              </h1>
            </div>

            {/* Overlaid Filter & Search Box */}
            <HeroSearchModule />
          </div>
        </div>
      </div>

      {/* Full-width 4-Column Architectural Trust Strip */}
      <div className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:divide-x-reverse">
          <div className="px-4 py-7 sm:px-6 sm:py-8">
            <p className="font-heading text-xl font-bold text-primary tabular-nums">
              +۲۴۰ فایل فعال
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              احراز هویت مالک و بررسی کامل سند پیش از انتشار
            </p>
          </div>
          <div className="px-4 py-7 sm:px-6 sm:py-8">
            <p className="font-heading text-xl font-bold text-primary tabular-nums">
              ۱۸ محله منتخب
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              پوشش تخصصی مناطق ۱، ۲ و ۳ تهران
            </p>
          </div>
          <div className="px-4 py-7 sm:px-6 sm:py-8">
            <p className="font-heading text-xl font-bold text-primary">
              کارشناسی قیمت واقعی
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              برآورد بر پایه معاملات ثبت‌شده ۳۰ روز اخیر
            </p>
          </div>
          <div className="px-4 py-7 sm:px-6 sm:py-8">
            <p className="font-heading text-xl font-bold text-primary">
              قرارداد با کد رهگیری
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              تنظیم مبایعه‌نامه و اجاره‌نامه رسمی با ناظر حقوقی
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
