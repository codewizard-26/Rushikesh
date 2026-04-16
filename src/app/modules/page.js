"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrainingModules() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
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

  if (loading) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading Modules...</div>;

  const modules = [
    { title: 'Full Body HIIT', duration: '25 min', trainer: 'Sarah J.', level: 'Advanced', color: '#ef4444' },
    { title: 'Core Strength Basics', duration: '15 min', trainer: 'Mike T.', level: 'Beginner', color: '#3b82f6' },
    { title: 'Yoga for Flexibility', duration: '40 min', trainer: 'Elena R.', level: 'All Levels', color: '#10b981' },
    { title: 'Dumbbell Upper Body', duration: '30 min', trainer: 'David W.', level: 'Intermediate', color: '#8b5cf6' },
    { title: 'Cardio Kickboxing', duration: '35 min', trainer: 'Sarah J.', level: 'Advanced', color: '#f59e0b' },
    { title: 'Warm-up Routine', duration: '10 min', trainer: 'Mike T.', level: 'Beginner', color: '#64748b' },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', marginTop: '1rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>Training Modules</h1>
        <p style={{ color: '#475569', fontSize: '1.125rem' }}>Follow along with professional video-based fitness coaching.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {modules.map((mod, idx) => (
          <motion.div 
            key={idx}
            className="card glass"
            style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          >
            <div style={{ height: '180px', background: `linear-gradient(135deg, ${mod.color}20 0%, ${mod.color}40 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <PlayCircle size={64} color={mod.color} style={{ opacity: 0.8 }} />
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {mod.duration}
              </div>
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>{mod.title}</h3>
                <span className="badge" style={{ background: `${mod.color}20`, color: mod.color }}>{mod.level}</span>
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Instructor: {mod.trainer}</p>
              
              <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <PlayCircle size={18} /> Start Workout
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
