"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState('');
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
          setGoals(data.user.goals || '');
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

  // A mock save handler just updating local state for the prototype,
  // in a full app this would hit a PUT /api/users/me endpoint.
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage('Profile settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  if (loading) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading Profile...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', marginTop: '1rem', maxWidth: '800px' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>Your Profile</h1>
        <p style={{ color: '#475569', fontSize: '1.125rem' }}>Manage your personal details and fitness goals.</p>
      </header>

      <div className="card glass" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <UserIcon size={40} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{user?.name}</h2>
            <p style={{ color: '#64748b' }}>{user?.email}</p>
            <span className="badge badge-user" style={{ marginTop: '0.5rem', display: 'inline-block' }}>{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} /> Preferences & Goals
          </h3>
          
          <div className="input-group">
            <label className="input-label">Primary Fitness Goal</label>
            <textarea 
              className="input-field" 
              rows="3"
              placeholder="E.g., I want to lose 10 lbs in 2 months and run a 5K."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Current Weight (kg)</label>
              <input type="number" className="input-field" placeholder="e.g. 70" />
            </div>
            <div className="input-group">
              <label className="input-label">Target Weight (kg)</label>
              <input type="number" className="input-field" placeholder="e.g. 65" />
            </div>
          </div>

          {message && <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500' }}>{message}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }} disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
