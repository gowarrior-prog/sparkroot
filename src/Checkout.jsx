// src/pages/Checkout.jsx
import { useState } from 'react';
import { useCart } from './CartContext'; // adjust path
import { CreditCard, Truck, ShoppingBag, Info } from 'lucide-react';
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

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 170;
  const total = subtotal + delivery;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.phone) {
      alert('Please fill all required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to place an order.');
      navigate('/signin');
      return;
    }

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          total,
          items: cartItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
          address: `${formData.address}, ${formData.city}`,
          phone: formData.phone,
          email: formData.email
        })
      });

      if (res.ok) {
        // Clear cart after order
        cartItems.forEach(item => removeItem(item.id));
        navigate('/my-orders');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to place order');
      }
    } catch (err) {
      alert('Server error. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto mb-6 text-slate-300" />
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Your Cart is Empty</h1>
          <p className="text-lg text-slate-500 mb-8">Add items to proceed to checkout.</p>
          <Link
            to="/shop"
            className="inline-flex px-8 py-4 bg-black hover:bg-slate-800 text-white rounded-none font-semibold transition-all tracking-wide uppercase text-sm"
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
        <h1 className="text-4xl md:text-5xl font-black text-center md:text-left mb-12 tracking-tight">
          CHECKOUT
          <span className="text-slate-500 ml-3 text-2xl font-medium">({cartCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Forms & Payment */}
          <div className="lg:col-span-2 space-y-10">
            {/* Notice about 24 hours */}
            <div className="bg-blue-50 border border-blue-200 p-4 flex gap-3 text-blue-800">
              <Info className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium">
                <strong>Important:</strong> You have a <span className="underline">24-hour window</span> to cancel your order after placement. Orders cannot be canceled after 1 day.
              </p>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 tracking-tight">
                <Truck size={24} className="text-black" /> Shipping Address
              </h2>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition"
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
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition"
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
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 tracking-tight">
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
                  <span className="font-semibold">Cash on Delivery</span>
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
              <h2 className="text-2xl font-bold mb-8 tracking-tight">ORDER SUMMARY</h2>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>PKR {subtotal.toLocaleString('en-PK')}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Delivery Charges</span>
                  <span>PKR {delivery}</span>
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
                className="
                  w-full py-5 bg-black
                  text-white font-bold text-sm tracking-widest uppercase
                  hover:bg-slate-800
                  transition-all duration-300
                "
              >
                Place Order
              </button>

              <p className="text-center text-sm text-slate-500 font-medium mt-6">
                Secure checkout • 100% safe payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}