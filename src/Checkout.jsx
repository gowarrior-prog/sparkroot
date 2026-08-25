import { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from './api';
import ShippingForm from './components/checkout/ShippingForm';
import OrderSummaryCard from './components/checkout/OrderSummaryCard';

export default function Checkout() {
  const { cartItems, cartCount, removeItem } = useCart();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login or sign up first to buy products!');
      navigate('/signin?redirect=/checkout');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    email: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            items: cartItems.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price, image: i.image || '' })),
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
        } else {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to place order');
        }
      } else {
        throw new Error('You must be logged in to place an order.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error placing order. Please try again.');
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
        <h1 className="text-4xl md:text-5xl font-black text-center md:text-left mb-12 tracking-tight uppercase">
          CHECKOUT
          <span className="text-slate-500 ml-3 text-2xl font-medium">({cartCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <ShippingForm
            formData={formData}
            handleChange={handleChange}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <OrderSummaryCard
            cartCount={cartCount}
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