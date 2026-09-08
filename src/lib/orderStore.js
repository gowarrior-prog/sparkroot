import fs from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

function ensureDataDir() {
  const dir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
}

function loadPersistedOrders() {
  try {
    ensureDataDir();
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data) || [];
    }
  } catch (e) {
    console.warn('Could not read orders.json:', e.message);
  }
  return [];
}

function savePersistedOrders(orders) {
  try {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save orders.json:', e.message);
  }
}

const globalForOrders = globalThis;
if (!globalForOrders.memoryOrders) {
  globalForOrders.memoryOrders = loadPersistedOrders();
}

export const memoryOrders = globalForOrders.memoryOrders;

export function addMemoryOrder(orderData) {
  const newOrder = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    userId: orderData.userId || 1,
    total: Number(orderData.total) || 0,
    status: 'pending',
    items: typeof orderData.items === 'string' ? orderData.items : JSON.stringify(orderData.items || []),
    address: orderData.address || '',
    phone: orderData.phone || '',
    email: orderData.email || '',
    createdAt: new Date().toISOString()
  };
  globalForOrders.memoryOrders.unshift(newOrder);
  savePersistedOrders(globalForOrders.memoryOrders);
  return newOrder;
}

export function updateMemoryOrderStatus(id, status) {
  const order = globalForOrders.memoryOrders.find(o => String(o.id) === String(id));
  if (order) {
    order.status = status;
    savePersistedOrders(globalForOrders.memoryOrders);
    return order;
  }
  return null;
}

export function deleteMemoryOrder(id) {
  const index = globalForOrders.memoryOrders.findIndex(o => String(o.id) === String(id));
  if (index !== -1) {
    const deleted = globalForOrders.memoryOrders.splice(index, 1)[0];
    savePersistedOrders(globalForOrders.memoryOrders);
    return deleted;
  }
  return null;
}
