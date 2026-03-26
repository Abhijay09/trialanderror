import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, HelpCircle, Activity, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PastPapers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Uceed');
  const [papers, setPapers] = useState<any[]>([]); // Will be populated from backend

  useEffect(() => {
    // TODO: Fetch papers from backend based on activeTab
    // Example: fetch(`/api/papers?type=${activeTab}`).then(res => res.json()).then(setPapers)
  }, [activeTab]);

  const handleStartTest = (paperId: number) => {
    // Open in a new window to simulate the locked test environment
    const testWindow = window.open(`/test-environment?paperId=${paperId}`, '_blank', 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no');
    
    // In a real app, you might want to track if the window gets closed
    if (!testWindow) {
      alert("Please allow popups to start the test.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-4">
      <div className="text-sm text-gray-500 mb-8">
        Test -&gt; <span className="text-gray-900">Mock test</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Past year papers</h1>
        <p className="text-gray-500 mb-6">Select a test to start refining your skills</p>
        
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => setActiveTab('Uceed')}
            className={cn(
              "px-6 py-2 rounded-lg font-medium border transition-colors",
              activeTab === 'Uceed' 
                ? "bg-[#d4e157] border-[#c0ca4a] text-gray-900" 
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            Uceed
          </button>
          <button 
            onClick={() => setActiveTab('NID')}
            className={cn(
              "px-6 py-2 rounded-lg font-medium border transition-colors",
              activeTab === 'NID' 
                ? "bg-[#d4e157] border-[#c0ca4a] text-gray-900" 
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            NID
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 text-sm font-medium text-gray-500">
          <div className="col-span-5 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Mock test
          </div>
          <div className="col-span-2 flex items-center gap-2 justify-center">
            <Clock className="w-4 h-4" /> Duration
          </div>
          <div className="col-span-2 flex items-center gap-2 justify-center">
            <HelpCircle className="w-4 h-4" /> Questions
          </div>
          <div className="col-span-1 flex items-center gap-2 justify-center">
            <Activity className="w-4 h-4" /> Status
          </div>
          <div className="col-span-2 text-center">
            Action
          </div>
        </div>

        {/* Table Body */}
        <div className="p-4 space-y-3">
          {papers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No papers available at the moment.
            </div>
          ) : (
            papers.map((paper) => (
              <div key={paper.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                <div className="col-span-5 font-medium text-gray-900">
                  {paper.name}
                </div>
                <div className="col-span-2 text-center text-gray-600 font-medium">
                  {paper.duration}
                </div>
                <div className="col-span-2 text-center text-gray-600 font-medium">
                  {paper.questions} Questions
                </div>
                <div className="col-span-1 flex justify-center">
                  {paper.status === 'yellow' && (
                    <div className="w-4 h-4 bg-[#ffd54f] transform rotate-45 rounded-sm"></div>
                  )}
                  {paper.status === 'green' && (
                    <div className="w-4 h-4 bg-[#4caf50] transform rotate-45 rounded-sm"></div>
                  )}
                  {paper.status === 'empty' && (
                    <div className="w-4 h-4 border-2 border-gray-300 transform rotate-45 rounded-sm"></div>
                  )}
                </div>
                <div className="col-span-2 flex justify-center">
                  <button 
                    onClick={() => handleStartTest(paper.id)}
                    className="bg-[#d4e157] hover:bg-[#c0ca4a] text-gray-900 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                  >
                    Start Test <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
