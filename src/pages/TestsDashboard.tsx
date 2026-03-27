import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Shield, Target, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
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

    // Fetch user's entire test history
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
  
  // Count how many questions were answered correctly across all tests
  const questionsSolved = results.reduce((acc, curr) => {
    const correctCount = curr.answers.filter((a: any) => a.isCorrect).length;
    return acc + correctCount;
  }, 0);

  // Calculate average percentage
  const avgScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + ((curr.score / curr.totalQuestions) * 100), 0) / results.length)
    : 0;

  // --- FORMAT DATA FOR THE HISTORY GRAPH ---
  const chartData = results.map((r, index) => ({
    name: `Attempt ${index + 1}`,
    paper: r.paperName,
    score: r.score,
    total: r.totalQuestions,
    date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    fullDate: new Date(r.createdAt).toLocaleString()
  }));

  // Custom Tooltip for the Graph
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white p-3 rounded-xl text-sm shadow-xl">
          <p className="font-bold text-teal-400 mb-1">{data.paper}</p>
          <p>Score: <span className="font-bold text-white">{data.score}</span> / {data.total}</p>
          <p className="text-gray-400 text-xs mt-1">{data.fullDate}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto pt-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">What's your goal today?</h1>
        <p className="text-gray-500">Pick a test up and get started.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Mock Test Series Card */}
        <div className="col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-full mb-3">
                Best result
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mock Test series</h2>
              <p className="text-gray-500 max-w-md leading-relaxed">
                Experience a full-length, timed UCEED simulation to see exactly where you stand against the competition.
              </p>
            </div>
          </div>
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Past Year Papers Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-start">
          <div className="inline-block px-3 py-1 bg-orange-400 text-white text-xs font-semibold rounded-full mb-4">
            Best result
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Past year papers</h2>
          <p className="text-gray-500 leading-relaxed mb-8 flex-1">
            Practice official Uceed papers to understand the exam pattern and get a grasp on the concepts
          </p>
          <button 
            onClick={() => navigate('/tests/past-papers')}
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sectional Test Series Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-start">
          <div className="inline-block px-3 py-1 bg-[#8eb37b] text-white text-xs font-semibold rounded-full mb-4">
            Best result
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sectional Test series</h2>
          <p className="text-gray-500 leading-relaxed mb-8 flex-1">
            Focus on improving Visualization or Math at your own pace with detailed hints and step-by-step solutions.
          </p>
          <button className="bg-[#8eb37b] hover:bg-[#7a9d68] text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
            <Shield className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Mocks taken</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : mocksTaken}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
            <Target className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Questions solved</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : questionsSolved}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Avg score</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : `${avgScore}%`}</p>
          </div>
        </div>
      </div>

      {/* --- HISTORY GRAPH --- */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Performance History</h2>
        <p className="text-gray-500 text-sm mb-8">Track your growth across all mock attempts.</p>
        
        {results.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Take your first mock test to unlock your history graph!
          </div>
        ) : (
          <div className="w-full overflow-x-auto pb-4">
            {/* The min-width ensures the graph stretches horizontally if there are many tests */}
            <div style={{ minWidth: `${Math.max(100, results.length * 10)}%`, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#14b8a6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#14b8a6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    activeDot={{ r: 6, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}