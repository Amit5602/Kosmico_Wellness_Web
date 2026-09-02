import { Container } from '../../components/ui/Container';
import { Sparkles, Utensils, Zap, ThumbsUp } from 'lucide-react';

const benefits = [
  {
    icon: Sparkles,
    title: 'Zero Calories',
    description:
      'Enjoy the sweetness you love without any of the calories. Perfect for your daily routine.',
  },
  {
    icon: Utensils,
    title: '1:1 Sugar Replacement',
    description:
      'Measures and bakes exactly like sugar. No complicated conversions needed for your recipes.',
  },
  {
    icon: Zap,
    title: 'Zero Net Carbs',
    description:
      "Keto-friendly and won't spike your blood sugar levels. A clean alternative for your diet.",
  },
  {
    icon: ThumbsUp,
    title: 'No Bitter Aftertaste',
    description:
      'Unlike stevia or artificial sweeteners, Kosmiko Wellness provides a clean, pure, sugar-like taste.',
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-16 md:py-24 bg-surface">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-primary">
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-primary-dark mb-3">
                {benefit.title}
              </h3>
              <p className="text-text-muted leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
