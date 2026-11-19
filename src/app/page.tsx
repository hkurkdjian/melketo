import { redirect } from 'next/navigation';
import { HomeCatalogClient } from '@/components/properties/HomeCatalogClient';
import { AdvisorsSection } from '@/components/sections/AdvisorsSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ADVISORS, PROPERTIES } from '@/lib/properties';

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const propertyParam =
    typeof params.property === 'string' ? params.property : undefined;
  if (propertyParam && PROPERTIES.some((p) => p.id === propertyParam)) {
    redirect(`/properties/${propertyParam}`);
  }

  const realtorParam =
    typeof params.realtor === 'string' ? params.realtor : undefined;
  if (realtorParam && ADVISORS.some((a) => a.id === realtorParam)) {
    redirect(`/realtors/${realtorParam}`);
  }

  if (params.view === 'realtors') {
    redirect('/realtors');
  }

  return (
    <>
      <HeroSection />
      <HomeCatalogClient properties={PROPERTIES} />
      <AdvisorsSection />
    </>
  );
}
