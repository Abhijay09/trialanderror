import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
    nickname: '',
    appearingYear: '',
    status: '',
    stream: ''
  });

  const nextStep = () => setStep(s => s + 1);

  const handleFinish = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setStep(6);
    
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        throw new Error("Server did not send valid JSON.");
      }

      if (response.ok) {
        login(data, "dummy-token-123"); 
        setTimeout(() => navigate('/tests'), 2000);
      } else {
        alert("Error from Server: " + data.message);
        setStep(1); 
      }
    } catch (err: any) {
      alert("Frontend Error: " + err.message);
      setStep(1);
    }
  };

  const OptionBtn = ({ label, field, value, autoAdvance = true }: { label: string, field: string, value: string, autoAdvance?: boolean }) => (
    <button
      onClick={() => {
        setFormData({ ...formData, [field]: value });
        if (autoAdvance) {
          nextStep();
        }
      }}
      className={cn(
        "w-full max-w-sm p-4 mb-3 flex items-center justify-between border-2 rounded-2xl transition-all group",
        formData[field as keyof typeof formData] === value 
          ? "border-teal-500 bg-teal-50/50" 
          : "border-gray-100 bg-white hover:border-gray-200"
      )}
    >
      <span className={cn(
        "font-medium transition-colors",
        formData[field as keyof typeof formData] === value ? "text-teal-700" : "text-gray-700"
      )}>
        {label}
      </span>
      <div className={cn(
        "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
        formData[field as keyof typeof formData] === value 
          ? "border-teal-500 bg-teal-500" 
          : "border-gray-300 group-hover:border-gray-400"
      )}>
        {formData[field as keyof typeof formData] === value && (
            <div className="w-2 h-2 bg-white rounded-full" />
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-12 px-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-20">
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-xs">EU</div>
        <span className="text-2xl font-bold text-teal-600">EasyUceed</span>
      </div>

      {step === 1 && (
        <div className="w-full max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Mobile number</h1>
          <p className="text-gray-400 mb-12">Don't worry we won't spam you're call logs</p>
          <div className="space-y-6 text-left">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Student</label>
              <div className="flex mt-1 border-2 border-gray-100 rounded-2xl p-4 focus-within:border-teal-500 transition-colors">
                <span className="text-gray-400 mr-2 font-medium">+91</span>
                <input 
                  type="tel" 
                  className="flex-1 outline-none font-medium text-gray-700" 
                  placeholder="99494444646" 
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Set password</label>
              <div className="relative flex mt-1 border-2 border-gray-100 rounded-2xl p-4 focus-within:border-teal-500 transition-colors">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full outline-none font-medium text-gray-700" 
                  placeholder="********"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
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
            disabled={!formData.mobile || formData.password.length < 6}
            onClick={nextStep} 
            className="w-full mt-12 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
          >
            Continue <ChevronRight className="w-5 h-5" />
          </button>

          {/* NEW: Link to Login Page */}
          <p className="mt-8 text-sm text-gray-500">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-teal-600 font-bold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md text-center animate-in fade-in slide-in-from-right-4 duration-500">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">Choose a unique nickname</h1>
          <p className="text-gray-400 mb-1">keep it anonymous for privacy</p>
          <p className="text-gray-400 mb-12">What should we call you??</p>
          <input 
            type="text" 
            autoFocus
            className="w-full border-2 border-gray-100 rounded-2xl p-5 outline-none text-center text-2xl font-bold text-gray-700 focus:border-teal-500 transition-colors" 
            placeholder="Charan teja"
            value={formData.nickname}
            onChange={e => setFormData({...formData, nickname: e.target.value})}
          />
          <button 
            disabled={!formData.nickname}
            onClick={nextStep} 
            className="w-full mt-12 bg-teal-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
          >
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="w-full max-w-md text-center flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
          <h1 className="text-4xl font-bold mb-12 text-gray-900">Your are appearing in?</h1>
          <OptionBtn label="2027" field="appearingYear" value="2027" />
          <OptionBtn label="2028" field="appearingYear" value="2028" />
        </div>
      )}

      {step === 4 && (
        <div className="w-full max-w-md text-center flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
          <h1 className="text-4xl font-bold mb-12 text-gray-900">You are a ...?</h1>
          <OptionBtn label="School student" field="status" value="School student" />
          <OptionBtn label="Partial Dropper" field="status" value="Partial Dropper" />
          <OptionBtn label="Dropper" field="status" value="Dropper" />
        </div>
      )}

      {step === 5 && (
        <div className="w-full max-w-2xl text-center animate-in fade-in zoom-in-95 duration-500">
          <h1 className="text-5xl font-bold mb-12 text-gray-900 leading-tight">Which stream are you ?</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 place-items-center">
            <OptionBtn label="PCM" field="stream" value="PCM" autoAdvance={false} />
            <OptionBtn label="Commerce (Math)" field="stream" value="Commerce (Math)" autoAdvance={false} />
            <OptionBtn label="PCB" field="stream" value="PCB" autoAdvance={false} />
            <OptionBtn label="Commerce (non-math)" field="stream" value="Commerce (non-math)" autoAdvance={false} />
            <OptionBtn label="PCMB" field="stream" value="PCMB" autoAdvance={false} />
            <OptionBtn label="Arts" field="stream" value="Arts" autoAdvance={false} />
          </div>
          <button 
            disabled={!formData.stream}
            onClick={handleFinish} 
            className="w-full max-w-sm mt-12 bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mx-auto shadow-lg shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            Finish set-up <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 6 && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full animate-[spin_8s_linear_infinite]"></div>
            <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/40 relative z-10 scale-in duration-500">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center max-w-xs leading-tight text-gray-900 mb-6">
            Please wait while we set up your account.
          </h1>
          <button 
            onClick={() => { setStep(1); }}
            className="text-sm text-gray-400 hover:text-red-500 underline transition-colors"
          >
            Cancel and try again
          </button>
        </div>
      )}
    </div>
  );
}