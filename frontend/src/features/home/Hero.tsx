import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';

export function Hero() {
  return (
    <section className="relative bg-secondary py-16 md:py-24 lg:py-32 overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-dark leading-tight mb-6">
              The sweet taste of sugar, <br className="hidden lg:block" />
              <span className="text-primary">without the sugar.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted mb-8 max-w-lg">
              100% natural monk fruit sweetener. Zero calories, zero net carbs, and perfectly
              crafted to replace sugar cup for cup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm font-medium text-text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                Keto Friendly
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                Zero Calories
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                Diabetic Friendly
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="w-full md:w-1/2 relative flex justify-center z-10">
            <div className="relative w-full max-w-md aspect-square rounded-full bg-primary/5 flex items-center justify-center p-8">
              <img
                src="/assets/products/product-box.jpg"
                alt="Sweet Monk Monk Fruit Sweetener Box"
                className="w-full h-auto object-contain drop-shadow-2xl z-10"
              />
              {/* Decorative blob behind image */}
              <div className="absolute inset-0 bg-primary-light/10 rounded-full blur-3xl -z-10 transform translate-x-8 translate-y-8"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
