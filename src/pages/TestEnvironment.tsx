import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestEnvironment() {
  const navigate = useNavigate();
  const [warnings, setWarnings] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(prev => prev + 1);
        alert(`Warning! You have switched tabs or minimized the window. This is warning #${warnings + 1}.`);
      }
    };

    const handleBlur = () => {
      setWarnings(prev => prev + 1);
      alert(`Warning! You have lost focus on the test window. This is warning #${warnings + 1}.`);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [warnings]);

  const handleSubmit = () => {
    // In a real app, submit data to backend here
    // Then redirect to the submitted page
    navigate('/test-submitted');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">UCEED Mock Test Environment</h1>
        <div className="flex items-center gap-4">
          <div className="text-red-500 font-bold">Warnings: {warnings}</div>
          <div className="text-xl font-mono font-bold">02:59:59</div>
          <button 
            onClick={handleSubmit}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Submit Test
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-2xl w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Test is Running</h2>
          <p className="text-gray-600 mb-8">
            This is a simulated test environment. In the actual application, this window will contain the mock paper questions, drawing upload segment, and a timer.
          </p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm text-left mb-8">
            <strong>Security Features Active:</strong>
            <ul className="list-disc pl-5 mt-2">
              <li>Tab switching is monitored.</li>
              <li>Window minimization is monitored.</li>
              <li>Focus loss is monitored.</li>
            </ul>
          </div>
          
          {!isLocked && (
            <button 
              onClick={() => {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
                setIsLocked(true);
              }}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium"
            >
              Enter Fullscreen Mode
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
