import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItemCard({ item, itemKey, isDeleting, handleRemoveClick, decreaseQuantity, addToCart, onNavigate }) {
  return (
    <div
      className={`
        flex flex-col sm:flex-row gap-6 
        bg-white border border-slate-200 
        rounded-sm p-6 transition-all duration-300 hover:border-slate-400 hover:shadow-sm relative
        ${isDeleting ? 'opacity-50 scale-98 pointer-events-none' : ''}
      `}
    >
      <div className="w-full sm:w-32 h-32 flex-shrink-0 cursor-pointer" onClick={() => onNavigate(`/product/${item.id}`)}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-sm border border-slate-200"
        />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="text-base sm:text-lg font-bold text-black cursor-pointer hover:text-slate-600 transition"
            onClick={() => onNavigate(`/product/${item.id}`)}
          >
            {item.name}
          </h3>

          <button
            type="button"
            onClick={() => handleRemoveClick(item)}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50 cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
            title="Remove item"
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>

        {(item.selectedSize || item.selectedColor) && (
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 mb-3">
            {item.selectedSize && (
              <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Size: <strong className="text-black">{item.selectedSize}</strong>
              </span>
            )}
            {item.selectedColor && (
              <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Color: <strong className="text-black">{item.selectedColor}</strong>
              </span>
            )}
          </div>
        )}

        <p className="text-black font-extrabold text-lg sm:text-xl mb-3">
          PKR {Number(item.price).toLocaleString('en-PK')}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => decreaseQuantity(itemKey)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-md transition border border-slate-200 disabled:opacity-50 cursor-pointer"
            disabled={item.quantity <= 1 || isDeleting}
          >
            <Minus size={14} />
          </button>

          <span className="text-base font-bold min-w-[32px] text-center">
            {item.quantity}
          </span>

          <button
            onClick={() => addToCart(item, { size: item.selectedSize, color: item.selectedColor, quantity: 1, silent: true })}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black hover:bg-slate-800 text-white rounded-md transition cursor-pointer"
            disabled={isDeleting}
          >
            <Plus size={14} />
          </button>
        </div>

        <p className="text-slate-500 font-medium text-sm">
          Item Total: <span className="font-black text-black">PKR {Number(item.price * item.quantity).toLocaleString('en-PK')}</span>
        </p>
      </div>
    </div>
  );
}
