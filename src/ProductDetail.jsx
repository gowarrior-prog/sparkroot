import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from './CartContext';
import { API } from './api';
import { products as fallbackProducts } from './dataproducts';
import ProductSkeleton from './components/product/ProductSkeleton';
import ProductGallery from './components/product/ProductGallery';
import ProductInfo from './components/product/ProductInfo';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setSelectedImage(data.image || null);
        } else {
          const fallback = fallbackProducts.find(p => String(p.id) === String(id));
          setProduct(fallback || null);
          setSelectedImage(fallback?.image || null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        const fallback = fallbackProducts.find(p => String(p.id) === String(id));
        setProduct(fallback || null);
        setSelectedImage(fallback?.image || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <ProductSkeleton />;

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 px-4 flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tight">Product Not Found</h1>
          <p className="text-slate-500 mb-8 font-medium">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition shadow-md cursor-pointer"
          >
            Go Home
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

  const handleAddToCart = () => {
    addToCart(product);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-black mb-8 transition group font-bold uppercase tracking-widest text-xs cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
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
            isStockAvailable={isStockAvailable}
            handleBuyNow={handleBuyNow}
            handleAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}