import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
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

  // Format data for the chart
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

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto pt-8">
      
      {/* PERFORMANCE HISTORY CARD */}
      <div className="bg-[#f4f5f6] rounded-[2rem] p-10 border border-gray-200/60 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance History</h2>
        <p className="text-gray-500 text-sm mb-12">Track your growth across all mock attempts.</p>
        
        {results.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 font-medium bg-gray-100 rounded-2xl border border-dashed border-gray-300">
            Take your first mock test to unlock your history graph!
          </div>
        ) : (
          <div className="w-full overflow-x-auto pb-4">
            <div style={{ minWidth: `${Math.max(100, results.length * 10)}%`, height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  {/* Faint horizontal lines */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dx={-10}
                    allowDecimals={false} // Prevents 1.5, 2.5 on the axis
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ stroke: '#14b8a6', strokeWidth: 1, strokeDasharray: '4 4' }} 
                  />
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