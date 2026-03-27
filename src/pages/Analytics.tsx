import { useState, useEffect } from 'react';
import { Mail, Bell, Download, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Analytics() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [allResults, setAllResults] = useState<any[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(0);
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
          // Data comes oldest-to-newest. We reverse it so newest is at index 0.
          const reversedData = [...data].reverse();
          setAllResults(reversedData);
          setSelectedResultIndex(0);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-gray-500">Loading your analytics...</div>;
  if (error) return <div className="min-h-screen flex flex-col justify-center items-center text-gray-500"><h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2><p className="mb-4">{error}</p><button onClick={() => navigate('/tests')} className="bg-teal-500 text-white px-6 py-2 rounded-lg">Go to Tests</button></div>;

  // The currently selected result
  const result = allResults[selectedResultIndex];

  // --- CALCULATE REAL DATA FOR SELECTED RESULT ---
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
    <div className="max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Performance Report</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-900"><Mail className="w-5 h-5" /></button>
          <button className="p-2 text-gray-500 hover:text-gray-900"><Bell className="w-5 h-5" /></button>
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* --- ATTEMPT SELECTOR --- */}
      <div className="text-center mb-10 flex flex-col items-center">
        <select 
            value={selectedResultIndex}
            onChange={(e) => setSelectedResultIndex(Number(e.target.value))}
            className="text-3xl font-bold text-gray-900 mb-2 bg-transparent border-none outline-none cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-xl transition-colors appearance-none text-center"
        >
            {allResults.map((r, idx) => {
                const date = new Date(r.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
                return (
                    <option key={r._id} value={idx}>
                        {r.paperName} (Attempt {allResults.length - idx}) - {date}
                    </option>
                );
            })}
        </select>
        <p className="text-gray-500">A deeper analytics review of your selected attempt</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Total Marks</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-teal-600">{totalMarks}</span>
            <span className="text-gray-400">/{totalQuestions}</span>
          </div>
          <p className="text-teal-600 text-sm font-medium flex items-center gap-1">Based on saved answers</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Global Rank</p>
          <div className="text-4xl font-bold text-gray-400 mb-2">NA</div>
          <p className="text-gray-400 text-sm font-medium flex items-center gap-1">More data required</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Percentile</p>
          <div className="text-4xl font-bold text-gray-400 mb-2">NA</div>
          <p className="text-gray-400 text-sm">More data required</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Accuracy</p>
          <div className="text-4xl font-bold text-gray-900 mb-4">{accuracy}%</div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${accuracy}%` }}></div>
            </div>
            <span>Target: 80%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column (Main Content) */}
        <div className="col-span-8 space-y-8">
          
          {/* Score Distribution Range (NA logic) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm opacity-50 grayscale">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Score Distribution Range (NA)</h3>
                <p className="text-sm text-gray-500">Comparative percentile analysis requires more users</p>
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

          {/* Sectional Deep-Dive (POPULATED WITH REAL DATA) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Sectional Deep-Dive</h3>
              <span className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-full uppercase">Real Data</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <tr>
                    <th className="pb-3 font-medium">Section Name</th>
                    <th className="pb-3 font-medium text-center">Correct</th>
                    <th className="pb-3 font-medium text-center">Wrong</th>
                    <th className="pb-3 font-medium text-center">Unattempted</th>
                    <th className="pb-3 font-medium text-center">Accuracy (%)</th>
                    <th className="pb-3 font-medium text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sectionalData.map((row, i) => (
                    <tr key={i}>
                      <td className="py-4">
                        <div className="font-bold text-gray-900">{row.name}</div>
                        <div className="text-xs text-gray-400">{row.range}</div>
                      </td>
                      <td className="py-4 text-center font-bold text-teal-500">{row.correct}</td>
                      <td className="py-4 text-center font-bold text-red-500">{row.wrong}</td>
                      <td className="py-4 text-center font-medium text-gray-500">{row.unattempted}</td>
                      <td className="py-4 text-center font-bold text-gray-900">{row.accuracy}</td>
                      <td className="py-4 text-right font-bold text-gray-900">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Error Log (POPULATED WITH REAL WRONG ANSWERS) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Strategic Error Log</h3>
                <p className="text-sm text-gray-500">Critical analysis of missed scoring opportunities</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <tr>
                    <th className="pb-3 font-medium">Question ID</th>
                    <th className="pb-3 font-medium text-center">Error Category</th>
                    <th className="pb-3 font-medium text-center">Time Spent</th>
                    <th className="pb-3 font-medium text-right">Marks Lost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {errorLogData.length > 0 ? (
                    errorLogData.map((row: any, i: number) => (
                      <tr key={i}>
                        <td className="py-4">
                          <div className="font-bold text-gray-900">{row.id}</div>
                          <div className="text-xs text-gray-400">{row.section}</div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                            {row.category}
                          </span>
                        </td>
                        <td className="py-4 text-center text-gray-400 font-mono">NA</td>
                        <td className="py-4 text-right font-bold text-red-500">{row.marks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 font-medium">No errors made! Perfect score.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Cognitive SWOT Matrix</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> Primary Proficiencies
                </h4>
                <p className="text-sm font-medium text-gray-400 italic">Requires 5+ tests (NA)</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Identified Deficiencies
                </h4>
                <p className="text-sm font-medium text-gray-400 italic">Requires 5+ tests (NA)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}