import { formatINR } from '../utils/currency';
import { Link } from 'react-router-dom';
import { useWishlist, useToggleWishlist } from '../hooks/useWishlist';
import { Container } from '../components/ui/Container';
import { Trash2, ShoppingCart, HeartCrack } from 'lucide-react';
import { useAddToCart } from '../hooks/useCart';

export function Wishlist() {
  const { data: wishlist, isLoading } = useWishlist();
  const toggleMutation = useToggleWishlist();
  const addToCartMutation = useAddToCart();

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface w-48 mb-8 rounded"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-surface rounded-lg"></div>
          ))}
        </div>
      </Container>
    );
  }

  const items = wishlist?.items || [];

  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <HeartCrack className="w-16 h-16 mx-auto text-text-muted mb-4" />
        <h2 className="text-2xl font-serif font-bold text-primary mb-4">Your Wishlist is Empty</h2>
        <p className="text-text-muted mb-8">Save items you love to your wishlist to review them later.</p>
        <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-serif font-bold text-primary mb-8">Your Wishlist</h1>
      
      <div className="grid gap-6">
        {items.map((item: any) => {
          const product = item.product;
          if (!product) return null;
          
          return (
            <div key={product._id} className="flex flex-col sm:flex-row items-center gap-6 bg-surface p-4 rounded-xl border border-border">
              <Link to={`/products/${product.slug}`} className="shrink-0">
                <img 
                  src={product.images?.[0] || '/assets/products/product-box.jpg'} 
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>
              
              <div className="flex-1 text-center sm:text-left">
                <Link to={`/products/${product.slug}`} className="text-lg font-bold text-text-main hover:text-primary transition-colors">
                  {product.name}
                </Link>
                <div className="text-primary font-bold mt-2">{formatINR(product.price)}</div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={() => addToCartMutation.mutate({ productId: product._id, quantity: 1 })}
                  disabled={addToCartMutation.isPending}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                
                <button
                  onClick={() => toggleMutation.mutate(product._id)}
                  disabled={toggleMutation.isPending}
                  className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
