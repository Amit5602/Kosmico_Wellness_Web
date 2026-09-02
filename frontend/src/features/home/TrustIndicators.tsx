import { Container } from '../../components/ui/Container';
import { Leaf, Heart, ShieldCheck, Droplet } from 'lucide-react';

const trustItems = [
  { icon: Leaf, label: '100% Natural' },
  { icon: Heart, label: 'Keto & Vegan' },
  { icon: ShieldCheck, label: 'Non-GMO' },
  { icon: Droplet, label: 'Zero Glycemic' },
];

export function TrustIndicators() {
  return (
    <div className="bg-primary-dark text-white py-6">
      <Container>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 lg:gap-24">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <item.icon className="h-6 w-6 text-accent" />
              <span className="font-semibold tracking-wide uppercase text-sm md:text-base">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
