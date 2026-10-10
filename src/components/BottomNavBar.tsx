import React from 'react';
import { Home, Film, Heart, Cast, Settings } from 'lucide-react';

export type MainNavTab = 'home' | 'videos' | 'favorites' | 'cast' | 'settings';

interface BottomNavBarProps {
  activeTab: MainNavTab;
  onChangeTab: (tab: MainNavTab) => void;
  isCastingActive: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  isCastingActive
}) => {
  const navItems: { id: MainNavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: <Film className="w-5 h-5" />
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 'cast',
      label: 'Cast TV',
      icon: (
        <div className="relative">
          <Cast className={`w-5 h-5 ${isCastingActive ? 'animate-pulse text-indigo-400' : ''}`} />
          {isCastingActive && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">{item.icon}</div>
              <span className="text-[11px] font-medium tracking-tight mt-1">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
