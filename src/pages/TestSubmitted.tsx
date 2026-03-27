import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function TestSubmitted() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // This extracts the result data that we passed during navigation
  const result = location.state?.result;

  // Format time spent into Minutes and Seconds
  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return "0 min";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Topbar */}
      <div className="h-16 px-8 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="font-bold text-gray-900">{result?.paperName || "Mock Test"}</div>
        <div className="font-bold text-teal-600 bg-teal-50 px-4 py-1 rounded-full text-sm">Completed</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 max-w-lg w-full text-center">
          
          {/* Animated Check Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-teal-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
            <div className="absolute bottom-4 left-0 w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 z-10">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Submitted!</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Excellent work today. We have evaluated your answers and saved them to your personal profile.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="border border-gray-100 bg-gray-50 rounded-2xl p-6">
              <p className="text-gray-500 mb-1 text-sm font-bold uppercase tracking-wider">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTimeSpent(result?.timeSpentSeconds)}
              </p>
            </div>
            <div className="border border-gray-100 bg-gray-50 rounded-2xl p-6">
              <p className="text-gray-500 mb-1 text-sm font-bold uppercase tracking-wider">Final Score</p>
              <p className="text-2xl font-bold text-teal-600">
                {result?.score || 0} <span className="text-gray-400 text-lg">/ {result?.totalQuestions || 0}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/analytics')}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-teal-500/20 mb-6"
          >
            View Full Analytics <ChevronRight className="w-5 h-5" />
          </button>

          <button 
            onClick={() => navigate('/tests')}
            className="text-sm font-medium text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors"
          >
            Back to the dashboard
          </button>
        </div>
      </div>
    </div>
  );
}