import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-helpers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import FeaturesSection from '@/sections/FeaturesSection';
import TestimonialSection from '@/sections/TestimonialSection';
//import PricingSection from '@/sections/PricingSection';
import CTASection from '@/sections/CTASection';

export default async function HomePage() {
  const session = await getSession();

  if (session && (session.user as any)?.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      {/*<TestimonialSection />*/}
      {/*<PricingSection />*/}
      <CTASection />
      <Footer />
    </>
  );
}
