import { Search, Bell, Mail, User } from 'lucide-react';

export default function Topbar() {
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
        <button className="hover:text-gray-900 transition-colors">
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
