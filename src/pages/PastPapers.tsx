import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, HelpCircle, Activity, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PastPapers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Uceed');
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ask the backend for the questions
    fetch('http://localhost:5000/api/questions')
      .then(res => res.json())
      .then(data => {
        // 2. Since all our dummy questions belong to "UCEED Dummy Mock 1", 
        // let's just create one entry in our table for it.
        if (data.length > 0) {
          const firstPaper = {
            id: 'dummy-1',
            name: data[0].paperName, // This will be "UCEED Dummy Mock 1"
            duration: "3 Hrs",
            questions: data.length,
            status: 'empty'
          };
          setPapers([firstPaper]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching papers:", err);
        setLoading(false);
      });
  }, []);

  const handleStartTest = (paperId: string) => {
    // Navigate to the test environment
    navigate(`/test-environment?paperId=${paperId}`);
  };

  return (
    <div className="max-w-5xl mx-auto pt-4">
      {/* ... (keep the breadcrumbs and header same as before) ... */}
      <div className="text-sm text-gray-500 mb-8">
        Test -&gt; <span className="text-gray-900">Mock test</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Past year papers</h1>
        {/* ... (tabs buttons) ... */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setActiveTab('Uceed')} className={cn("px-6 py-2 rounded-lg font-medium border", activeTab === 'Uceed' ? "bg-[#d4e157] border-[#c0ca4a]" : "bg-white")}>Uceed</button>
          <button onClick={() => setActiveTab('NID')} className={cn("px-6 py-2 rounded-lg font-medium border", activeTab === 'NID' ? "bg-[#d4e157] border-[#c0ca4a]" : "bg-white")}>NID</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 text-sm font-medium text-gray-500">
          <div className="col-span-5 flex items-center gap-2"><FileText className="w-4 h-4" /> Mock test</div>
          <div className="col-span-2 text-center"><Clock className="w-4 h-4 inline mr-1"/> Duration</div>
          <div className="col-span-2 text-center"><HelpCircle className="w-4 h-4 inline mr-1"/> Questions</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8">Loading tests from database...</div>
          ) : papers.map((paper) => (
            <div key={paper.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border border-gray-100 bg-white">
              <div className="col-span-5 font-medium text-gray-900">{paper.name}</div>
              <div className="col-span-2 text-center text-gray-600">{paper.duration}</div>
              <div className="col-span-2 text-center text-gray-600">{paper.questions} Questions</div>
              <div className="col-span-1 flex justify-center">
                <div className="w-4 h-4 border-2 border-gray-300 transform rotate-45 rounded-sm"></div>
              </div>
              <div className="col-span-2 flex justify-center">
                <button 
                  onClick={() => handleStartTest(paper.id)}
                  className="bg-[#d4e157] hover:bg-[#c0ca4a] text-gray-900 px-6 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"
                >
                  Start Test <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}