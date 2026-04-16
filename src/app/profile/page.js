"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, User as UserIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    goal: 'Maintain',
    activityLevel: 'moderate',
    unitPreference: 'metric'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setFormData({
            weight: data.user.weight || '',
            height: data.user.height || '',
            age: data.user.age || '',
            gender: data.user.gender || 'male',
            goal: data.user.goal || 'Maintain',
            activityLevel: data.user.activityLevel || 'moderate',
            unitPreference: data.user.unitPreference || 'metric'
          });
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMessage('Profile updated successfully! AI engine synchronized.');
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Your Profile</h1>
        <p className="text-slate-600 text-lg font-medium">Manage your biometric data and fitness targets.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-8 flex flex-col items-center text-center sticky top-24">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white mb-6 p-1">
               <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-blue-600">
                  <UserIcon size={48} />
               </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 truncate w-full">{user?.name}</h2>
            <p className="text-slate-500 text-sm mb-4 truncate w-full">{user?.email}</p>
            <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">{user?.role}</span>
            <div className="mt-8 pt-8 border-t border-slate-100 w-full space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-semibold">Joined</span>
                  <span className="text-slate-900 font-bold">{new Date(user?.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="glass rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                 <Settings size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Health & Biometrics</h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Sensitive data used for AI Estimation</p>
              </div>
            </div>

            {message && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 font-semibold border border-emerald-100">
                <Sparkles size={20} className="text-emerald-500" /> {message}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600">Weight ({formData.unitPreference === 'metric' ? 'kg' : 'lbs'})</label>
                <input type="number" step="0.1" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600">Height (cm)</label>
                <input type="number" step="0.1" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600">Age</label>
                <input type="number" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600">Gender</label>
                <select className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 transition-all font-semibold" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600">Primary Goal</label>
                <select className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 transition-all font-semibold" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}>
                  <option value="Lose Weight">Weight Loss</option>
                  <option value="Maintain">Maintain Balance</option>
                  <option value="Gain Weight">Muscle/Weight Gain</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600">Activity Level</label>
                <select className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 transition-all font-semibold" value={formData.activityLevel} onChange={e => setFormData({...formData, activityLevel: e.target.value})}>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Very Active</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                <Save size={20} /> {saving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
