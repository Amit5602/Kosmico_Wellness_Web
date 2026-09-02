import { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What is Monk Fruit?',
    answer:
      'Monk fruit, also known as Luo Han Guo, is a small green melon native to Southeast Asia. It has been used for centuries in traditional Eastern medicine and gets its sweetness from natural compounds called mogrosides, which are up to 250 times sweeter than regular sugar but contain zero calories.',
  },
  {
    question: 'Does Sweet Monk have an aftertaste?',
    answer:
      'Unlike many artificial sweeteners or stevia, our proprietary blend of monk fruit extract and erythritol is specifically crafted to mimic the clean, crisp taste of cane sugar without any bitter or chemical aftertaste.',
  },
  {
    question: 'Can I bake with Sweet Monk?',
    answer:
      'Yes! Sweet Monk measures cup-for-cup like sugar (a 1:1 ratio), making it incredibly easy to use in your favorite baking recipes. It browns and provides the same texture as traditional sugar.',
  },
  {
    question: 'Is it safe for diabetics?',
    answer:
      'Sweet Monk contains zero calories and zero net carbs, meaning it does not spike blood glucose or insulin levels, making it a popular choice for individuals managing diabetes or following a ketogenic diet.',
  },
  {
    question: 'What is Erythritol and why is it included?',
    answer:
      'Because pure monk fruit extract is intensely sweet, we blend it with erythritol (a naturally occurring sugar alcohol found in fruits like grapes) to provide the same volume and texture as sugar, allowing for an easy 1:1 replacement in recipes.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-surface border-t border-border">
      <Container>
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-dark mb-4">
              Got Questions?
            </h2>
            <p className="text-text-muted mb-6">
              Learn more about Sweet Monk, our ingredients, and how to use it in your daily life.
            </p>
          </div>

          <div className="w-full md:w-2/3">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-background transition-all duration-200"
                >
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between font-bold text-primary-dark text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    aria-expanded={openIndex === index}
                  >
                    <span className="pr-4">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
                    )}
                  </button>

                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index
                        ? 'max-h-96 py-4 border-t border-border/50 opacity-100'
                        : 'max-h-0 py-0 opacity-0'
                    }`}
                  >
                    <p className="text-text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
