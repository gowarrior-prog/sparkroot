'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import SEO from './SEO';
import { useToast } from './components/ToastProvider';
import ContactSidebar from './components/contact/ContactSidebar';
import ContactForm from './components/contact/ContactForm';

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
            <ContactSidebar />
            <div className="md:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <ContactForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
                submitted={submitted}
                setSubmitted={setSubmitted}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
