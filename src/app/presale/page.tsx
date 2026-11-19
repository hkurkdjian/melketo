import type { Metadata } from 'next';
import { TransactionCatalogClient } from '@/components/properties/TransactionCatalogClient';
import { PROPERTIES } from '@/lib/properties';

export const metadata: Metadata = {
  title: 'پیش‌فروش پروژه‌های ساختمانی | ملک تو',
  description:
    'پروژه‌های پیش‌فروش برند با فیلتر بازه قیمت، حداکثر زمان تحویل، شرایط پرداخت مرحله‌ای و تعهد سند رسمی',
};

export default function PresalePropertiesPage() {
  const presaleProperties = PROPERTIES.filter((p) => p.transactionType === 'presale');

  return (
    <TransactionCatalogClient
      transactionType="presale"
      properties={presaleProperties}
      breadcrumbLabel="پیش‌فروش"
      title="پروژه‌های منتخب پیش‌فروش و سرمایه‌گذاری"
      subtitle="پروژه‌های در حال ساخت با تضمین تحویل و رزومه سازنده معتبر، قابل فیلتر بر اساس بازه قیمت کل، زمان تحویل و شرایط پرداخت مرحله‌ای."
    />
  );
}
