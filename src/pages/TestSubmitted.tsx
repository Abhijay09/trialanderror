import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function TestSubmitted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Topbar */}
      <div className="h-16 px-8 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="font-bold text-gray-900">Uceed Mock test</div>
        <div className="font-bold text-gray-900">Completed</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 max-w-lg w-full text-center">
          
          {/* Animated Check Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            {/* Dashed circle */}
            <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
            {/* Floating particles */}
            <div className="absolute top-2 right-2 w-4 h-4 bg-teal-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
            <div className="absolute bottom-4 left-0 w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
            {/* Main Check */}
            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 z-10">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Submitted!</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Excellent work today. We are currently analyzing your responses with honesty and precision to give you the most accurate feedback for your growth.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-500 mb-1">Time Spent</p>
              <p className="text-xl font-bold text-gray-900">0hr 0min</p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-500 mb-1">Attempted</p>
              <p className="text-xl font-bold text-gray-900">0/0</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/analytics')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors mx-auto mb-6"
          >
            View analytics <ChevronRight className="w-4 h-4" />
          </button>

          <button 
            onClick={() => navigate('/tests')}
            className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors"
          >
            Back to the dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
