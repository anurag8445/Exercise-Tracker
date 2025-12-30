
import React, { useState, useEffect, useMemo } from 'react';
import { Workout, UserStats } from './types';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';
import AICoach from './components/AICoach';
import WorkoutPlanner from './components/WorkoutPlanner';
import Auth from './components/Auth';
import { 
  Dumbbell, 
  History, 
  LayoutDashboard, 
  Sparkles, 
  PlusCircle, 
  Menu, 
  X,
  CalendarDays,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('zenithfit_current_user'));
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add' | 'ai' | 'planner'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('zenithfit_theme') as 'light' | 'dark' || 'light';
  });

  // Handle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('zenithfit_theme', theme);
  }, [theme]);

  // Load user-specific workouts from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`zenithfit_workouts_${user}`);
      if (saved) {
        setWorkouts(JSON.parse(saved));
      } else {
        setWorkouts([]);
      }
    }
  }, [user]);

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`zenithfit_workouts_${user}`, JSON.stringify(workouts));
    }
  }, [workouts, user]);

  const stats: UserStats = useMemo(() => {
    return {
      totalWorkouts: workouts.length,
      totalMinutes: workouts.reduce((acc, w) => acc + w.duration, 0),
      totalCalories: workouts.reduce((acc, w) => acc + w.calories, 0),
      streakDays: 0,
    };
  }, [workouts]);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('zenithfit_current_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('zenithfit_current_user');
    setIsSidebarOpen(false);
  };

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout = { ...workout, id: Math.random().toString(36).substr(2, 9) };
    setWorkouts([newWorkout, ...workouts]);
    setActiveTab('dashboard');
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
          <Dumbbell className="text-indigo-600" />
          <span>ZenithFit</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 dark:text-slate-400">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="hidden md:flex items-center justify-between text-indigo-600 font-bold text-2xl mb-10">
            <div className="flex items-center space-x-2">
              <Dumbbell size={32} />
              <span>ZenithFit</span>
            </div>
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
          
          <nav className="flex-1 space-y-2">
            <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavItem id="planner" label="Goal Planner" icon={CalendarDays} />
            <NavItem id="history" label="History" icon={History} />
            <NavItem id="add" label="Log Workout" icon={PlusCircle} />
            <NavItem id="ai" label="AI Coach" icon={Sparkles} />
          </nav>

          <div className="mt-auto space-y-4">
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-2xl backdrop-blur-sm">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1 uppercase tracking-wider">Level 1 - {user}</p>
              <div className="h-2 w-full bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-10 pb-24 md:pb-10">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard stats={stats} workouts={workouts} />}
          {activeTab === 'planner' && <WorkoutPlanner history={workouts} />}
          {activeTab === 'history' && <WorkoutHistory workouts={workouts} onDelete={deleteWorkout} />}
          {activeTab === 'add' && <WorkoutForm onSubmit={addWorkout} />}
          {activeTab === 'ai' && <AICoach workouts={workouts} />}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t dark:border-slate-800 flex justify-around py-3 px-4 z-50">
        <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setActiveTab('planner')} className={`p-2 rounded-lg ${activeTab === 'planner' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <CalendarDays size={24} />
        </button>
        <button onClick={() => setActiveTab('add')} className={`p-2 rounded-lg ${activeTab === 'add' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <PlusCircle size={24} />
        </button>
        <button onClick={() => setActiveTab('ai')} className={`p-2 rounded-lg ${activeTab === 'ai' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Sparkles size={24} />
        </button>
      </nav>
    </div>
  );
};

export default App;
