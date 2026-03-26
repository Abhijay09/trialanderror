import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils'; // This was likely missing!

export default function TestEnvironment() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching questions from backend...");
    fetch('http://localhost:5000/api/questions')
      .then(res => {
        if (!res.ok) throw new Error("Failed to connect to backend");
        return res.json();
      })
      .then(data => {
        console.log("Data received:", data);
        if (data.length === 0) {
          setError("No questions found in the database. Did you run the /api/seed link?");
        } else {
          setQuestions(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Could not connect to the server. Make sure your backend is running!");
        setLoading(false);
      });
  }, []);

  // --- SCREEN 1: Still Loading ---
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-medium">Loading Test...</div>;
  }

  // --- SCREEN 2: Something went wrong ---
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button onClick={() => navigate('/tests/past-papers')} className="bg-gray-900 text-white px-6 py-2 rounded-lg">Go Back</button>
      </div>
    );
  }

  // --- SCREEN 3: Everything is fine, show the test ---
  const currentQ = questions[currentIndex];

  // Extra safety check: if for some reason currentQ is missing
  if (!currentQ) return <div className="p-20">Question not found...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900">UCEED Mock Test</h1>
        <div className="flex items-center gap-4">
          <div className="text-xl font-mono font-bold">02:59:59</div>
          <button 
            onClick={() => navigate('/test-submitted')} 
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Submit Test
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 flex gap-8 max-w-7xl mx-auto w-full">
        {/* Question Area */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500 uppercase">
              {currentQ.type} - Question {currentQ.questionNumber}
            </span>
            <span className="text-gray-400 text-sm">Est. Time: {currentQ.estimatedTimeSeconds}s</span>
          </div>

          <h2 className="text-xl text-gray-800 mb-6 font-medium leading-relaxed">
            {currentQ.questionText}
          </h2>

          {currentQ.imageUrl && (
            <div className="mb-8 border border-gray-100 rounded-xl overflow-hidden inline-block bg-gray-50">
                <img src={currentQ.imageUrl} alt="Question Diagram" className="max-h-80 w-auto" />
            </div>
          )}

          {/* Render Options based on type */}
          {currentQ.type === 'MCQ' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt: any) => (
                <button 
                    key={opt.id} 
                    className="p-5 text-left border-2 border-gray-100 rounded-2xl hover:border-teal-500 hover:bg-teal-50/50 transition-all group"
                >
                  <span className="inline-block w-8 h-8 rounded-lg bg-gray-50 text-gray-500 text-center leading-8 font-bold mr-3 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    {opt.id}
                  </span> 
                  <span className="font-medium text-gray-700">{opt.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="max-w-xs">
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Your Answer</label>
              <input 
                type="number" 
                placeholder="Enter value" 
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-teal-500 focus:outline-none text-2xl font-mono" 
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t border-gray-50">
            <button 
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="px-6 py-2 font-bold text-gray-400 hover:text-gray-900 disabled:opacity-30"
            >
                Previous
            </button>
            <button 
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="bg-gray-900 text-white px-8 py-2 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-30"
            >
                Next Question
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="w-72 hidden lg:block">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <h3 className="font-bold mb-4 text-gray-900 flex items-center justify-between">
                    Question Palette
                    <span className="text-xs font-normal text-gray-400">{currentIndex + 1} of {questions.length}</span>
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    {questions.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentIndex(i)}
                            className={cn(
                                "w-12 h-12 rounded-xl text-sm font-bold transition-all border-2",
                                currentIndex === i 
                                    ? "bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20" 
                                    : "bg-white text-gray-400 border-gray-50 hover:border-gray-200"
                            )}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}