"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Activity, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.user.role !== 'admin') {
            router.push('/dashboard');
            return;
          }
        } else {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [router]);

  if (loading) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', marginTop: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
        <p style={{ color: '#94a3b8' }}>Platform overview and user management.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: '#3b82f6' },
          { label: 'Active Today', value: Math.floor(users.length * 0.8), icon: Activity, color: '#10b981' },
          { label: 'New Signups', value: '3', icon: UserPlus, color: '#8b5cf6' },
          { label: 'System Status', value: 'Healthy', icon: Database, color: '#ef4444' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            className="card glass"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ padding: '1rem', borderRadius: '12px', background: `rgba(${stat.color === '#10b981' ? '16, 185, 129' : stat.color === '#3b82f6' ? '59, 130, 246' : stat.color === '#8b5cf6' ? '139, 92, 246' : '239, 68, 68'}, 0.1)` }}>
              <stat.icon color={stat.color} size={24} />
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card glass">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>User Registry</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td style={{ fontWeight: '500' }}>{user.name}</td>
                  <td style={{ color: '#94a3b8' }}>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
