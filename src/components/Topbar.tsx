import { Search, Bell, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  // We add || {} as an absolute last resort safety net
  const { user, logout } = useAuth() || {}; 
  const navigate = useNavigate();

  return (
    <div className="h-20 px-8 flex items-center justify-between bg-white sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for topics, tests, or lessons..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
        />
      </div>
      
      <div className="flex items-center gap-6 text-gray-500">
        <button className="hover:text-gray-900 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <button className="hover:text-gray-900 transition-colors">
          <Mail className="w-6 h-6" />
        </button>
        
        {/* User Profile Area */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Welcome back</p>
                <p className="text-sm font-bold text-gray-900 leading-none">{user.nickname || "Student"}</p>
              </div>
              <button 
                onClick={() => { 
                  if(window.confirm("Are you sure you want to log out?")) {
                    if (logout) logout();
                    navigate('/onboarding');
                  }
                }}
                className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 hover:bg-teal-100 transition-colors"
                title="Log out"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors border-l pl-6 border-gray-100"
            >
              <User className="w-5 h-5" />
              Login / Sign up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}