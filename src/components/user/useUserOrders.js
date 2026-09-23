import { useState, useEffect } from 'react';
import { API } from '../../api';

export function useUserOrders(token) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      let serverOrders = [];
      try {
        const res = await fetch(`${API}/my-orders`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) serverOrders = data;
        }
      } catch (err) {}

      let localOrders = [];
      try {
        localOrders = JSON.parse(localStorage.getItem('sparkroot_user_orders') || '[]');
      } catch {}

      const existingIds = new Set(serverOrders.map(o => String(o.id)));
      const combined = [...serverOrders];
      for (const lo of localOrders) {
        if (!existingIds.has(String(lo.id))) combined.push(lo);
      }

      setOrders(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, setOrders };
}
