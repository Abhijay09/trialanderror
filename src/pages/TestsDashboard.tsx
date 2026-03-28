import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Shield, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TestsDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/results/${user._id}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching results", err);
        setLoading(false);
      });
  }, [user]);

  // --- CALCULATE REAL STATS ---
  const mocksTaken = results.length;
  
  const questionsSolved = results.reduce((acc, curr) => {
    const correctCount = curr.answers?.filter((a: any) => a.isCorrect).length || 0;
    return acc + correctCount;
  }, 0);

  const avgScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => {
        const safeTotal = curr.totalQuestions > 0 ? curr.totalQuestions : 1; 
        return acc + ((curr.score / safeTotal) * 100);
      }, 0) / results.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto pt-10 px-4 pb-20">
      {/* HEADER SECTION */}
      <div className="text-center mb-14">
        <h1 className="text-[44px] font-bold text-gray-900 mb-2 tracking-tight">What's your goal today?</h1>
        <p className="text-gray-500 text-lg">Pick a test up and get started.</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        
        {/* --- 1. MOCK TEST SERIES (FULL WIDTH) --- */}
        <div className="col-span-2 bg-white rounded-[24px] p-10 border border-gray-300/60 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* The Icon Box */}
            <div className="w-20 h-20 bg-[#d1fae5] text-[#14b8a6] rounded-[20px] flex items-center justify-center shrink-0 border border-teal-50">
              <FileText size={40} />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-[#14b8a6] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                Best result
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Mock Test series</h2>
              <p className="text-gray-500 max-w-xl text-lg leading-relaxed">
                Experience a full-length, timed UCEED simulation to see exactly where you stand against the competition.
              </p>
            </div>
          </div>
          <button className="bg-[#25b19c] hover:bg-[#1f9684] text-white px-8 py-4 rounded-[14px] font-bold text-lg flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-teal-500/10">
            Continue <ChevronRight size={20} />
          </button>
        </div>

        {/* --- 2. PAST YEAR PAPERS (LEFT CARD) --- */}
        <div className="bg-white rounded-[24px] p-10 border border-gray-300/60 flex flex-col items-start min-h-[360px]">
          <div className="inline-block px-3 py-1 bg-[#ee7b51] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            Best result
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Past year papers</h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-10 flex-1">
            Practice official Uceed papers to understand the exam pattern and get a grasp on the concepts
          </p>
          <button 
            onClick={() => navigate('/tests/past-papers')}
            className="w-full sm:w-auto bg-[#ee7b51] hover:bg-[#d66941] text-white px-8 py-4 rounded-[14px] font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-orange-500/10"
          >
            Continue <ChevronRight size={20} />
          </button>
        </div>

        {/* --- 3. SECTIONAL TEST SERIES (RIGHT CARD) --- */}
        <div className="bg-white rounded-[24px] p-10 border border-gray-300/60 flex flex-col items-start min-h-[360px]">
          <div className="inline-block px-3 py-1 bg-[#93ad7a] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            Best result
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sectional Test series</h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-10 flex-1">
            Focus on improving Visualization or Math at your own pace with detailed hints and step-by-step solutions.
          </p>
          <button className="w-full sm:w-auto bg-[#93ad7a] hover:bg-[#7e9568] text-white px-8 py-4 rounded-[14px] font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-[#93ad7a]/10"
          >
            Continue <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* --- STATS BAR SECTION --- */}
      <div className="grid grid-cols-3 gap-8">
        {/* Mocks Taken */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center shrink-0">
            <Shield size={28} className="text-gray-800" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-0.5">Mocks taken</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? "..." : mocksTaken}</p>
          </div>
        </div>
        
        {/* Questions Solved */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center shrink-0">
            <Target size={28} className="text-gray-800" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-0.5">Questions solved</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? "..." : questionsSolved}</p>
          </div>
        </div>
        
        {/* Avg Score */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center shrink-0">
            <TrendingUp size={28} className="text-gray-800" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-0.5">Avg score</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? "..." : `${avgScore}%`}</p>
          </div>
        </div>
      </div>

    </div>
  );
}