import type { Metadata } from 'next';
import { TransactionCatalogClient } from '@/components/properties/TransactionCatalogClient';
import { PROPERTIES } from '@/lib/properties';

export const metadata: Metadata = {
  title: 'خرید و فروش ملک | ملک تو',
  description:
    'فهرست اختصاصی املاک آماده خرید و فروش با فیلتر بازه قیمت، سند تک‌برگ، تک‌واحدی، شهر و محله در سامانه ملک تو',
};

export default function BuyPropertiesPage() {
  const buyProperties = PROPERTIES.filter((p) => p.transactionType === 'buy');

  return (
    <TransactionCatalogClient
      transactionType="buy"
      properties={buyProperties}
      breadcrumbLabel="خرید و فروش ملک"
      title="فهرست املاک آماده خرید و فروش"
      subtitle="واحدهای مسکونی، پنت‌هاوس‌ها و ویلاهای سنددار بررسی‌شده با امکان فیلتر دقیق بر اساس بازه قیمت کل، وضعیت سند تک‌برگ، تک‌واحدی و منطقه."
    />
  );
}
