import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', icon: '/sidebar/dashboard.svg', path: '/dashboard' },
  { name: 'Practice', icon: '/sidebar/practice.svg', path: '/practice' },
  { name: 'Tests', icon: '/sidebar/tests.svg', path: '/tests' },
  { name: 'Analytics', icon: '/sidebar/analytics.svg', path: '/analytics' },
  { name: 'Community', icon: '/sidebar/community.svg', path: '/community' },
  { name: 'College', icon: '/sidebar/college.svg', path: '/college' },
  { name: 'shop', icon: '/sidebar/shop.svg', path: '/shop' },
];

export default function Sidebar() {
  return (
    // Slightly darkened the sidebar background to match the screenshot
    <div className="w-64 bg-[#f0f2f4] h-screen flex flex-col border-r border-gray-200 fixed left-0 top-0 z-50">
      
      <div className="p-8 flex items-center gap-3 mb-2">
        {/* Logo */}
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-xs">
          EU
        </div>
        <span className="text-xl font-bold text-teal-600">EasyUceed</span>
      </div>
      
      {/* Removed horizontal padding so active state touches the edges */}
      <nav className="flex-1 flex flex-col w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => {
              const isCurrentlyActive = isActive || (item.name === 'Tests' && window.location.pathname.startsWith('/tests'));
              
              return cn(
                // Base styles: Large text, wide gap, generous vertical padding
                "flex items-center gap-5 px-8 py-4 text-xl font-medium transition-all w-full border-y",
                isCurrentlyActive
                  ? "bg-[#dbeed5] text-[#149982] border-[#149982]" // Active: Pale green bg, teal text & borders
                  : "text-black border-transparent hover:bg-gray-200/50" // Inactive: Solid black text, transparent borders to prevent jumping
              );
            }}
          >
            {({ isActive }) => {
              const isCurrentlyActive = isActive || (item.name === 'Tests' && window.location.pathname.startsWith('/tests'));
              
              return (
                <>
                  {/* 
                    THE MASK TRICK: 
                    Instead of an <img> tag, we use a <div>.
                    The SVG acts as a cutout (mask), and we set the background color of the div to fill it.
                  */}
                  <div 
                    className={cn(
                      "w-6 h-6 shrink-0 transition-colors",
                      isCurrentlyActive ? "bg-[#149982]" : "bg-black"
                    )}
                    style={{
                      WebkitMaskImage: `url(${item.icon})`,
                      maskImage: `url(${item.icon})`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center'
                    }}
                  />
                  {item.name}
                </>
              );
            }}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}