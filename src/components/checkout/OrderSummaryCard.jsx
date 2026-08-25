export default function OrderSummaryCard({
  cartCount,
  subtotal,
  total,
  handlePlaceOrder,
  isSubmitting
}) {
  return (
    <div className="lg:col-span-1">
      <div className="lg:sticky lg:top-24 bg-white border border-slate-200 p-8 shadow-sm">
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
          className="w-full py-5 bg-black text-white font-bold text-sm tracking-widest uppercase hover:bg-slate-800 transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>

        <p className="text-center text-xs text-emerald-700 bg-emerald-50 p-2 mt-4 font-bold uppercase tracking-widest">
          ✓ Original price only — No extra fees added
        </p>
      </div>
    </div>
  );
}
