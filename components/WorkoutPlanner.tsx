
import React, { useState, useEffect } from 'react';
import { FitnessGoal, FitnessLevel, WorkoutPlan, Workout } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { Calendar as CalendarIcon, Target, User, Sparkles, Loader2, CheckCircle2, Info } from 'lucide-react';

interface Props {
  history: Workout[];
}

const WorkoutPlanner: React.FC<Props> = ({ history }) => {
  const [goal, setGoal] = useState<FitnessGoal>('General Fitness');
  const [level, setLevel] = useState<FitnessLevel>('Beginner');
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('zenithfit_plan');
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newPlan = await generateWorkoutPlan(goal, level, history);
      setPlan(newPlan);
      localStorage.setItem('zenithfit_plan', JSON.stringify(newPlan));
    } catch (err) {
      alert("Failed to generate plan. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const goals: FitnessGoal[] = ['Muscle Gain', 'Weight Loss', 'Endurance', 'General Fitness'];
  const levels: FitnessLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personalized Planner</h2>
          <p className="text-slate-500 dark:text-slate-400">Tailored 7-day roadmap for your specific goals.</p>
        </div>
        {plan && (
          <button 
            onClick={() => setPlan(null)}
            className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline"
          >
            Update Preferences
          </button>
        )}
      </div>

      {!plan ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto transition-colors">
          <div className="space-y-8">
            <section>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 block flex items-center gap-2">
                <Target size={16} className="text-indigo-600 dark:text-indigo-400" />
                What is your main goal?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {goals.map(g => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      goal === g ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-sm">{g}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 block flex items-center gap-2">
                <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                Current Fitness Level
              </label>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                {levels.map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                      level === l ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </section>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Generate My Weekly Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {plan.schedule.map((dayPlan, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0">
                      {dayPlan.day.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-200">{dayPlan.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{dayPlan.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded text-slate-600 dark:text-slate-400 uppercase">
                          {dayPlan.type}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {dayPlan.duration} MINS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600 dark:bg-indigo-800 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info size={20} />
                Plan Insights
              </h3>
              <ul className="space-y-3">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-indigo-50 dark:text-indigo-100">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-indigo-500/30">
                <p className="text-xs text-indigo-200 dark:text-indigo-300 uppercase tracking-widest font-bold">Current Roadmap</p>
                <p className="text-xl font-bold mt-1">{plan.goal}</p>
                <p className="text-sm text-indigo-100 dark:text-indigo-200 opacity-80">{plan.level} Phase</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
               <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Today's Focus</h4>
               <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">Consistency is key. Follow the plan for 21 days to form a habit.</p>
               <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 dark:bg-emerald-600 w-1/3"></div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-2 uppercase tracking-tighter">Week 1 - Day 3 Progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;
