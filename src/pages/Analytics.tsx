import { useState, useEffect } from 'react';
import { Mail, Bell, Download, ChevronRight, ArrowLeft, Calendar, Clock, Target, Timer } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Analytics() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [allResults, setAllResults] = useState<any[]>([]);
  // If null, we show the list of all tests. If it's a number, we show that specific test's analytics.
  const [selectedResultIndex, setSelectedResultIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:5000/api/results/${user._id}`)
      .then(res => {
        if (!res.ok) throw new Error("No test results found.");
        return res.json();
      })
      .then(data => {
        if (data.length === 0) {
          setError("No test results found. Take a test first!");
        } else {
          // Data comes oldest-to-newest. We reverse it so newest is at the top.
          const reversedData = [...data].reverse();
          setAllResults(reversedData);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading your history...</div>;
  
  if (error) return (
    <div className="min-h-screen flex flex-col justify-center items-center text-gray-500">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2>
      <p className="mb-4">{error}</p>
      <button onClick={() => navigate('/tests')} className="bg-teal-500 text-white px-6 py-2 rounded-lg font-bold">Go to Tests</button>
    </div>
  );

  // Helper function to format time (e.g., 65 seconds -> 1m 5s)
  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // ============================================================================
  // VIEW 1: THE HISTORY GRID (Shows all mock papers as clickable boxes)
  // ============================================================================
  if (selectedResultIndex === null) {
    return (
      <div className="max-w-7xl mx-auto pt-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Test History</h1>
            <p className="text-gray-500">Click on any attempt to view detailed analytics and error logs.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200"><Mail className="w-5 h-5" /></button>
            <button className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200"><Bell className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allResults.map((result, idx) => {
            const dateObj = new Date(result.createdAt);
            const dateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const accuracy = result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;

            return (
              <div 
                key={result._id} 
                onClick={() => setSelectedResultIndex(idx)}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Attempt {allResults.length - idx}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{dateStr}</p>
                    <p className="text-xs font-medium text-gray-400">{timeStr}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-6">{result.paperName}</h3>

                <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1 mb-1"><Target className="w-3 h-3"/> Score</p>
                    <p className="text-lg font-bold text-gray-900">{result.score} <span className="text-sm text-gray-400">/ {result.totalQuestions}</span></p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1 mb-1"><Timer className="w-3 h-3"/> Time</p>
                    <p className="text-lg font-bold text-gray-900">{formatTimeSpent(result.timeSpentSeconds)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className={accuracy >= 80 ? "text-green-500" : accuracy >= 50 ? "text-yellow-500" : "text-red-500"}>
                      {accuracy}% Accuracy
                    </span>
                  </div>
                  <div className="text-teal-500 group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: THE DETAILED ANALYSIS (Shows specific info for the clicked test)
  // ============================================================================
  const result = allResults[selectedResultIndex];
  
  const totalMarks = result.score;
  const totalQuestions = result.totalQuestions;
  const accuracy = totalQuestions > 0 ? Math.round((totalMarks / totalQuestions) * 100) : 0;
  
  const correctAnswers = result.answers.filter((a: any) => a.isCorrect);
  const unattemptedAnswers = result.answers.filter((a: any) => !a.selectedAnswer);
  const wrongAnswers = result.answers.filter((a: any) => a.selectedAnswer && !a.isCorrect);

  const errorLogData = wrongAnswers.map((ans: any) => ({
    id: `Q${ans.questionNumber}`,
    section: 'Part A',
    category: 'Incorrect Concept', 
    type: 'danger',
    time: 'NA',
    marks: '-1' 
  }));

  const sectionalData = [{
    name: 'Part A - Overall',
    range: `Q1 - Q${totalQuestions}`,
    correct: correctAnswers.length,
    wrong: wrongAnswers.length,
    unattempted: unattemptedAnswers.length,
    accuracy: `${accuracy}%`,
    points: totalMarks
  }];

  const emptyBellCurve = [{ value: 0 }, { value: 20 }, { value: 60 }, { value: 100 }, { value: 60 }, { value: 20 }, { value: 0 }];

  return (
    <div className="max-w-7xl mx-auto pt-4">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
            onClick={() => setSelectedResultIndex(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold transition-colors"
        >
            <ArrowLeft className="w-5 h-5" /> Back to all attempts
        </button>
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="text-center mb-10">
        <p className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-2">Attempt {allResults.length - selectedResultIndex}</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">{result.paperName} Review</h2>
        <p className="text-gray-500 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(result.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(result.createdAt).toLocaleTimeString()}</span>
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2 font-bold uppercase tracking-wider">Total Marks</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-teal-600">{totalMarks}</span>
            <span className="text-gray-400 font-bold">/{totalQuestions}</span>
          </div>
          <p className="text-teal-600 text-sm font-medium flex items-center gap-1">Based on saved answers</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2 font-bold uppercase tracking-wider">Global Rank</p>
          <div className="text-4xl font-bold text-gray-400 mb-2">NA</div>
          <p className="text-gray-400 text-sm font-medium flex items-center gap-1">More data required</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2 font-bold uppercase tracking-wider">Percentile</p>
          <div className="text-4xl font-bold text-gray-400 mb-2">NA</div>
          <p className="text-gray-400 text-sm">More data required</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2 font-bold uppercase tracking-wider">Accuracy</p>
          <div className="text-4xl font-bold text-gray-900 mb-4">{accuracy}%</div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${accuracy}%` }}></div>
            </div>
            <span>Target: 80%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          
          {/* Score Distribution Range (NA logic) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm opacity-50 grayscale">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Score Distribution Range (NA)</h3>
                <p className="text-sm text-gray-500 font-medium">Comparative percentile analysis requires more users</p>
              </div>
            </div>
            <div className="h-64 w-full flex items-center justify-center text-gray-400">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emptyBellCurve} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#9ca3af" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sectional Deep-Dive */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Sectional Deep-Dive</h3>
              <span className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-full uppercase tracking-wider">Real Data</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 tracking-wider">
                  <tr>
                    <th className="pb-4 font-bold">Section Name</th>
                    <th className="pb-4 font-bold text-center">Correct</th>
                    <th className="pb-4 font-bold text-center">Wrong</th>
                    <th className="pb-4 font-bold text-center">Unattempted</th>
                    <th className="pb-4 font-bold text-center">Accuracy (%)</th>
                    <th className="pb-4 font-bold text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sectionalData.map((row, i) => (
                    <tr key={i}>
                      <td className="py-5">
                        <div className="font-bold text-gray-900 text-base">{row.name}</div>
                        <div className="text-xs font-medium text-gray-400 mt-1">{row.range}</div>
                      </td>
                      <td className="py-5 text-center font-bold text-teal-500 text-lg">{row.correct}</td>
                      <td className="py-5 text-center font-bold text-red-500 text-lg">{row.wrong}</td>
                      <td className="py-5 text-center font-bold text-gray-400 text-lg">{row.unattempted}</td>
                      <td className="py-5 text-center font-bold text-gray-900 text-lg">{row.accuracy}</td>
                      <td className="py-5 text-right font-bold text-gray-900 text-lg">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Error Log */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Strategic Error Log</h3>
                <p className="text-sm font-medium text-gray-500">Critical analysis of missed scoring opportunities</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 tracking-wider">
                  <tr>
                    <th className="pb-4 font-bold">Question ID</th>
                    <th className="pb-4 font-bold text-center">Error Category</th>
                    <th className="pb-4 font-bold text-center">Time Spent</th>
                    <th className="pb-4 font-bold text-right">Marks Lost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {errorLogData.length > 0 ? (
                    errorLogData.map((row: any, i: number) => (
                      <tr key={i}>
                        <td className="py-4">
                          <div className="font-bold text-gray-900">{row.id}</div>
                          <div className="text-xs font-medium text-gray-400 mt-1">{row.section}</div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                            {row.category}
                          </span>
                        </td>
                        <td className="py-4 text-center text-gray-400 font-mono font-medium">NA</td>
                        <td className="py-4 text-right font-bold text-red-500 text-lg">{row.marks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 font-medium bg-gray-50 rounded-xl">
                        No errors made! Perfect score.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-8">Cognitive SWOT Matrix</h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div> Primary Proficiencies
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <p className="text-sm font-medium text-gray-400 italic">Requires 5+ tests (NA)</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div> Identified Deficiencies
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <p className="text-sm font-medium text-gray-400 italic">Requires 5+ tests (NA)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}