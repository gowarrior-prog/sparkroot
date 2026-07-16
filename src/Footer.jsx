import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <footer className="bg-zinc-900 text-zinc-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-serif font-bold text-white tracking-tighter">
              Sparkroot
            </Link>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Discover a world of premium products, curated for the modern lifestyle. Quality, elegance, and sophistication in every item.
            </p>
            <div className="flex space-x-4">
              <a href="http://www.facebook.com/share/1D1qD86Pha/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-zinc-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="http://www.instagram.com/sparkroot00?igsh=MWx1bHBxaHd6eWtycA==" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-zinc-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-zinc-500 shrink-0" />
                <span>+92 346 7291114</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-zinc-500 shrink-0" />
                <span>sparkrootofficial@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Sparkroot. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;