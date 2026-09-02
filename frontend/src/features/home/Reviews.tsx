import { Container } from '../../components/ui/Container';
import { Star } from 'lucide-react';
import { useGlobalReviews } from '../../hooks/useGlobalReviews';

export function Reviews() {
  const { data, isLoading } = useGlobalReviews(3, 'highest');

  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-dark mb-4">
            Don't just take our word for it
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 text-accent fill-accent" />
              ))}
            </div>
            <span className="font-bold text-lg">4.9/5</span>
          </div>
          <p className="text-text-muted">Based on verified customer reviews.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface p-8 rounded-2xl shadow-sm border border-border flex flex-col h-64 animate-pulse">
                <div className="bg-neutral-200 h-6 w-3/4 mb-4 rounded"></div>
                <div className="bg-neutral-200 h-24 w-full mb-6 rounded"></div>
                <div className="bg-neutral-200 h-4 w-1/3 mt-auto rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data?.reviews?.map((review: any) => (
              <div
                key={review._id}
                className="bg-surface p-8 rounded-2xl shadow-sm border border-border flex flex-col"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-border fill-border'}`}
                    />
                  ))}
                </div>
                <h4 className="font-bold text-primary-dark text-lg mb-3">"{review.title}"</h4>
                <p className="text-text-muted mb-6 flex-grow italic">"{review.content}"</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="font-semibold text-text-main">{review.user?.name || 'Customer'}</span>
                  <span className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-success text-white flex items-center justify-center text-[8px]">
                      ✓
                    </span>
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
