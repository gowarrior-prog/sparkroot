'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, User, Home, Sparkles } from 'lucide-react';
import SEO from './SEO';
import { useToast } from './components/ToastProvider';

export default function Contact() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill in Name, Email, and Message.', 'delete');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmitted(true);
        addToast('Your message has been sent to SparkRoot Admin!', 'success', 'Message Sent');
        setFormData({ name: '', phone: '', email: '', address: '', message: '' });
      } else {
        const data = await res.json();
        addToast(data.error || 'Failed to send message.', 'delete');
      }
    } catch (err) {
      addToast('Network error. Please try again.', 'delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Contact Us — SparkRoot" description="Get in touch with SparkRoot Customer Support Concierge." />
      
      <div className="min-h-screen bg-[#f4f4f6] text-slate-900 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2 text-white border border-white/20">
              <Mail size={24} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">Contact SparkRoot</h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto font-light">
              Have a question about an order or inquiry? Fill out the form below and our team will get back to you immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Contact Info Sidebar */}
            <div className="md:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-black" />
                <span>Get In Touch</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 p-3 bg-[#f4f4f6] rounded-2xl">
                  <Mail size={18} className="text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Email Us</span>
                    <a href="mailto:sparkrootofficial@gmail.com" className="text-gray-600 hover:text-black transition">
                      sparkrootofficial@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f4f4f6] rounded-2xl">
                  <Phone size={18} className="text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Call / WhatsApp</span>
                    <a href="tel:+923447821114" className="text-gray-600 hover:text-black transition font-semibold">
                      +92 344 7821114
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f4f4f6] rounded-2xl">
                  <MapPin size={18} className="text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Location</span>
                    <span className="text-gray-600">Pakistan (Express Nationwide Shipping)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              {submitted ? (
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
              ) : (
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
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
