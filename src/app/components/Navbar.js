"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else setUser(null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    setIsOpen(false); // close mobile menu on navigation
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            FitPulse
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {user.role === 'admin' && <Link href="/admin" className="font-medium text-slate-600 hover:text-blue-500 transition">Admin</Link>}
                {user.role === 'trainer' && <Link href="/trainer" className="font-medium text-slate-600 hover:text-blue-500 transition">Trainer Portal</Link>}
                {user.role === 'user' && (
                  <>
                    <Link href="/dashboard" className="font-medium text-slate-600 hover:text-blue-500 transition">Dashboard</Link>
                    <Link href="/modules" className="font-medium text-slate-600 hover:text-blue-500 transition">Training</Link>
                    <Link href="/profile" className="font-medium text-slate-600 hover:text-blue-500 transition">Profile</Link>
                  </>
                )}
                <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                  <span className="font-bold text-slate-900 text-sm">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-full hover:bg-red-100 transition">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="font-bold text-slate-600 hover:text-blue-500 transition">Login</Link>
                <Link href="/register" className="px-6 py-2.5 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition shadow-md shadow-blue-500/20">
                  Start Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {user ? (
              <>
                {user.role === 'admin' && <Link href="/admin" className="block px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Admin Dashboard</Link>}
                {user.role === 'trainer' && <Link href="/trainer" className="block px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Trainer Portal</Link>}
                {user.role === 'user' && (
                  <>
                    <Link href="/dashboard" className="block px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Dashboard</Link>
                    <Link href="/modules" className="block px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Training Modules</Link>
                    <Link href="/profile" className="block px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Profile Settings</Link>
                  </>
                )}
                <div className="border-t border-slate-200 mt-4 pt-4 px-3">
                  <p className="text-sm font-semibold text-slate-500 mb-3">Logged in as {user.name}</p>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 bg-red-50 text-red-600 font-bold rounded-lg hook:bg-red-100">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Login</Link>
                <Link href="/register" className="block px-3 py-2 mt-2 text-center bg-blue-500 text-white font-bold rounded-xl shadow-md">
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
