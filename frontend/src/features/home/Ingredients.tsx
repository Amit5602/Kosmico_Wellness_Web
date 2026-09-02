import { Container } from '../../components/ui/Container';

export function Ingredients() {
  return (
    <section className="py-16 md:py-24 bg-surface border-y border-border">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-dark mb-6">
              Just two simple ingredients.
            </h2>
            <p className="text-lg text-text-muted mb-8 leading-relaxed">
              We believe in complete transparency. Our classic sweetener is made with only two
              premium ingredients, expertly blended to match the sweetness of sugar perfectly.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-dark mb-2">Monk Fruit Extract</h3>
                  <p className="text-text-muted">
                    A small sub-tropical melon that provides intense, natural sweetness without any
                    calories or impact on blood sugar.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-dark mb-2">Erythritol</h3>
                  <p className="text-text-muted">
                    A naturally occurring sugar alcohol found in fruits like grapes and pears. It
                    provides the bulk and texture of sugar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="bg-background rounded-3xl p-8 w-full max-w-lg aspect-square flex items-center justify-center shadow-inner">
              <img
                src="/assets/products/product-front-back.jpg"
                alt="Sweet Monk Ingredients and Nutrition Label"
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
