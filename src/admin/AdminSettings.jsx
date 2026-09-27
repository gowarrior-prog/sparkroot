'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Key, User, Mail, Eye, EyeOff, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { API } from '../api';

export default function AdminSettings({ getAuthHeaders, handleAuthError }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch(`${API}/admin/profile`, { headers: getAuthHeaders() });
        if (handleAuthError(res.status)) return;
        if (res.ok) {
          const data = await res.json();
          setUsername(data.name || 'admin');
          setEmail(data.email || 'admin@sparkroot.com');
        } else {
          // Fallback from localStorage
          const uStr = localStorage.getItem('user');
          if (uStr) {
            const u = JSON.parse(uStr);
            setUsername(u.name || 'admin');
            setEmail(u.email || 'admin@sparkroot.com');
          }
        }
      } catch (e) {
        console.error('Failed to fetch admin profile', e);
      } finally {
        setFetching(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ text: 'New password and confirm password do not match!', type: 'error' });
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setMessage({ text: 'New password must be at least 4 characters long.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/admin/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim()
        })
      });

      if (handleAuthError(res.status)) return;
      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || 'Admin credentials updated successfully!', type: 'success' });
        // Update local storage token and user object
        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        
        // Reset password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ text: data.error || 'Failed to update admin profile', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="h-4 w-96 bg-slate-100 rounded" />
        <div className="h-10 w-full bg-slate-100 rounded mt-6" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-6 -bottom-8 opacity-10 pointer-events-none">
          <ShieldCheck size={200} />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-amber-400 text-black rounded-2xl shadow-lg font-black">
            <Key size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 block">SECURITY & MANAGEMENT</span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide">
              Admin Credentials Settings
            </h2>
          </div>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm mt-3 font-light max-w-xl">
          Aap yahan se apna Admin Username, Email aur Password permanent change kar sakte hain. Changes hone ke baad nayi details hi permanent login ke liye kaam karein gi.
        </p>
      </div>

      {/* Alert Notification Message */}
      {message.text && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-bold animate-in zoom-in-95 duration-200 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} className="shrink-0 text-emerald-600" /> : <AlertCircle size={20} className="shrink-0 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <User size={18} className="text-amber-500" /> Account Identity
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Admin account username aur official contact email.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Admin Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Admin Username / Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-black outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Iss username se aap Admin Panel mein log in kar sakte hain.</p>
          </div>

          {/* Admin Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@sparkroot.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-black outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Official admin email address.</p>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-4 pt-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Key size={18} className="text-amber-500" /> Change Password
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Agar password change nahi karna to inn fields ko khali chordein.</p>
        </div>

        <div className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              New Password (Optional)
            </label>
            <div className="relative">
              <Key size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 4 characters)"
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-black outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition"
              >
                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Key size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-black outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition"
              >
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            {loading ? 'Saving Changes...' : 'Save Admin Credentials'}
          </button>
        </div>

      </form>
    </div>
  );
}
