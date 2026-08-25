import { Edit3, Trash2, Star } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-x-auto w-full max-w-full">
      <table className="w-full text-left min-w-[800px]">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((h, i) => (
              <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 ${i === 4 ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map(p => (
            <tr key={p.id} className="hover:bg-slate-50 transition">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-sm object-cover border border-slate-200" />
                    {p.images?.length > 0 && (
                      <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[9px] font-black px-1.5 rounded-full shadow">
                        +{p.images.length}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {p.featured && (
                        <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest flex items-center gap-1">
                          <Star size={10} className="fill-slate-500" /> Featured
                        </span>
                      )}
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {(p.images?.length || 0) + 1} photos
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-slate-100 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  {p.category}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-black text-sm">PKR {p.price.toLocaleString()}</td>
              <td className="px-6 py-4">
                {p.stock > 0 ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
                    {p.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-700 bg-red-50 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-red-200">
                    Out of stock
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(p)} className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-md transition">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => onDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-12 text-slate-500 font-medium">
                No products found. Add some to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
