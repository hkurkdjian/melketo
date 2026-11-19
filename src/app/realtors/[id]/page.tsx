import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RealtorProfileClient } from '@/components/realtors/RealtorProfileClient';
import { ADVISORS, PROPERTIES } from '@/lib/properties';
import { getRealtorActiveListings } from '@/lib/propertyLogic';

interface RealtorProfilePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return ADVISORS.map((advisor) => ({ id: advisor.id }));
}

export async function generateMetadata({
  params,
}: RealtorProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const advisor = ADVISORS.find((a) => a.id === id);

  if (!advisor) {
    return {
      title: 'مشاور یافت نشد | ملک تو',
    };
  }

  const title = `${advisor.name} — کارشناس املاک ${advisor.city} | ملک تو`;
  const description = `${advisor.role} در ${advisor.city} (${advisor.suburbs.join('، ')}). ${advisor.bio}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      locale: 'fa_IR',
    },
  };
}

export default async function RealtorProfilePage({
  params,
}: RealtorProfilePageProps) {
  const { id } = await params;
  const advisor = ADVISORS.find((a) => a.id === id);

  if (!advisor) {
    notFound();
  }

  const activeListings = getRealtorActiveListings(advisor.id, PROPERTIES);

  return <RealtorProfileClient advisor={advisor} activeListings={activeListings} />;
}
