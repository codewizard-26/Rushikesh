"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileVideo, Plus } from 'lucide-react';
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

  if (loading) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading Trainer Portal...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', marginTop: '2rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>Trainer Portal</h1>
        <p style={{ color: '#475569', fontSize: '1.125rem' }}>Welcome, Coach {user?.name}. Manage your clients and content.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Clients Section */}
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={24} color="var(--primary)" /> My Clients
            </h2>
          </div>
          
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>You currently have no assigned clients.</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>When users hire you from the directory, they will appear here, and you can assign them personalized To-Do lists.</p>
          </div>
        </div>

        {/* Uploaded Content Section */}
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileVideo size={24} color="#8b5cf6" /> My Training Videos
            </h2>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', gap: '0.25rem' }}>
              <Plus size={16} /> Upload Room
            </button>
          </div>

          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            <p style={{ color: '#64748b' }}>No training modules uploaded yet.</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>Share your expertise with the platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
