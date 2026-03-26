import { useState, useEffect } from 'react';
import { Mail, Bell, User, Download, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function Analytics() {
  // These will be populated from the backend
  const [bellCurveData, setBellCurveData] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [sectionalData, setSectionalData] = useState<any[]>([]);
  const [errorLogData, setErrorLogData] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch analytics data from backend
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Performance Report</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-900"><Mail className="w-5 h-5" /></button>
          <button className="p-2 text-gray-500 hover:text-gray-900"><Bell className="w-5 h-5" /></button>
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> export
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900"><User className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Part A review</h2>
        <p className="text-gray-500">A Deeper analytics of your Part A section</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Total Marks</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-gray-900">0</span>
            <span className="text-gray-400">/0</span>
          </div>
          <p className="text-gray-400 text-sm font-medium flex items-center gap-1">
            NA
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Global Rank</p>
          <div className="text-4xl font-bold text-gray-900 mb-2">NA</div>
          <p className="text-gray-400 text-sm font-medium flex items-center gap-1">
            NA
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Percentile</p>
          <div className="text-4xl font-bold text-gray-900 mb-2">NA</div>
          <p className="text-gray-500 text-sm">NA</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Accuracy</p>
          <div className="text-4xl font-bold text-gray-900 mb-4">0%</div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 w-[0%]"></div>
            </div>
            <span>Target: NA</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column (Main Content) */}
        <div className="col-span-8 space-y-8">
          
          {/* Score Distribution Range */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Score Distribution Range</h3>
                <p className="text-sm text-gray-500">Comparative percentile analysis</p>
              </div>
              <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-200"></div> Cutoff</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal-500"></div> You</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-600"></div> Topper</span>
              </div>
            </div>
            <div className="h-64 w-full flex items-center justify-center text-gray-400">
              {bellCurveData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bellCurveData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                "No data available"
              )}
            </div>
          </div>

          {/* Time Expenditure Analysis */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Time Expenditure Analysis</h3>
            <p className="text-sm text-gray-500 mb-6">Time spent per Question Group (in minutes)</p>
            <div className="h-48 w-full flex items-center justify-center text-gray-400">
              {timeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                      {timeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#b2dfdb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                "No data available"
              )}
            </div>
          </div>

          {/* Sectional Deep-Dive */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Sectional Deep-Dive</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Part A</span>
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
                  {sectionalData.length > 0 ? (
                    sectionalData.map((row, i) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">No sectional data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Part B: Drawing & Design Preview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Part B: Drawing & Design Preview</h3>
            <div className="flex gap-6">
              <div className="w-64 h-40 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                [Drawing Image]
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Summary</p>
                    <p className="text-sm text-gray-400 italic">
                      No summary available yet.
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">Quick Score</p>
                    <div className="text-2xl font-bold text-gray-400">0<span className="text-sm">/0</span></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Perspective</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[0%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Drafting</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[0%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Composition</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[0%]"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto flex justify-end">
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                    Get deeper analytics <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Error Log */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Strategic Error Log</h3>
                <p className="text-sm text-gray-500">Critical analysis of missed scoring opportunities</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Filter by Category</button>
                <button className="text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Sort by Marks Lost</button>
                <button className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  view your answers <ChevronRight className="w-4 h-4" />
                </button>
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
                    errorLogData.map((row, i) => (
                      <tr key={i}>
                        <td className="py-4">
                          <div className="font-bold text-gray-900">{row.id}</div>
                          <div className="text-xs text-gray-400">{row.section}</div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            row.type === 'danger' ? 'bg-red-100 text-red-600' :
                            row.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {row.category}
                          </span>
                        </td>
                        <td className="py-4 text-center text-gray-600">
                          {row.time.includes('CRITICAL') ? (
                            <span className="text-red-500 font-medium">{row.time}</span>
                          ) : row.time.includes('+') ? (
                            <span>{row.time.split(' ')[0]} <span className="text-red-400 text-xs">{row.time.split(' ')[1]}</span></span>
                          ) : (
                            row.time
                          )}
                        </td>
                        <td className="py-4 text-right font-bold text-red-500">{row.marks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">No errors logged yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button className="text-xs font-medium text-orange-400 border border-orange-200 px-3 py-1 rounded-full hover:bg-orange-50 transition-colors">
                view all errors
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Cognitive SWOT Matrix</h3>
            
            <div className="space-y-6">
              {/* Primary Proficiencies */}
              <div>
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> Primary Proficiencies
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400 italic">
                    Not enough data
                  </li>
                </ul>
              </div>

              {/* Identified Deficiencies */}
              <div>
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Identified Deficiencies
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400 italic">
                    Not enough data
                  </li>
                </ul>
              </div>

              {/* Growth Opportunities */}
              <div>
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> Growth Opportunities
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-400 italic">Not enough data</p>
                </div>
              </div>

              {/* Risk Factors */}
              <div>
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Risk Factors
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-400 italic">Not enough data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
