'use client';

// src/CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'luxe-mart-cart';
const LIKED_STORAGE_KEY = 'luxe-mart-liked';
const LIKED_PRODUCTS_DATA_KEY = 'luxe-mart-liked-data';

export function CartProvider({ children }) {
  // Cart
  const [cartItems, setCartItems] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [likedProductsData, setLikedProductsData] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedLiked = localStorage.getItem(LIKED_STORAGE_KEY);
      if (savedLiked) setLikedProducts(JSON.parse(savedLiked));

      const savedLikedData = localStorage.getItem(LIKED_PRODUCTS_DATA_KEY);
      if (savedLikedData) setLikedProductsData(JSON.parse(savedLikedData));
    } catch (err) {
      console.error('Error reading localStorage:', err);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedProducts));
  }, [likedProducts, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem(LIKED_PRODUCTS_DATA_KEY, JSON.stringify(likedProductsData));
  }, [likedProductsData, isMounted]);

  const addToCart = (product, options = {}) => {
    const size = options.size || product.selectedSize || null;
    const color = options.color || product.selectedColor || null;
    const qty = options.quantity || product.quantity || 1;
    const uniqueKey = `${product.id}${size ? `_sz:${size}` : ''}${color ? `_col:${color}` : ''}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => (item.cartKey || item.id) === uniqueKey);
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartKey: uniqueKey,
          selectedSize: size,
          selectedColor: color,
          quantity: qty
        }
      ];
    });
  };

  const decreaseQuantity = (cartKeyOrId) => {
    setCartItems(prev =>
      prev.map(item =>
        (item.cartKey || item.id) === cartKeyOrId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (cartKeyOrId) => {
    setCartItems(prev => prev.filter(item => (item.cartKey || item.id) !== cartKeyOrId));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const likedCount = Object.values(likedProducts).filter(Boolean).length;

  // toggleLike now also saves product data
  const toggleLike = (productId, productData = null) => {
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
    // Save product data when liking (not when unliking)
    if (productData && !likedProducts[productId]) {
      setLikedProductsData(prev => ({
        ...prev,
        [productId]: {
          id: productData.id,
          name: productData.name,
          price: productData.price,
          image: productData.image,
          category: productData.category || '',
        }
      }));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQuantity,
        removeItem,
        cartCount,
        likedProducts,
        likedProductsData,
        toggleLike,
        likedCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);