import type { Metadata } from 'next';
import { AboutPageClient } from '@/components/about/AboutPageClient';

export const metadata: Metadata = {
  title: 'درباره ما | ملک تو — سامانه تخصصی معرفی و معاملات املاک',
  description:
    'آشنایی با استانداردهای کارشناسی فنی، ارزیابی قیمت واقعی و نظارت حقوقی قراردادها در سامانه تخصصی املاک ملک تو.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
