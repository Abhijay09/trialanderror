import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Shield, Target, TrendingUp } from 'lucide-react';

export default function TestsDashboard() {
  const navigate = useNavigate();

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
          <button 
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
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
          <button 
            className="bg-[#8eb37b] hover:bg-[#7a9d68] text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
            <Shield className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Mocks taken</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
            <Target className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Questions solved</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Avg score</p>
            <p className="text-2xl font-bold text-gray-900">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
