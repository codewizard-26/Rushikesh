"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Activity, Database, ShieldCheck, Mail, Calendar } from 'lucide-react';
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
            router.push('/dashboard'); return;
          }
        } else {
          router.push('/login'); return;
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Accessing Secure Admin Core...</div>;

  const stats = [
    { label: 'Total Members', value: users.length, icon: Users, color: 'blue' },
    { label: 'Platform Activity', value: 'High', icon: Activity, color: 'emerald' },
    { label: 'Daily Signups', value: '12', icon: UserPlus, color: 'purple' },
    { label: 'Server Status', value: 'Optimal', icon: Database, color: 'rose' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-[0.2em] mb-2">
             <ShieldCheck size={16} /> Restricted Authority
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Terminal</h1>
          <p className="text-slate-500 font-medium">Monitoring platform-wide engagement and user compliance.</p>
        </div>
        <div className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live System Monitor
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-3xl border border-slate-100 flex items-center gap-5"
          >
            <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-black text-slate-900">User Registry</h2>
           <button className="text-sm font-bold text-blue-600 px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors">Export CSV</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 font-black text-xs uppercase tracking-widest border-b border-slate-100 italic">
                <th className="pb-5 pl-4">Member Info</th>
                <th className="pb-5">Permission Level</th>
                <th className="pb-5">Registration</th>
                <th className="pb-5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(user => (
                <tr key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 pl-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                          {user.name.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                             <Mail size={12} /> {user.email}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                       <Calendar size={14} className="text-slate-300" />
                       {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-6 text-right pr-4">
                    <button className="text-xs font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest">Restrict</button>
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
