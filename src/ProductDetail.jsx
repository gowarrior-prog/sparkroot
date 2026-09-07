'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from './lib/routerCompat';
import { ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCart } from './CartContext';
import { API } from './api';
import { products as fallbackProducts } from './dataproducts';
import ProductSkeleton from './components/product/ProductSkeleton';
import ProductGallery from './components/product/ProductGallery';
import ProductInfo from './components/product/ProductInfo';
import ProductReviews from './components/product/ProductReviews';
import RelatedProducts from './components/product/RelatedProducts';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [addedToast, setAddedToast] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        if (!selectedImage) setSelectedImage(data.image || null);
      } else {
        const fallback = fallbackProducts.find(p => String(p.id) === String(id));
        setProduct(fallback || null);
        if (!selectedImage) setSelectedImage(fallback?.image || null);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      const fallback = fallbackProducts.find(p => String(p.id) === String(id));
      setProduct(fallback || null);
      if (!selectedImage) setSelectedImage(fallback?.image || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedImage(null);
    setLoading(true);
    fetchProduct();
  }, [id]);

  if (loading) return <ProductSkeleton />;

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 px-4 flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <h1 className="text-3xl font-extrabold mb-3 tracking-tight">Product Not Found</h1>
          <p className="text-slate-500 mb-6 font-normal text-sm">
            The product you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3.5 bg-black text-white font-semibold uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-slate-800 transition shadow-sm cursor-pointer"
          >
            Explore Store
          </button>
        </div>
      </div>
    );
  }

  let extraImages = [];
  if (Array.isArray(product.images)) {
    extraImages = product.images.map(img => (typeof img === 'object' && img?.url ? img.url : img)).filter(Boolean);
  } else if (typeof product.images === 'string') {
    try {
      const parsed = JSON.parse(product.images);
      extraImages = Array.isArray(parsed) ? parsed.map(img => (typeof img === 'object' ? img.url : img)).filter(Boolean) : [product.images];
    } catch {
      extraImages = product.images.includes(',') ? product.images.split(',').map(s => s.trim()) : [product.images];
    }
  }

  const allImages = product.image
    ? [product.image, ...extraImages.filter(img => img && img !== product.image)]
    : extraImages.filter(Boolean);

  const displayImage = selectedImage || product.image || allImages[0] || '';
  const currentImageIdx = allImages.indexOf(displayImage);
  const isStockAvailable = product.stock === undefined || product.stock > 0;
  const isLiked = likedProducts[product.id];

  const handleAddToCart = (options = {}) => {
    addToCart(product, options);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = (options = {}) => {
    addToCart(product, options);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-24 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <div className="text-xs">
            <p className="font-bold">Added to Cart!</p>
            <p className="text-slate-300 font-normal">{product.name}</p>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="ml-2 underline font-semibold text-xs text-slate-200 hover:text-white"
          >
            View Cart
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Modern Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
          {product.category && (
            <>
              <Link
                to={`/category/${encodeURIComponent(product.category.toLowerCase())}`}
                className="capitalize hover:text-black transition"
              >
                {product.category}
              </Link>
              <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
            </>
          )}
          <span className="text-slate-800 font-semibold truncate max-w-[240px] sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-black transition group text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </button>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <ProductGallery
            allImages={allImages}
            displayImage={displayImage}
            setSelectedImage={setSelectedImage}
            product={product}
            isLiked={isLiked}
            toggleLike={toggleLike}
            isStockAvailable={isStockAvailable}
            currentImageIdx={currentImageIdx}
          />

          <ProductInfo
            product={product}
            reviews={product.reviews || []}
            isStockAvailable={isStockAvailable}
            handleBuyNow={handleBuyNow}
            handleAddToCart={handleAddToCart}
          />
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews
          productId={product.id}
          reviews={product.reviews || []}
          onReviewSubmitted={fetchProduct}
        />

        {/* Related Products Section (e.g. Jewelry related) */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />
      </div>
    </div>
  );
}