import React from 'react';
import { ViewState } from '../types';
import { Building2, LayoutDashboard, UserPlus, Bell } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  toggleAssistant: () => void;
  showAssistant: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, toggleAssistant, showAssistant }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">SIMRS Rawat Jalan</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Modul Pendaftaran</p>
          </div>
        </div>
        
        <nav className="hidden md:flex bg-slate-100/80 p-1 rounded-lg">
          <button
            onClick={() => setView('registration')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentView === 'registration'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Pendaftaran Baru
          </button>
          <button
            onClick={() => setView('queue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentView === 'queue'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Monitor Antrian
          </button>
        </nav>

        <div className="flex items-center gap-2">
           <button 
             onClick={toggleAssistant}
             className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
               showAssistant 
                 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                 : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
             }`}
           >
              <div className="relative">
                 <div className="w-2 h-2 bg-green-500 rounded-full absolute -right-0.5 -top-0.5"></div>
                 <Bell className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">AI Assistant</span>
           </button>
           <div className="w-8 h-8 rounded-full bg-slate-200 border border-white shadow-sm overflow-hidden ml-2">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
