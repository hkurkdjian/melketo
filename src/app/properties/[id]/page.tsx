import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyDetailClient } from '@/components/properties/PropertyDetailClient';
import { ADVISORS, PROPERTIES } from '@/lib/properties';
import { getSimilarProperties, getTransactionLabel } from '@/lib/propertyLogic';

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PROPERTIES.map((property) => ({ id: property.id }));
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = PROPERTIES.find((item) => item.id === id);

  if (!property) {
    return {
      title: 'ملک مورد نظر یافت نشد | ملک تو',
    };
  }

  const title = `${property.title} | ${property.city}، ${property.neighborhood} | ملک تو`;
  const description = `${getTransactionLabel(property.transactionType)} در ${property.neighborhood} — ${property.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'fa_IR',
      images: property.imageUrl ? [{ url: property.imageUrl, alt: property.title }] : undefined,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const property = PROPERTIES.find((item) => item.id === id);

  if (!property) {
    notFound();
  }

  const advisor = ADVISORS.find((a) => a.id === property.advisorId) ?? ADVISORS[0];
  const similarProperties = getSimilarProperties(property, PROPERTIES, 3);

  return (
    <PropertyDetailClient
      property={property}
      advisor={advisor}
      similarProperties={similarProperties}
    />
  );
}
