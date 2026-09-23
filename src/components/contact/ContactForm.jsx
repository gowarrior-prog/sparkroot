import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm({ formData, handleChange, handleSubmit, loading, submitted, setSubmitted }) {
  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4 animate-fade-in">
        <CheckCircle2 size={56} className="text-emerald-500 mx-auto" />
        <h3 className="text-xl font-extrabold text-slate-900">Thank You!</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Your message has been successfully sent to the SparkRoot Admin. We will get back to you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-gray-100 pb-3">
        Send Us a Message
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            placeholder="+92 300 1234567"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Your City / Delivery Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>
      </div>

      <div>
        <label className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
          Your Message *
        </label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Type your message, order inquiry, or feedback here..."
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-black focus:bg-white transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <span>Sending Message...</span>
        ) : (
          <>
            <Send size={15} />
            <span>Send Message to Admin</span>
          </>
        )}
      </button>
    </form>
  );
}
