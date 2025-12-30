
import React, { useState, useEffect } from 'react';
import { UserStats, Workout } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Flame, Clock, Trophy, Target, ArrowUpRight, TrendingUp } from 'lucide-react';

interface Props {
  stats: UserStats;
  workouts: Workout[];
}

const Dashboard: React.FC<Props> = ({ stats, workouts }) => {
  const [metric, setMetric] = useState<'calories' | 'duration'>('calories');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartData = [...workouts].reverse().slice(-7).map(w => ({
    name: new Date(w.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: w.calories,
    duration: w.duration,
  }));

  const StatCard = ({ label, value, icon: Icon, color, delay }: { label: string, value: string | number, icon: any, color: string, delay: string }) => (
    <div 
      className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-md cursor-default ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: delay }}
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4 text-white shadow-lg shadow-current/20`}>
        <Icon size={20} />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <div className="flex items-end justify-between mt-1">
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md mb-1">
          <ArrowUpRight size={12} className="mr-0.5" />
          12%
        </div>
      </div>
    </div>
  );

  const activeColor = metric === 'calories' ? '#6366f1' : '#ec4899'; // indigo-500 vs pink-500
  const activeLabel = metric === 'calories' ? 'Calories Burned' : 'Duration (mins)';

  return (
    <div className="space-y-8">
      <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          Welcome Back! <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your fitness progress at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Workouts" value={stats.totalWorkouts} icon={Trophy} color="bg-amber-500" delay="100ms" />
        <StatCard label="Minutes" value={stats.totalMinutes} icon={Clock} color="bg-indigo-500" delay="200ms" />
        <StatCard label="Calories" value={stats.totalCalories} icon={Flame} color="bg-rose-500" delay="300ms" />
        <StatCard label="Goal" value="85%" icon={Target} color="bg-emerald-500" delay="400ms" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div 
          className={`lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Activity Trends</h3>
            </div>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setMetric('calories')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  metric === 'calories' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Flame size={14} className={metric === 'calories' ? 'animate-pulse' : ''} />
                Calories
              </button>
              <button
                onClick={() => setMetric('duration')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  metric === 'duration' 
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Clock size={14} className={metric === 'duration' ? 'animate-pulse' : ''} />
                Duration
              </button>
            </div>
          </div>
          
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(15, 23, 42)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '12px'
                    }}
                    itemStyle={{color: activeColor, fontWeight: 'bold'}}
                    cursor={{stroke: activeColor, strokeWidth: 2, strokeDasharray: '4 4'}}
                    labelStyle={{marginBottom: '8px', opacity: 0.6, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em'}}
                    formatter={(value: any) => [`${value} ${metric === 'calories' ? 'kcal' : 'mins'}`, activeLabel]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={metric} 
                    stroke={activeColor} 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorMetric)" 
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Log some workouts to see your progress graph!
              </div>
            )}
          </div>
        </div>

        <div 
          className={`space-y-6 transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Avg Duration', value: `${stats.totalWorkouts ? Math.round(stats.totalMinutes / stats.totalWorkouts) : 0}m`, color: 'text-indigo-600 dark:text-indigo-400' },
                { label: 'Daily Goal', value: '45m', color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Best Streak', value: '12 Days', color: 'text-amber-600 dark:text-amber-400' }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-default"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:translate-x-1 transition-transform">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-indigo-600 dark:bg-indigo-700 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              <p className="font-bold text-lg relative z-10">Upgrade to Pro</p>
              <p className="text-indigo-100 text-xs mt-1 relative z-10 leading-relaxed">Get advanced nutrition tracking and custom AI plans tailored to your biometric data.</p>
              <button className="w-full mt-5 py-3 bg-white text-indigo-600 dark:text-indigo-700 rounded-2xl font-bold text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all relative z-10 active:scale-95">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
