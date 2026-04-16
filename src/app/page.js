"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Flame, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <div className="inline-block mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
          🎉 V2.0 - Smarter AI Engine
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight text-slate-900">
          Your Ultimate <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Fitness Companion</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Track real-time progress, log intricate workout details, and stay motivated with our Gemini AI-powered analytics exactly tailored to your body.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all shadow-lg shadow-blue-500/30">
            Start For Free
          </Link>
          <Link href="/login" className="px-8 py-4 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold rounded-full text-lg transition-all">
            Go to Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-24">
        {[
          { title: 'Log Daily Workouts', desc: 'Securely track runs, cycling, weights, and more exactly matched to your metrics.', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'AI Diet Mapping', desc: 'Automatically map Calories and Macros just by describing your daily meals to the AI.', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-100' },
          { title: 'Trainer Portal', desc: 'Secure ecosystem for trainers to assign direct Action Plans to client dashboards.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-100' }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2, duration: 0.5 }}
            className="text-left bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg}`}>
               <feature.icon className={`w-7 h-7 ${feature.color}`} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
