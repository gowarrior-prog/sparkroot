'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from './lib/routerCompat';
import { useCart } from './CartContext';
import SEO from './SEO';
import { API } from './api';
import { getInitialProducts, getCachedProducts } from './productStore';
import CategoryHeader from './components/products/CategoryHeader';
import CategoryGrid from './components/products/CategoryGrid';

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();

  const filterCategory = (allProds, catSlug) => {
    if (!Array.isArray(allProds) || allProds.length === 0) return [];
    const lowerSlug = catSlug ? catSlug.toLowerCase().trim() : '';
    
    if (lowerSlug === 'shop' || lowerSlug === 'all') return allProds;

    return allProds.filter(p => {
      const pCat = p.category ? p.category.toLowerCase().trim() : '';
      return pCat === lowerSlug || pCat.includes(lowerSlug) || lowerSlug.includes(pCat);
    });
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayCategory = name?.toLowerCase() === 'all'
    ? 'All Products'
    : name
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Products';

  useEffect(() => {
    let isMounted = true;

    const initialAll = getInitialProducts();
    if (initialAll.length > 0) {
      setProducts(filterCategory(initialAll, name));
      setLoading(false);
    }

    const fetchCategory = async () => {
      const cached = await getCachedProducts();
      if (isMounted && Array.isArray(cached) && cached.length > 0) {
        setProducts(filterCategory(cached, name));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/products`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? filterCategory(data, name) : []);
        }
      } catch (err) {
        console.error('Category fetch error:', err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategory();
    return () => { isMounted = false; };
  }, [name]);

  const handleAddClick = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('buyNowItem', JSON.stringify({
        ...product,
        quantity: 1,
        cartKey: `buynow_${product.id}`
      }));
    }
    navigate('/checkout');
  };

  const handleLike = (e, product) => {
    e.stopPropagation();
    toggleLike(product.id, product);
  };

  return (
    <>
      <SEO title={`${displayCategory} Collection — SparkRoot`} description={`Explore our exclusive range of ${displayCategory.toLowerCase()} handpicked just for you at SPARKROOT.`} />
      <div className="min-h-screen bg-[#f4f4f6] text-slate-900 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <CategoryHeader displayCategory={displayCategory} count={products.length} />
          <CategoryGrid
            products={products}
            loading={loading}
            likedProducts={likedProducts}
            onLike={handleLike}
            onAddClick={handleAddClick}
            onBuyNow={handleBuyNow}
            onNavigate={navigate}
          />
        </div>
      </div>
    </>
  );
}
