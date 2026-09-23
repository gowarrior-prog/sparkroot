'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Link } from './lib/routerCompat';
import { Mail, Phone, Instagram } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const pathname = usePathname();

  // Hide store Footer on Admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-black text-white pt-12 pb-28 md:pb-12 px-6 sm:px-12 border-t border-gray-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Logo & Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <Logo className="h-12 w-auto" />
            </Link>
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs">
              Modern luxury atelier delivering handpicked jewelry, timepieces, and lifestyle collections nationwide.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Quick Links</h3>
            <ul className="space-y-2 text-xs font-medium text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Got In Touch */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Got In Touch</h3>
            <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <a href="mailto:sparkrootofficial@gmail.com" className="hover:text-white transition">sparkrootofficial@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <a href="tel:+923467921114" className="hover:text-white transition">+92 346 7921114</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Follow Us</h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Instagram size={16} className="text-gray-400 shrink-0" />
              <a
                href="https://www.instagram.com/sparkrootonlinestore?stkn=MTVxcmE0a3YwOWwzbA=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition font-medium"
              >
                sparkrootonlinestore
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-900 text-center text-xs text-gray-500 font-medium">
          © {new Date().getFullYear()} SparkRoot Luxury Atelier. All rights reserved.
        </div>
      </div>
    </footer>
  );
}