
import React, { useEffect, useRef, useState } from 'react';
import { Workout, ExerciseType } from '../types';
import { 
  Trash2, 
  Calendar, 
  Clock, 
  Flame, 
  Info, 
  Dumbbell, 
  Activity, 
  Wind, 
  Trophy, 
  Zap 
} from 'lucide-react';

interface Props {
  workouts: Workout[];
  onDelete: (id: string) => void;
}

const WorkoutEntry: React.FC<{ workout: Workout, index: number, onDelete: (id: string) => void }> = ({ workout, index, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once to keep it simple, or remove the disconnect for repeated animations
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  const getIcon = (type: ExerciseType) => {
    switch (type) {
      case 'Strength': return <Dumbbell size={20} />;
      case 'Cardio': return <Activity size={20} />;
      case 'Flexibility': return <Wind size={20} />;
      case 'Sport': return <Trophy size={20} />;
      case 'HIIT': return <Zap size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  return (
    <div 
      ref={domRef}
      style={{ 
        transitionDelay: `${Math.min(index * 50, 300)}ms`,
      }}
      className={`group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-400 dark:hover:border-indigo-500 hover:scale-[1.01] transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          workout.type === 'Strength' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' :
          workout.type === 'Cardio' ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400' :
          workout.type === 'HIIT' ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' :
          workout.type === 'Flexibility' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' :
          workout.type === 'Sport' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' :
          'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
        }`}>
          {getIcon(workout.type)}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200">{workout.name}</h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar size={12} />
              {new Date(workout.date).toLocaleDateString()}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              {workout.duration} mins
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Flame size={12} />
              {workout.calories} kcal
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          workout.intensity === 'High' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' :
          workout.intensity === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' :
          'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
        }`}>
          {workout.intensity}
        </div>
        <button
          onClick={() => onDelete(workout.id)}
          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {workout.notes && (
        <div className="w-full sm:hidden border-t dark:border-slate-800 pt-2 mt-1">
           <p className="text-xs text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
            <Info size={12} />
            {workout.notes}
           </p>
        </div>
      )}
    </div>
  );
};

const WorkoutHistory: React.FC<Props> = ({ workouts, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-in fade-in duration-700">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Workout History</h2>
          <p className="text-slate-500 dark:text-slate-400">A look back at your hard work.</p>
        </div>
        <div className="text-sm text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
          {workouts.length} total entries
        </div>
      </div>

      <div className="space-y-4 pb-10">
        {workouts.length > 0 ? (
          workouts.map((workout, index) => (
            <WorkoutEntry 
              key={workout.id} 
              workout={workout} 
              index={index} 
              onDelete={onDelete} 
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-1000">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-slate-300 dark:text-slate-600" size={32} />
            </div>
            <h3 className="text-slate-900 dark:text-slate-300 font-bold text-lg">No Workouts Yet</h3>
            <p className="text-slate-500 dark:text-slate-500 mt-1 max-w-xs mx-auto">Start your journey by logging your first workout today!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
