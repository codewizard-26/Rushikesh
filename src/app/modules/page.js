"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, Award, Clock, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrainingModules() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) router.push('/login');
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Premium Content...</div>;

  const modules = [
    { title: 'Full Body HIIT', duration: '25 min', trainer: 'Sarah J.', level: 'Advanced', color: 'red', desc: 'Intense metabolic conditioning for fat loss.' },
    { title: 'Core Strength Basics', duration: '15 min', trainer: 'Mike T.', level: 'Beginner', color: 'blue', desc: 'Foundational stability for improved posture.' },
    { title: 'Yoga for Flexibility', duration: '40 min', trainer: 'Elena R.', level: 'All Levels', color: 'emerald', desc: 'Dynamic stretching and mindfulness session.' },
    { title: 'Dumbbell Upper Body', duration: '30 min', trainer: 'David W.', level: 'Intermediate', color: 'purple', desc: 'Hypertrophy-focused strength training.' },
    { title: 'Cardio Kickboxing', duration: '35 min', trainer: 'Sarah J.', level: 'Advanced', color: 'orange', desc: 'High-energy explosive combat training.' },
    { title: 'Warm-up Routine', duration: '10 min', trainer: 'Mike T.', level: 'Beginner', color: 'slate', desc: 'Essential joint mobility before any workout.' },
  ];

  const getColorClass = (color) => {
    const maps = {
      'red': 'text-red-500 bg-red-50 hover:bg-red-500',
      'blue': 'text-blue-500 bg-blue-50 hover:bg-blue-500',
      'emerald': 'text-emerald-500 bg-emerald-50 hover:bg-emerald-500',
      'purple': 'text-purple-500 bg-purple-50 hover:bg-purple-500',
      'orange': 'text-orange-500 bg-orange-50 hover:bg-orange-500',
      'slate': 'text-slate-500 bg-slate-50 hover:bg-slate-500'
    };
    return maps[color];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Training Modules</h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Follow along with professional video-based fitness coaching. Gain direct feedback and strike goals with your personalized dashboard.
          </p>
        </div>
        <div className="flex gap-4 items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm">
           <Award size={20} /> Professional Certification Required
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((mod, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="group glass rounded-[2rem] overflow-hidden p-3 border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className={`h-56 rounded-3xl mb-4 relative flex items-center justify-center overflow-hidden transition-all duration-500 bg-${mod.color}-100/50`}>
              {/* Dynamic Abstract Background based on color */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-opacity group-hover:opacity-80 from-transparent to-white/30`} />
              
              <motion.div whileHover={{ scale: 1.1 }} className="z-10 cursor-pointer">
                <PlayCircle size={72} strokeWidth={1.5} className="group-hover:text-blue-500 transition-colors" />
              </motion.div>
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Clock size={14} className="text-slate-500" />
                <span className="text-xs font-black text-slate-900">{mod.duration}</span>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2">
              <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{mod.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <Users size={14} className="text-slate-400" />
                       <span className="text-sm font-semibold text-slate-500">Instructor: {mod.trainer}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600`}>
                  {mod.level}
                </span>
              </div>
              
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                {mod.desc}
              </p>
              
              <button className="w-full group/btn flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95">
                 Start Training <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
