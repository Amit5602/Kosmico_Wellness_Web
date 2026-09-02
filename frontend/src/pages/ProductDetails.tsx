import { formatINR } from '../utils/currency';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Star, Truck, Shield, ArrowLeft, Heart } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { useToggleWishlist, useWishlist } from '../hooks/useWishlist';
import { useAuthStore } from '../store/useAuthStore';
import { ProductReviews } from '../components/reviews/ProductReviews';

export function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(slug as string);
  const { isAuthenticated } = useAuthStore();
  const addToCartMutation = useAddToCart();
  const toggleWishlistMutation = useToggleWishlist();
  const { data: wishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('/assets/products/product-box.jpg');
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  useEffect(() => {
    if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0].size);
    }
  }, [product]);

  if (isLoading) {
    return <div className="py-32 text-center text-text-muted">Loading product...</div>;
  }

  if (isError || !product) {
    return (
      <div className="py-32 text-center">
        <h2 className="text-2xl font-serif text-primary mb-4">Product not found</h2>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.length 
    ? product.images 
    : ['/assets/products/product-box.jpg', '/assets/products/product-front-back.jpg', '/assets/products/lifestyle-tea.jpg'];

  const isWishlisted = wishlist?.items?.some((item: any) => 
    (typeof item === 'string' ? item : item._id) === product._id
  );

  const activeVariantObj = product.variants?.find((v: any) => v.size === selectedVariant);
  const currentPrice = activeVariantObj ? activeVariantObj.price : product.price;
  const currentCompareAtPrice = activeVariantObj ? activeVariantObj.compareAtPrice : product.compareAtPrice;
  const currentStock = activeVariantObj ? activeVariantObj.stock : product.stock;

  const discount = currentCompareAtPrice
    ? Math.round(((currentCompareAtPrice - currentPrice) / currentCompareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate('/login');
    addToCartMutation.mutate({ productId: product._id, quantity, variant: selectedVariant });
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) return navigate('/login');
    toggleWishlistMutation.mutate(product._id);
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <Container>
        <Link
          to="/shop"
          className="inline-flex items-center text-text-muted hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 mb-20">
          {/* Gallery */}
          <div className="w-full md:w-1/2">
            <div className="bg-surface border border-border rounded-2xl p-8 aspect-square flex items-center justify-center mb-6 sticky top-24">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-24 h-24 bg-surface border-2 rounded-xl overflow-hidden p-2 transition-colors ${activeImage === img ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            {discount > 0 && (
              <span className="self-start bg-error text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                Save {discount}%
              </span>
            )}
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'text-accent fill-accent' : 'text-border fill-border'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-text-main underline cursor-pointer hover:text-primary transition-colors">
                {product.numReviews || 0} reviews
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl font-bold text-primary">{formatINR(currentPrice)}</span>
              {currentCompareAtPrice && (
                <span className="text-xl text-text-muted line-through">
                  {formatINR(currentCompareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-text-main text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <span className="font-medium text-text-main block mb-3">Size</span>
                <div className="flex gap-3">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.size}
                      onClick={() => setSelectedVariant(v.size)}
                      className={`px-4 py-2 rounded-xl border ${selectedVariant === v.size ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-border text-text-main hover:border-primary/50'} transition-colors`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-surface rounded-2xl p-6 border border-border mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium text-text-main">Quantity</span>
                <div className="flex items-center border border-border rounded-full overflow-hidden bg-background">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-text-main hover:bg-neutral-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center text-text-main hover:bg-neutral-100 transition-colors"
                    disabled={quantity >= currentStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-grow rounded-full py-4 text-lg shadow-sm"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || currentStock === 0}
                >
                  {currentStock === 0 ? 'Out of Stock' : addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
                <button 
                  onClick={handleToggleWishlist}
                  disabled={toggleWishlistMutation.isPending}
                  className="w-16 h-[60px] flex items-center justify-center border border-border rounded-full bg-background hover:bg-neutral-100 transition-colors shadow-sm"
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-text-main'}`} />
                </button>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-text-main">
                <Shield className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                <span>100% Satisfaction Guarantee</span>
              </li>
              <li className="flex items-center text-text-main">
                <Truck className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                <span>Free shipping on orders over $50</span>
              </li>
            </ul>
          </div>
        </div>
        
        <ProductReviews productId={product._id} />
      </Container>
    </div>
  );
}
