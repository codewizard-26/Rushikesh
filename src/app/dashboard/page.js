"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, Flame, Target, TrendingUp, Plus, Sparkles, Utensils, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [foods, setFoods] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  const [showLogForm, setShowLogForm] = useState(false);
  const [logData, setLogData] = useState({ type: 'Running', durationMinutes: '', exerciseName: '', weightLifted: '', sets: '', reps: '', description: '', notes: '' });
  const [submittingAct, setSubmittingAct] = useState(false);

  const [showFoodForm, setShowFoodForm] = useState(false);
  const [foodData, setFoodData] = useState({ mealDescription: '' });
  const [submittingFood, setSubmittingFood] = useState(false);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const [resAct, resFood, resTask] = await Promise.all([
        fetch('/api/activities'), fetch('/api/food'), fetch('/api/tasks')
      ]);
      if (resAct.ok) setActivities((await resAct.json()).activities);
      if (resFood.ok) setFoods((await resFood.json()).foods);
      if (resTask.ok) setTasks((await resTask.json()).tasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user.role !== 'user') router.push('/admin');
          else {
            setUser(data.user);
            fetchData();
          }
        } else router.push('/login');
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogActivity = async (e) => {
    e.preventDefault();
    setSubmittingAct(true);
    try {
      const payload = { type: logData.type, durationMinutes: Number(logData.durationMinutes), notes: logData.notes };
      if (logData.type === 'Weightlifting') {
        payload.exerciseName = logData.exerciseName; 
        payload.weightLifted = Number(logData.weightLifted);
        payload.sets = Number(logData.sets);
        payload.reps = Number(logData.reps);
      } else if (logData.type === 'Other') payload.description = logData.description;

      const res = await fetch('/api/activities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        setLogData({ type: 'Running', durationMinutes: '', exerciseName: '', weightLifted: '', sets: '', reps: '', description: '', notes: '' });
        setShowLogForm(false);
        fetchData();
      }
    } finally {
      setSubmittingAct(false);
    }
  };

  const handleLogFood = async (e) => {
    e.preventDefault();
    setSubmittingFood(true);
    try {
      const res = await fetch('/api/food', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mealDescription: foodData.mealDescription }) });
      if (res.ok) {
        setFoodData({ mealDescription: '' });
        setShowFoodForm(false);
        fetchData();
      }
    } finally {
      setSubmittingFood(false);
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    await fetch('/api/tasks', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taskId, isCompleted: !currentStatus }) });
    fetchData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading Dashboard...</div>;

  const totalCaloriesBurned = activities.reduce((a, b) => a + b.caloriesBurned, 0);
  const totalCalsIn = foods.reduce((a, b) => a + (b.calories || 0), 0);
  const totalProtein = foods.reduce((a, b) => a + (b.protein || 0), 0);
  const totalCarbs = foods.reduce((a, b) => a + (b.carbs || 0), 0);
  const totalFats = foods.reduce((a, b) => a + (b.fats || 0), 0);

  const macroData = [
    { name: 'Protein', value: totalProtein, color: '#8b5cf6' },
    { name: 'Carbs', value: totalCarbs, color: '#3b82f6' },
    { name: 'Fats', value: totalFats, color: '#f59e0b' }
  ].filter(d => d.value > 0);

  const calData = [
    { name: 'Intake', value: totalCalsIn },
    { name: 'Burned', value: totalCaloriesBurned }
  ];

  const maintenanceGoal = user?.goal || 'Maintain';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 text-lg">Welcome back, <span className="text-blue-500 font-semibold">{user?.name}</span>!</p>
          <p className="text-sm text-slate-500 mt-1">Goal: <strong className="text-slate-900">{maintenanceGoal}</strong></p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button onClick={() => setShowLogForm(!showLogForm)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-50 transition-colors">
            <Activity size={18} /> Workout
          </button>
          <button onClick={() => setShowFoodForm(!showFoodForm)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors">
            <Utensils size={18} /> Nutrition
          </button>
        </div>
      </div>

      {/* Dynamic Forms */}
      {showLogForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-8 border-t-4 border-t-blue-500">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Log Workout</h2>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles size={14} /> AI Engine
            </div>
          </div>
          <form onSubmit={handleLogActivity} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">Activity Type</label>
              <select className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={logData.type} onChange={e => setLogData({...logData, type: e.target.value})}>
                {['Running', 'Cycling', 'Weightlifting', 'Yoga', 'Swimming', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">Duration (Minutes)</label>
              <input type="number" min="1" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required value={logData.durationMinutes} onChange={e => setLogData({...logData, durationMinutes: e.target.value})} />
            </div>

            {logData.type === 'Weightlifting' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Exercise Name</label>
                  <input type="text" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required placeholder="e.g. Bench Press" value={logData.exerciseName} onChange={e => setLogData({...logData, exerciseName: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-600">Weight Lifted (kg)</label>
                  <input type="number" min="1" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required placeholder="60" value={logData.weightLifted} onChange={e => setLogData({...logData, weightLifted: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-600">Sets</label>
                    <input type="number" min="1" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required placeholder="3" value={logData.sets} onChange={e => setLogData({...logData, sets: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-600">Reps per set</label>
                    <input type="number" min="1" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required placeholder="10" value={logData.reps} onChange={e => setLogData({...logData, reps: e.target.value})} />
                  </div>
                </div>
              </>
            )}

            {logData.type === 'Other' && (
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-600">Describe Activity for AI</label>
                <input type="text" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required placeholder="e.g. Played basketball..." value={logData.description} onChange={e => setLogData({...logData, description: e.target.value})} />
              </div>
            )}

            <div className="flex items-end md:col-span-2 mt-2">
              <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors" disabled={submittingAct}>
                {submittingAct ? 'Gemini AI Calculating...' : 'Save Activity'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {showFoodForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-8 border-t-4 border-t-amber-500">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Log Nutrition via AI</h2>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
               <Sparkles size={14} /> AI Mapping
            </div>
          </div>
          <form onSubmit={handleLogFood} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">What did you eat?</label>
              <textarea 
                className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" 
                rows="3" required placeholder="e.g. 2 bowls of dal, a slice of bread and broccoli..." 
                value={foodData.mealDescription} onChange={e => setFoodData({...foodData, mealDescription: e.target.value})} 
              />
            </div>
            <button type="submit" className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors" disabled={submittingFood}>
              {submittingFood ? 'AI Analyzing Macros...' : 'Generate & Log'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-2xl p-6 h-[320px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Caloric Balance</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 h-[320px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-900">Macro Breakdown</h3>
          {macroData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">No macro data yet.</div>
          ) : (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={macroData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={5}>
                    {macroData.map((e, index) => <Cell key={`cell-${index}`} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        {/* Trainer Tasks */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-emerald-500 overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Trainer Action Plan</h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks assigned by a trainer yet.</p>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {tasks.map(t => (
                <div key={t._id} onClick={() => toggleTask(t._id, t.isCompleted)} className="bg-slate-50 p-3 rounded-xl flex gap-3 items-start cursor-pointer transition hover:bg-slate-100">
                  <CheckCircle size={20} className={`shrink-0 mt-0.5 ${t.isCompleted ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <div>
                    <h4 className={`text-sm font-semibold ${t.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{t.title}</h4>
                    {t.description && <p className="text-xs text-slate-500 mt-1">{t.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
           <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">Workout Log</h2>
           {activities.length === 0 ? (
            <p className="text-center text-slate-400 py-4">No workouts logged.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h4 className="font-bold text-slate-900">{act.type}</h4>
                    <p className="text-sm text-slate-500">{act.durationMinutes} min</p>
                    {act.type === 'Weightlifting' && <p className="text-xs text-slate-500 mt-1">{act.exerciseName} - {act.weightLifted}kg ({act.sets} sets x {act.reps} reps)</p>}
                    {act.type === 'Other' && <p className="text-xs text-slate-500 italic mt-1">"{act.description}"</p>}
                  </div>
                  <div className="text-right text-red-500 font-bold whitespace-nowrap flex items-center gap-1">
                    <Sparkles size={12} /> {act.caloriesBurned} kcal
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
           <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">Nutrition Log</h2>
           {foods.length === 0 ? (
            <p className="text-center text-slate-400 py-4">No foods logged.</p>
          ) : (
            <div className="space-y-3">
              {foods.map((f) => (
                <div key={f._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h4 className="font-bold text-slate-900 capitalize">Meal</h4>
                    <p className="text-sm text-slate-500 italic line-clamp-2">"{f.mealName}"</p>
                  </div>
                  <div className="text-right font-bold whitespace-nowrap">
                    <div className="text-emerald-500 flex items-center justify-end gap-1 mb-1">
                      <Sparkles size={12} /> {f.calories} kcal
                    </div>
                    <div className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded inline-block">
                      P:{f.protein}g C:{f.carbs}g F:{f.fats}g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
