import { NavLink } from 'react-router-dom';
import { LayoutGrid, PenTool, FileText, PieChart, Users, Building2, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
  { name: 'Practice', icon: PenTool, path: '/practice' },
  { name: 'Tests', icon: FileText, path: '/tests' },
  { name: 'Analytics', icon: PieChart, path: '/analytics' },
  { name: 'Community', icon: Users, path: '/community' },
  { name: 'College', icon: Building2, path: '/college' },
  { name: 'shop', icon: ShoppingBag, path: '/shop' },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#f8f9fa] h-screen flex flex-col border-r border-gray-200 fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        {/* Logo Asset: easyuceed-logo.png */}
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
          EU
        </div>
        <span className="text-xl font-bold text-teal-600">EasyUceed</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive || (item.name === 'Tests' && window.location.pathname.startsWith('/tests'))
                  ? "bg-[#e8f5e9] text-teal-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
