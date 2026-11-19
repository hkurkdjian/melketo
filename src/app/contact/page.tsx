import type { Metadata } from 'next';
import { ContactPageClient } from '@/components/contact/ContactPageClient';

export const metadata: Metadata = {
  title: 'تماس با ما | ملک تو — سامانه تخصصی معرفی و معاملات املاک',
  description:
    'نشانی و تلفن مستقیم دفاتر الهیه، نیاوران، لواسان و مهرشهر کرج سامانه املاک ملک تو و فرم ثبت درخواست مشاوره و کارشناسی ملک.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
