import type { Metadata } from 'next';
import { TransactionCatalogClient } from '@/components/properties/TransactionCatalogClient';
import { PROPERTIES } from '@/lib/properties';

export const metadata: Metadata = {
  title: 'رهن و اجاره ملک | ملک تو',
  description:
    'فایل‌های تخصصی رهن و اجاره آپارتمان و سند اداری با فیلتر جداگانه بازه ودیعه، اجاره ماهیانه، قابلیت تبدیل و وضعیت تخلیه',
};

export default function RentPropertiesPage() {
  const rentProperties = PROPERTIES.filter((p) => p.transactionType === 'rent');

  return (
    <TransactionCatalogClient
      transactionType="rent"
      properties={rentProperties}
      breadcrumbLabel="رهن و اجاره"
      title="فایل‌های تخصصی رهن و اجاره مسکونی و اداری"
      subtitle="جستجو و مقایسه دقیق فایل‌های اجاره بر پایه بازه ودیعه (رهن)، سقف اجاره ماهیانه، قابلیت تبدیل و کاربری رسمی اداری یا مسکونی."
    />
  );
}
