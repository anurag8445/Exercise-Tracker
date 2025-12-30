
import React, { useState, useEffect } from 'react';
import { Workout, AICoachResponse } from '../types';
import { analyzeWorkouts } from '../services/geminiService';
import { Sparkles, Brain, Lightbulb, Heart, RefreshCw } from 'lucide-react';

interface Props {
  workouts: Workout[];
}

const AICoach: React.FC<Props> = ({ workouts }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<AICoachResponse | null>(null);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const result = await analyzeWorkouts(workouts);
      setInsight(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workouts.length >= 0 && !insight) {
      fetchInsight();
    }
  }, [workouts]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            AI Coach <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Intelligent insights based on your recent activity.</p>
        </div>
        <button 
          onClick={fetchInsight}
          disabled={loading}
          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-full transition-all disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl animate-pulse"></div>
            <Sparkles className="absolute -top-2 -right-2 text-indigo-600 dark:text-indigo-400 animate-bounce" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">AI is Crunching the Data...</h3>
          <p className="text-slate-500 dark:text-slate-500 mt-2 max-w-xs">Analyzing your intensity levels and workout frequency to build your profile.</p>
        </div>
      ) : insight ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                <Brain size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Performance Analysis</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
              {insight.analysis}
            </p>
            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl">
                <Heart size={20} fill="currentColor" />
                <span>Coach Says: "{insight.encouragement}"</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                <Lightbulb size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Recommended Next Steps</h3>
            </div>
            <ul className="space-y-4">
              {insight.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">{rec}</p>
                </li>
              ))}
            </ul>
            
            <div className="mt-10 p-4 bg-slate-900 dark:bg-slate-800 rounded-2xl text-white">
              <h4 className="font-bold text-sm mb-2">Pro Tip</h4>
              <p className="text-xs text-slate-400">Drinking 500ml of water right after waking up boosts your metabolism by 30% for the next hour!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
           <p className="text-slate-500 dark:text-slate-500">Something went wrong. Please try refreshing.</p>
        </div>
      )}
    </div>
  );
};

export default AICoach;
