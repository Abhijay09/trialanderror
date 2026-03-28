import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, HelpCircle, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function PastPapers() {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  
  const [activeTab, setActiveTab] = useState('Uceed');
  const [groupedPapers, setGroupedPapers] = useState<any[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    Promise.all([
      fetch('http://localhost:5000/api/questions').then(res => res.json()),
      fetch(`http://localhost:5000/api/results/${user._id}`).then(res => res.json())
    ])
    .then(([questionsData, resultsData]) => {
      setUserResults(resultsData);

      const uniquePaperNames = [...new Set(questionsData.map((q: any) => q.paperName))];
      
      const papers = uniquePaperNames.map((name: any) => {
        const questionsForPaper = questionsData.filter((q: any) => q.paperName === name);
        const firstQ = questionsForPaper[0];
        
        // BULLETPROOF CATEGORY FIX: 
        // If the DB forgot the category, we force it based on the paper's name!
        let safeCategory = firstQ.category;
        if (!safeCategory || safeCategory === 'Uceed') {
            if (name.toUpperCase().includes('NID')) {
                safeCategory = 'NID';
            } else {
                safeCategory = 'Uceed';
            }
        }

        // BULLETPROOF DURATION FIX:
        // If DB forgot duration, NID is 120 mins, UCEED is 180 mins.
        let safeDuration = firstQ.testDurationMinutes;
        if (!safeDuration) {
            safeDuration = safeCategory === 'NID' ? 120 : 180;
        }
        
        return {
          id: name,
          name: name,
          category: safeCategory,
          durationMinutes: safeDuration,
          questionCount: questionsForPaper.length
        };
      });

      setGroupedPapers(papers);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });
  }, [user, navigate]);

  const handleStartTest = (paperName: string) => {
    navigate(`/test-environment?paper=${encodeURIComponent(paperName)}`);
  };

  // Safely filter ignoring uppercase/lowercase differences
  const displayedPapers = groupedPapers.filter(
    p => p.category.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div className="max-w-5xl mx-auto pt-4">
      <div className="text-sm text-gray-500 mb-8">
        Test -&gt; <span className="text-gray-900">Mock test</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Past year papers</h1>
        
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => setActiveTab('Uceed')} 
            className={cn("px-6 py-2 rounded-lg font-medium border transition-colors", activeTab.toLowerCase() === 'uceed' ? "bg-[#d4e157] border-[#c0ca4a] text-gray-900" : "bg-white text-gray-600")}
          >
            Uceed
          </button>
          <button 
            onClick={() => setActiveTab('NID')} 
            className={cn("px-6 py-2 rounded-lg font-medium border transition-colors", activeTab.toLowerCase() === 'nid' ? "bg-[#d4e157] border-[#c0ca4a] text-gray-900" : "bg-white text-gray-600")}
          >
            NID
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 text-sm font-medium text-gray-500">
          <div className="col-span-5 flex items-center gap-2"><FileText className="w-4 h-4" /> Mock test</div>
          <div className="col-span-2 text-center"><Clock className="w-4 h-4 inline mr-1"/> Duration</div>
          <div className="col-span-2 text-center"><HelpCircle className="w-4 h-4 inline mr-1"/> Questions</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading tests from database...</div>
          ) : displayedPapers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No {activeTab} papers available yet.</div>
          ) : displayedPapers.map((paper) => {
            
            // DETERMINE STATUS LOGIC
            const paperResults = userResults.filter(r => r.paperName === paper.name);
            const latestResult = paperResults[paperResults.length - 1]; 
            
            let statusColor = "blank";
            if (latestResult) {
              if (latestResult.status === 'completed') statusColor = "green";
              else if (latestResult.status === 'in_progress') statusColor = "yellow";
            }

            const hours = Math.floor(paper.durationMinutes / 60);
            const minutes = paper.durationMinutes % 60;
            const durationText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours} Hrs`;

            return (
              <div key={paper.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border border-gray-100 bg-white hover:border-teal-200 transition-colors">
                <div className="col-span-5 font-medium text-gray-900">{paper.name}</div>
                <div className="col-span-2 text-center text-gray-600">{durationText}</div>
                <div className="col-span-2 text-center text-gray-600">{paper.questionCount} Questions</div>
                
                <div className="col-span-1 flex justify-center">
                  {statusColor === 'blank' && <div className="w-4 h-4 border-2 border-gray-300 transform rotate-45 rounded-sm" title="Not Started"></div>}
                  {statusColor === 'yellow' && <div className="w-4 h-4 bg-[#ffd54f] transform rotate-45 rounded-sm shadow-sm" title="In Progress"></div>}
                  {statusColor === 'green' && <div className="w-4 h-4 bg-[#4caf50] transform rotate-45 rounded-sm shadow-sm" title="Completed"></div>}
                </div>
                
                <div className="col-span-2 flex justify-center">
                  <button 
                    onClick={() => handleStartTest(paper.name)}
                    className="bg-[#d4e157] hover:bg-[#c0ca4a] text-gray-900 px-6 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
                  >
                    {statusColor === 'green' ? "Retake" : statusColor === 'yellow' ? "Resume" : "Start Test"} 
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}