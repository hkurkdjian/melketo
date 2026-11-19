import Link from 'next/link';
import { Building2, Home, Users } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-secondary/50 text-primary">
        <Building2 className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-primary tabular-nums">خطای ۴۰۴</p>
        <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
          صفحه یا فایل مورد نظر یافت نشد
        </h1>
        <p className="max-w-md text-sm leading-7 text-muted-foreground">
          ممکن است آدرس واردشده نادرست باشد یا فایل ملکی از فهرست آگهی‌های فعال خارج شده باشد.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          prefetch={false}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#14523E]"
        >
          <Home className="size-4" aria-hidden="true" />
          <span>بازگشت به فهرست املاک</span>
        </Link>
        <Link
          href="/realtors"
          prefetch={false}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Users className="size-4" aria-hidden="true" />
          <span>مشاهده مشاوران</span>
        </Link>
      </div>
    </section>
  );
}
