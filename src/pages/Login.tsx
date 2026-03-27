import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password })
      });
      
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        throw new Error("Server error. Invalid response.");
      }

      if (response.ok) {
        login(data, "dummy-token-123"); 
        navigate('/tests'); // Instantly redirect to dashboard
      } else {
        setErrorMsg(data.message || "Invalid login credentials.");
      }
    } catch (err: any) {
      setErrorMsg("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-12 px-6 overflow-hidden">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 mb-20">
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-xs">EU</div>
        <span className="text-2xl font-bold text-teal-600">EasyUceed</span>
      </div>

      <div className="w-full max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome Back</h1>
        <p className="text-gray-400 mb-12">Log in to continue your preparation</p>
        
        {errorMsg && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm font-medium">
                {errorMsg}
            </div>
        )}

        <div className="space-y-6 text-left">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Mobile Number</label>
            <div className="flex mt-1 border-2 border-gray-100 rounded-2xl p-4 focus-within:border-teal-500 transition-colors">
              <span className="text-gray-400 mr-2 font-medium">+91</span>
              <input 
                type="tel" 
                className="flex-1 outline-none font-medium text-gray-700" 
                placeholder="99494444646" 
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Password</label>
            <div className="relative flex mt-1 border-2 border-gray-100 rounded-2xl p-4 focus-within:border-teal-500 transition-colors">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full outline-none font-medium text-gray-700" 
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <button 
          disabled={!mobile || !password || isLoading}
          onClick={handleLogin} 
          className="w-full mt-12 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
        >
          {isLoading ? "Logging in..." : "Log in"} <ChevronRight className="w-5 h-5" />
        </button>

        <p className="mt-8 text-sm text-gray-500">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/onboarding')} 
            className="text-teal-600 font-bold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}