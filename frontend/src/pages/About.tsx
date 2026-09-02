import { BrandStory } from '../features/home/BrandStory';
import { FinalCta } from '../features/home/FinalCta';

export function About() {
  return (
    <div className="flex flex-col w-full pt-20">
      <BrandStory />
      <FinalCta />
    </div>
  );
}
