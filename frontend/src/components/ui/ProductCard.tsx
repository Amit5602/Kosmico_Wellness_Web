import { formatINR } from '../../utils/currency';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Star, Heart } from 'lucide-react';
import { useAddToCart } from '../../hooks/useCart';
import { useToggleWishlist, useWishlist } from '../../hooks/useWishlist';
import { useAuthStore } from '../../store/useAuthStore';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();
  const toggleWishlistMutation = useToggleWishlist();
  const { data: wishlist } = useWishlist();

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const isWishlisted = wishlist?.items?.some((item: any) => 
    (typeof item === 'string' ? item : item._id) === product.id
  );

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate('/login');
    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) return navigate('/login');
    toggleWishlistMutation.mutate(product.id);
  };

  return (
    <div className="group relative bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {product.badge}
        </div>
      )}
      {discount > 0 && !product.badge && (
        <div className="absolute top-4 left-4 z-10 bg-error text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Save {discount}%
        </div>
      )}

      <button 
        onClick={handleToggleWishlist}
        disabled={toggleWishlistMutation.isPending}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-400 hover:text-red-500 transition-colors shadow-sm disabled:opacity-50"
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <Link
        to={`/products/${product.slug}`}
        className="block relative aspect-square bg-background overflow-hidden p-6"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-border fill-border'}`}
            />
          ))}
          <span className="text-xs text-text-muted ml-1">({product.reviewsCount})</span>
        </div>

        <Link
          to={`/products/${product.slug}`}
          className="block group-hover:text-primary transition-colors"
        >
          <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2 text-text-main">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">{formatINR(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-text-muted line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            className="rounded-full px-6" 
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? '...' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
