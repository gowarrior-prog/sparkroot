import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import SEO from './SEO';
import { API } from './api';
import OrdersSkeleton from './components/orders/OrdersSkeleton';
import OrderCard from './components/orders/OrderCard';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://via.placeholder.com/150?text=No+Image';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    const baseUrl = API.replace(/\/api\/?$/, '');
    return `${baseUrl}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel and delete this order?')) return;
    try {
      const res = await fetch(`${API}/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Order deleted successfully!');
        fetchOrders();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to delete order');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete order due to server error');
    }
  };

  if (loading) return <OrdersSkeleton />;

  return (
    <>
      <SEO title="My Orders" description="View and manage your recent orders from SPARKROOT." />
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              My <span className="text-slate-400">Orders</span>
            </h1>
            <Link to="/" className="text-slate-500 hover:text-black font-bold uppercase tracking-widest text-xs transition">
              Continue Shopping →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-sm">
              <Package size={80} className="mx-auto mb-6 text-slate-300" />
              <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">No Orders Yet</h2>
              <p className="text-slate-500 mb-8 font-medium">You haven't placed any orders yet. Start shopping!</p>
              <Link to="/" className="inline-flex px-10 py-4 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition shadow-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrder === order.id}
                  onToggleExpand={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  onDeleteOrder={handleDeleteOrder}
                  getImageUrl={getImageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}