import { Truck, Info, CreditCard } from 'lucide-react';

export default function ShippingForm({
  formData,
  handleChange,
  paymentMethod,
  setPaymentMethod
}) {
  return (
    <div className="lg:col-span-2 space-y-10">
      {/* Cancellation Notice */}
      <div className="bg-blue-50 border border-blue-200 p-4 flex gap-3 text-blue-800">
        <Info className="shrink-0 mt-0.5" size={20} />
        <p className="text-sm font-medium">
          <strong>Important:</strong> You have a <span className="underline">24-hour window</span> to cancel your order after placement.
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 tracking-tight uppercase">
          <Truck size={24} className="text-black" /> Shipping Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
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
              placeholder="03xx-xxxxxxx"
              className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
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
              placeholder="Street address, house number, area"
              className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City name"
              className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full p-4 bg-slate-50 border border-slate-200 focus:outline-none focus:border-black transition text-sm"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 tracking-tight uppercase">
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
            <span className="font-semibold uppercase tracking-wide text-sm">Cash on Delivery (COD)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
