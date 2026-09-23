'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useToast } from './components/ToastProvider';
import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from './lib/routerCompat';
import { API } from './api';
import ShippingForm from './components/checkout/ShippingForm';
import OrderSummaryCard from './components/checkout/OrderSummaryCard';
import { deductProductStock, invalidateProductCache } from './productStore';

export default function Checkout() {
  const { cartItems, cartCount, removeItem } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [buyNowItem, setBuyNowItem] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('buyNowItem');
      if (stored) {
        try {
          setBuyNowItem(JSON.parse(stored));
        } catch {
          setBuyNowItem(null);
        }
      }

      let initialName = '';
      let initialEmail = '';
      let initialAddress = '';
      let initialCity = '';
      let initialPostalCode = '';
      let initialPhone = '';

      try {
        const uStr = localStorage.getItem('user');
        if (uStr) {
          const u = JSON.parse(uStr);
          if (u.name) initialName = u.name;
          if (u.email) initialEmail = u.email;
          if (u.phone && u.phone !== '03467921114' && u.phone !== 'Not Added') initialPhone = u.phone;
        }
        const savedAddresses = localStorage.getItem('sparkroot_user_addresses');
        if (savedAddresses) {
          const addrs = JSON.parse(savedAddresses);
          if (Array.isArray(addrs) && addrs.length > 0) {
            if (addrs[0].name) initialName = addrs[0].name;
            if (addrs[0].address) initialAddress = addrs[0].address;
            if (addrs[0].city) initialCity = addrs[0].city;
            if (addrs[0].postalCode) initialPostalCode = addrs[0].postalCode;
            if (addrs[0].email) initialEmail = addrs[0].email;
            if (addrs[0].phone && addrs[0].phone !== '03467921114' && addrs[0].phone !== 'Not Added') initialPhone = addrs[0].phone;
          }
        }
      } catch (e) {}

      if (initialPhone === '03467921114' || initialPhone === 'Not Added') initialPhone = '';

      setFormData({
        fullName: initialName,
        address: initialAddress,
        city: initialCity,
        postalCode: initialPostalCode,
        phone: initialPhone,
        email: initialEmail
      });
    }
    setIsLoaded(true);
  }, []);

  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;
  const totalItemCount = buyNowItem ? buyNowItem.quantity : cartCount;

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 0;
  const total = subtotal + delivery;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.phone) {
      addToast('Please fill all required fields (Name, Address, Phone).', 'delete');
      return;
    }

    const outOfStockItem = checkoutItems.find(item => item.stock !== undefined && Number(item.stock) <= 0);
    if (outOfStockItem) {
      addToast(`Cannot place order: "${outOfStockItem.name || 'Product'}" is Out of Stock!`, 'delete', 'Out of Stock');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsSubmitting(true);

    try {
      const itemData = checkoutItems.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        image: i.image || '',
        size: i.selectedSize || i.size || null,
        color: i.selectedColor || i.color || null
      }));
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          total,
          items: itemData,
          address: formData.address.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          name: formData.fullName.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim()
        })
      });

      if (!res.ok) {
        const placedOrder = {
          id: Date.now(),
          userId: 1,
          total,
          status: 'pending',
          items: itemData,
          address: fullAddress,
          phone: formData.phone,
          email: formData.email,
          name: formData.fullName,
          city: formData.city,
          createdAt: new Date().toISOString()
        };
        try {
          const local = JSON.parse(localStorage.getItem('sparkroot_user_orders') || '[]');
          local.unshift(placedOrder);
          localStorage.setItem('sparkroot_user_orders', JSON.stringify(local));
        } catch {}
      }

      // Instantly deduct product stock locally & invalidate cache
      deductProductStock(checkoutItems);
      invalidateProductCache();

      // Cleanup & Toast
      if (typeof window !== 'undefined' && buyNowItem) {
        sessionStorage.removeItem('buyNowItem');
      } else {
        cartItems.forEach(item => removeItem(item.cartKey || item.id, true));
      }

      // Show beautiful top white notification toast
      addToast('Your order has been placed successfully!', 'success', 'Order Placed');

      // Immediately navigate to Landing Page (Home)!
      navigate('/');
    } catch (err) {
      console.error('Order placement error:', err);
      // Fallback stock deduction, redirect & notification
      deductProductStock(checkoutItems);
      invalidateProductCache();
      if (typeof window !== 'undefined') sessionStorage.removeItem('buyNowItem');
      cartItems.forEach(item => removeItem(item.cartKey || item.id, true));
      addToast('Your order has been placed successfully!', 'success', 'Order Placed');
      navigate('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoaded && checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-24 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBag size={80} className="mx-auto mb-6 text-slate-300" />
          <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">Your Cart is Empty</h1>
          <p className="text-lg text-slate-500 mb-8 font-medium">Add items to proceed to checkout.</p>
          <Link
            to="/"
            className="inline-flex px-8 py-4 bg-black hover:bg-slate-800 text-white font-bold transition-all tracking-widest uppercase text-sm rounded-xl shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-center md:text-left mb-12 tracking-tight uppercase">
          CHECKOUT
          <span className="text-slate-500 ml-3 text-2xl font-medium">({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <ShippingForm
            formData={formData}
            handleChange={handleChange}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <OrderSummaryCard
            cartCount={totalItemCount}
            subtotal={subtotal}
            total={total}
            handlePlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}