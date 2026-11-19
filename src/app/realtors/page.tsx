import type { Metadata } from 'next';
import { RealtorsDirectoryClient } from '@/components/realtors/RealtorsDirectoryClient';
import { ADVISORS, PROPERTIES } from '@/lib/properties';

export const metadata: Metadata = {
  title: 'فهرست مشاوران تخصصی املاک | ملک تو',
  description:
    'مشاوران تاییدشده سامانه ملک تو در شهرهای تهران، کرج، اصفهان و شیراز همراه با سوابق معاملات و فایل‌های فعال.',
  openGraph: {
    title: 'فهرست مشاوران تخصصی املاک | ملک تو',
    description:
      'مشاوران تاییدشده سامانه ملک تو در شهرهای منتخب همراه با سوابق معاملات، امتیاز رضایت مشتریان و فایل‌های فعال.',
    type: 'website',
    locale: 'fa_IR',
  },
};

export default function RealtorsDirectoryPage() {
  return <RealtorsDirectoryClient advisors={ADVISORS} properties={PROPERTIES} />;
}
