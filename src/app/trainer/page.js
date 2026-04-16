"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileVideo, Plus, Target, Medal, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrainerDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user.role !== 'trainer') {
            router.push('/dashboard');
          } else {
            setUser(data.user);
          }
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold tracking-widest">VALIDATING TRAINER CREDENTIALS...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden">
        {/* Abstract background flare */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full -mr-20 -mt-20" />
        
        <div className="z-10">
          <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-3">
             <Medal size={18} /> Verified Professional
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Trainer Portal</h1>
          <p className="text-slate-400 text-lg font-medium">Welcome back, Coach <span className="text-white">{user?.name}</span>. Precision coaching starts here.</p>
        </div>
        <div className="z-10 hidden lg:flex gap-4">
           <div className="px-5 py-3 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Total Clients</p>
              <p className="text-2xl font-black">0</p>
           </div>
           <div className="px-5 py-3 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-300">Modules</p>
              <p className="text-2xl font-black">0</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clients Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-[3rem] p-10 border border-slate-100 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                 <Users size={32} strokeWidth={2.5} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-slate-900">Student Roster</h2>
                 <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">0 active trainees</p>
               </div>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-full transition-colors border border-slate-100">
               <Plus size={24} />
            </button>
          </div>
          
          <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
               <Target size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold text-lg mb-2">No active students yet.</p>
            <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
              When users select you as their coach, they will appear here. You can then push personalized training tasks directly to their dashboard.
            </p>
            <button className="mt-8 px-8 py-3 bg-white text-slate-400 font-black text-xs uppercase tracking-widest rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm">
               Open Directory Listing
            </button>
          </div>
        </motion.div>

        {/* Uploaded Content Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-[3rem] p-10 border border-slate-100 shadow-xl bg-gradient-to-br from-white to-blue-50/20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                 <FileVideo size={32} strokeWidth={2.5} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-slate-900">Studio Room</h2>
                 <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Video Module Management</p>
               </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30">
              <Plus size={18} /> Upload Room
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-purple-500">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                     <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Advanced Coaching Toolkit</h4>
                    <p className="text-xs text-slate-500">Coming Soon: AI-driven video analysis</p>
                  </div>
               </div>
               <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
            
            <div className="bg-slate-50/50 border border-slate-100 p-10 text-center rounded-[2rem]">
              <p className="text-slate-400 font-bold italic">"Share your expertise with the next generation of athletes."</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
