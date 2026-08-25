import { useState } from 'react';
import { Plus } from 'lucide-react';
import { API } from '../api';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';

const BLANK_FORM = {
  name: '',
  price: '',
  image: '',
  imageFile: null,
  category: 'jewelry',
  stock: '0',
  description: '',
  featured: false,
  galleryImages: []
};

export default function AdminProducts({ products, onRefresh, getAuthHeaders, handleAuthError }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm(BLANK_FORM);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    let gallery = [];
    if (Array.isArray(product.images)) {
      gallery = product.images.map(img => (typeof img === 'object' && img?.url ? img.url : img)).filter(Boolean);
    } else if (typeof product.images === 'string') {
      try {
        const p = JSON.parse(product.images);
        gallery = Array.isArray(p) ? p.map(img => (typeof img === 'object' ? img.url : img)).filter(Boolean) : [product.images];
      } catch {
        gallery = product.images.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    setForm({
      ...product,
      price: String(product.price || 0),
      stock: String(product.stock ?? 0),
      imageFile: null,
      galleryImages: gallery
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API}/admin/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (handleAuthError(res.status)) return;
      if (res.ok) onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-widest">Product Inventory</h3>
        <button
          onClick={() => {
            setEditingProduct(null);
            setForm(BLANK_FORM);
            setShowForm(true);
          }}
          className="bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-md font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition shadow-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm ? (
        <ProductForm
          form={form}
          setForm={setForm}
          editingProduct={editingProduct}
          onClose={closeForm}
          onRefresh={onRefresh}
          handleAuthError={handleAuthError}
        />
      ) : (
        <ProductTable
          products={products}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
