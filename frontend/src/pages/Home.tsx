import { Hero } from '../features/home/Hero';
import { TrustIndicators } from '../features/home/TrustIndicators';
import { ProductShowcase } from '../features/home/ProductShowcase';
import { Benefits } from '../features/home/Benefits';
import { BrandStory } from '../features/home/BrandStory';
import { Ingredients } from '../features/home/Ingredients';
import { HowItWorks } from '../features/home/HowItWorks';
import { Comparison } from '../features/home/Comparison';
import { Lifestyle } from '../features/home/Lifestyle';
import { Reviews } from '../features/home/Reviews';
import { Faq } from '../features/home/Faq';
import { FinalCta } from '../features/home/FinalCta';

export function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TrustIndicators />
      <ProductShowcase />
      <Benefits />
      <BrandStory />
      <Ingredients />
      <HowItWorks />
      <Comparison />
      <Lifestyle />
      <Reviews />
      <Faq />
      <FinalCta />
    </div>
  );
}
