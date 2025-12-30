
import React, { useState, useEffect, useRef } from 'react';
import { Workout, ExerciseType } from '../types';
import { 
  Save, 
  Calendar, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Zap, 
  Check,
  Bookmark,
  Trash2,
  Plus,
  Layout
} from 'lucide-react';

interface Props {
  onSubmit: (workout: Omit<Workout, 'id'>) => void;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  type: ExerciseType;
  duration: number;
  calories: number;
  intensity: Workout['intensity'];
}

const WorkoutForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Omit<Workout, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    name: '',
    type: 'Strength',
    duration: 30,
    calories: 200,
    intensity: 'Medium',
    notes: '',
  });

  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Load templates on mount
  useEffect(() => {
    const saved = localStorage.getItem('zenithfit_templates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  useEffect(() => {
    if (seconds > 0) {
      const minutes = Math.max(1, Math.ceil(seconds / 60));
      setFormData(prev => ({ ...prev, duration: minutes }));
    }
  }, [seconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setSeconds(0);
  };

  const saveAsTemplate = () => {
    if (!formData.name) return;
    const newTemplate: WorkoutTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      type: formData.type,
      duration: formData.duration,
      calories: formData.calories,
      intensity: formData.intensity,
    };
    const updated = [newTemplate, ...templates].slice(0, 10); // Keep last 10
    setTemplates(updated);
    localStorage.setItem('zenithfit_templates', JSON.stringify(updated));
  };

  const applyTemplate = (template: WorkoutTemplate) => {
    setFormData({
      ...formData,
      name: template.name,
      type: template.type,
      duration: template.duration,
      calories: template.calories,
      intensity: template.intensity,
    });
  };

  const deleteTemplate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('zenithfit_templates', JSON.stringify(updated));
  };

  const types: ExerciseType[] = ['Strength', 'Cardio', 'Flexibility', 'Sport', 'HIIT'];
  const intensities: Workout['intensity'][] = ['Low', 'Medium', 'High'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      onSubmit(formData);
      handleResetTimer();
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Log Workout</h2>
          <p className="text-slate-500 dark:text-slate-400">Track your sweat session and see the gains.</p>
        </div>
        
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-4 transition-colors">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Timer</span>
            <span className={`text-xl font-mono font-bold ${timerActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {formatTime(seconds)}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTimerActive(!timerActive)}
              className={`p-2 rounded-xl transition-all ${
                timerActive 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400' 
                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
              }`}
            >
              {timerActive ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-all"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      {templates.length > 0 && (
        <div className="mb-6 animate-in slide-in-from-top-2 duration-500">
          <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
            <Bookmark size={14} className="text-indigo-500" />
            Quick Templates
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template)}
                className="group relative flex flex-col items-start p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl min-w-[140px] hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left shadow-sm"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate w-full">{template.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 mt-1 uppercase tracking-tight">{template.type} • {template.duration}m</span>
                <span 
                  onClick={(e) => deleteTemplate(e, template.id)}
                  className="absolute -top-1 -right-1 p-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <Trash2 size={10} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Activity size={16} className="text-slate-400" />
              Workout Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Upper Body Power"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={saveAsTemplate}
                disabled={!formData.name}
                title="Save as template"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-500 disabled:opacity-0 transition-all"
              >
                <Bookmark size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as ExerciseType })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
            >
              {types.map(t => <option key={t} value={t} className="bg-white dark:bg-slate-800">{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Intensity</label>
            <div className="flex p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              {intensities.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, intensity: i })}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    formData.intensity === i ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              Duration (mins)
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Zap size={16} className="text-slate-400" />
              Est. Calories
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.calories}
              onChange={e => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notes (Optional)</label>
          <textarea
            placeholder="How did you feel?"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex-1 font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group overflow-hidden relative ${
              isSaving 
              ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {isSaving ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Check size={20} className="scale-110" />
                Workout Saved!
              </div>
            ) : (
              <>
                <Save size={20} className="group-hover:scale-110 transition-transform" />
                Save Workout
              </>
            )}
          </button>
          
          {!templates.some(t => t.name === formData.name) && formData.name && (
            <button
              type="button"
              onClick={saveAsTemplate}
              className="px-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all flex items-center justify-center"
              title="Save as template"
            >
              <Bookmark size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
