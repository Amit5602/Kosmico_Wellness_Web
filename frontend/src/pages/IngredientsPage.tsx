import { Ingredients } from '../features/home/Ingredients';
import { Comparison } from '../features/home/Comparison';
import { FinalCta } from '../features/home/FinalCta';

export function IngredientsPage() {
  return (
    <div className="flex flex-col w-full pt-20">
      <Ingredients />
      <Comparison />
      <FinalCta />
    </div>
  );
}
