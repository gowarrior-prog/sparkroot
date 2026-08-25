import { Save, X } from 'lucide-react';
import { API } from '../api';
import ProductImageUploader from './ProductImageUploader';

// Image compression utility - Optimized for high speed and sharp quality
export const compressImageFile = (file, maxW = 800, maxH = 800, quality = 0.75) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxW || height > maxH) {
          if (width > height) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          } else {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = () => resolve(null);
  });

export default function ProductForm({ form, setForm, editingProduct, onClose, onRefresh, handleAuthError }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert('Please fill Name, Price, and Category');
      return;
    }
    if (!form.image) {
      alert('Please choose or enter a Main Cover Photo');
      return;
    }

    const url = editingProduct ? `${API}/admin/products/${editingProduct.id}` : `${API}/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';
    const validGallery = (form.galleryImages || [])
      .map(img => (typeof img === 'object' && img?.url ? img.url : img))
      .filter(u => u && typeof u === 'string' && u.trim());

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock),
          description: form.description,
          featured: Boolean(form.featured),
          image: form.image,
          extraImages: validGallery
        })
      });
      if (handleAuthError(res.status)) return;
      if (res.ok) {
        onClose();
        onRefresh();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-md animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-black">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Product ki details aur multiple photos aasani se manage karein.
          </p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-black bg-slate-100 p-2 rounded-md transition">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Product Name</label>
            <input required type="text" placeholder="e.g. Luxury Gold Watch" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition font-medium text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Price (PKR)</label>
            <input required type="number" placeholder="e.g. 25000" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition font-medium text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Stock Level</label>
            <input required type="number" placeholder="e.g. 10" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition font-medium text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition appearance-none font-medium text-sm">
              {['jewelry', 'cosmetics', 'fashion', 'bags', 'mobile-accessories', 'kitchen-accessories'].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded border border-slate-200">
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-5 h-5 accent-black rounded cursor-pointer" />
          <label htmlFor="featured" className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none text-slate-700">
            Show in Featured Collection (Home page per sab se pehle show hoga)
          </label>
        </div>

        {/* Photos & Gallery Section Component */}
        <ProductImageUploader form={form} setForm={setForm} />

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
          <textarea rows="3" placeholder="Product details..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition resize-none font-medium text-sm"></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-slate-100 transition">Cancel</button>
          <button type="submit" className="bg-black hover:bg-slate-800 text-white px-8 py-2.5 rounded-md font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition shadow-sm">
            <Save size={16} /> {editingProduct ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
