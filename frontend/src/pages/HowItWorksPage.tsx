import { HowItWorks } from '../features/home/HowItWorks';
import { Lifestyle } from '../features/home/Lifestyle';
import { FinalCta } from '../features/home/FinalCta';

export function HowItWorksPage() {
  return (
    <div className="flex flex-col w-full pt-20">
      <HowItWorks />
      <Lifestyle />
      <FinalCta />
    </div>
  );
}
