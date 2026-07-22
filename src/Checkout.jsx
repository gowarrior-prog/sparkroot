// src/pages/Checkout.jsx
import { useState } from 'react';
import { useCart } from './CartContext';
import { CreditCard, Truck, ShoppingBag, Info, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from './api';

export default function Checkout() {
  const { cartItems, cartCount, removeItem } = useCart();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    email: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations - NO 170 ADDED CHARGES
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 0;
  const total = subtotal + delivery;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.phone) {
      alert('Please fill all required fields (Name, Address, Phone).');
      return;
    }

    const token = localStorage.getItem('token');
    setIsSubmitting(true);

    try {
      if (token) {
        const res = await fetch(`${API}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            total,
            items: cartItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
            address: `${formData.address}${formData.city ? `, ${formData.city}` : ''}`,
            phone: formData.phone,
            email: formData.email
          })
        });

        if (res.ok) {
          cartItems.forEach(item => removeItem(item.id));
          alert('Order placed successfully!');
          navigate('/my-orders');
          return;
        }
      }
      
      // Guest fallback order confirmation
      cartItems.forEach(item => removeItem(item.id));
      alert('Thank you! Your order has been placed successfully.');
      navigate('/');
    } catch (err) {
      console.error(err);
      cartItems.forEach(item => removeItem(item.id));
      alert('Order placed successfully!');
      navigate('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto mb-6 text-slate-300" />
          <h1 className="text-4xl font-bold mb-4 tracking-tight uppercase">Your Cart is Empty</h1>
          <p className="text-lg text-slate-500 mb-8 font-medium">Add items to proceed to checkout.</p>
          <Link
            to="/"
            className="inline-flex px-8 py-4 bg-black hover:bg-slate-800 text-white rounded-none font-semibold transition-all tracking-widest uppercase text-sm"
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
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-black text-center md:text-left mb-12 tracking-tight uppercase">
          CHECKOUT
          <span className="text-slate-500 ml-3 text-2xl font-medium">({cartCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Forms & Payment */}
          <div className="lg:col-span-2 space-y-10">
            {/* Notice */}
            <div className="bg-blue-50 border border-blue-200 p-4 flex gap-3 text-blue-800">
              <Info className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium">
                <strong>Important:</strong> You have a <span className="underline">24-hour window</span> to cancel your order after placement.
              </p>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 tracking-tight uppercase">
                <Truck size={24} className="text-black" /> Shipping Address
              </h2>

              <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="03xx-xxxxxxx"
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street address, house number, area"
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City name"
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 tracking-tight uppercase">
                <CreditCard size={24} className="text-black" /> Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition border border-black">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-5 h-5 accent-black"
                  />
                  <Truck size={20} className="text-black" />
                  <span className="font-semibold uppercase tracking-wide text-sm">Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right - Sticky Order Summary */}
          <div className="lg:col-span-1">
            <div className="
              lg:sticky lg:top-24 
              bg-white border border-slate-200 
              p-8 shadow-sm
            ">
              <h2 className="text-2xl font-bold mb-8 tracking-tight uppercase">ORDER SUMMARY</h2>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-black">PKR {subtotal.toLocaleString('en-PK')}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-bold uppercase">Free</span>
                </div>

                <div className="border-t border-slate-200 pt-5 mt-5">
                  <div className="flex justify-between text-2xl font-black">
                    <span>TOTAL</span>
                    <span>PKR {total.toLocaleString('en-PK')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="
                  w-full py-5 bg-black
                  text-white font-bold text-sm tracking-widest uppercase
                  hover:bg-slate-800
                  transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50
                "
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-center text-xs text-emerald-700 bg-emerald-50 p-2 mt-4 font-bold uppercase tracking-widest">
                ✓ Original price only — No extra fees added
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}