import React from 'react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';
import { Home, Search, Tag, Gift, Wallet } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentPage, navigate } = useApp();

  const navItems: { page: PageRoute; label: string; icon: React.ReactNode }[] = [
    { page: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { page: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
    { page: 'offers', label: 'Offers', icon: <Tag className="w-5 h-5" /> },
    { page: 'benefits', label: 'Benefits', icon: <Gift className="w-5 h-5" /> },
    { page: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-4 flex justify-around items-center md:hidden shadow-lg">
      {navItems.map((item) => {
        const isActive = currentPage === item.page;
        return (
          <button
            key={item.page}
            onClick={() => navigate(item.page)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
              isActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
