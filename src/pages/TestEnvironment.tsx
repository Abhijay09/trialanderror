import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function TestEnvironment() {
  const navigate = useNavigate();
  const { user } = useAuth() || {}; 
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // TRACK USER ANSWERS: { questionNumber: "A" or 45 }
  const [answers, setAnswers] = useState<Record<number, any>>({});
  
  // REAL TIMER: 3 hours in seconds (10800)
  const [timeLeft, setTimeLeft] = useState(10800);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Check Auth & Fetch Questions
  useEffect(() => {
    if (!user) {
      alert("You must be logged in to take a test!");
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/api/questions')
      .then(res => {
        if (!res.ok) throw new Error("Failed to connect to backend");
        return res.json();
      })
      .then(data => {
        if (data.length === 0) setError("No questions found.");
        else setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Could not connect to the server.");
        setLoading(false);
      });
  }, [user, navigate]);

  // 2. Timer Countdown Logic
  useEffect(() => {
    if (loading || error || isSubmitting) return;

    if (timeLeft <= 0) {
      handleSubmitTest(); // Auto submit when time is up
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, loading, error, isSubmitting]);

  // Helper to format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle answering a question
  const handleAnswerSelect = (answer: any) => {
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.questionNumber]: answer
    }));
  };

  // Submit test to backend
  const handleSubmitTest = async () => {
    if (!window.confirm("Are you sure you want to submit your test?")) return;
    
    setIsSubmitting(true);
    
    const timeSpentSeconds = 10800 - timeLeft;
    const paperName = questions[0]?.paperName || "Unknown Paper";

    try {
      const response = await fetch('http://localhost:5000/api/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id, // Send the unique user ID!
          paperName,
          userAnswers: answers,
          timeSpentSeconds
        })
      });

      const resultData = await response.json();

      if (response.ok) {
        // Redirect to submitted page, passing the score data via React Router state
        navigate('/test-submitted', { state: { result: resultData } });
      } else {
        alert("Failed to submit test: " + resultData.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      alert("Error submitting test. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-medium">Loading Test...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl text-red-500 font-bold">{error}</div>;

  const currentQ = questions[currentIndex];
  if (!currentQ) return <div className="p-20">Question not found...</div>;

  // Has the user answered this specific question?
  const currentAnswer = answers[currentQ.questionNumber] || "";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900">{currentQ.paperName}</h1>
        <div className="flex items-center gap-4">
          {/* Ticking Timer */}
          <div className={cn(
            "text-xl font-mono font-bold transition-colors", 
            timeLeft < 300 ? "text-red-500 animate-pulse" : "text-gray-900"
          )}>
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={handleSubmitTest} 
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 flex gap-8 max-w-7xl mx-auto w-full">
        {/* Question Area */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
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

          {/* Render Inputs dynamically */}
          <div className="flex-1">
            {currentQ.type === 'MCQ' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((opt: any) => (
                  <button 
                      key={opt.id} 
                      onClick={() => handleAnswerSelect(opt.id)}
                      className={cn(
                        "p-5 text-left border-2 rounded-2xl transition-all group",
                        currentAnswer === opt.id 
                          ? "border-teal-500 bg-teal-50/50" 
                          : "border-gray-100 hover:border-teal-300"
                      )}
                  >
                    <span className={cn(
                      "inline-block w-8 h-8 rounded-lg text-center leading-8 font-bold mr-3 transition-colors",
                      currentAnswer === opt.id ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-teal-100"
                    )}>
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
                  value={currentAnswer}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  placeholder="Enter value" 
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-teal-500 focus:outline-none text-2xl font-mono" 
                />
              </div>
            )}
          </div>

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
                    {questions.map((q, i) => {
                        const isAnswered = answers[q.questionNumber] !== undefined && answers[q.questionNumber] !== "";
                        return (
                          <button 
                              key={i} 
                              onClick={() => setCurrentIndex(i)}
                              className={cn(
                                  "w-12 h-12 rounded-xl text-sm font-bold transition-all border-2",
                                  currentIndex === i ? "border-gray-900 scale-110 shadow-md" : "border-transparent",
                                  isAnswered ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                              )}
                          >
                              {i + 1}
                          </button>
                        )
                    })}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}