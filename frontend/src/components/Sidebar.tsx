import React from 'react';
import {FilePlus, Users, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: 'registration' | 'dashboard';
  setActiveTab: (tab: 'registration' | 'dashboard') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'registration', label: 'New Policy', icon: FilePlus },
    { id: 'dashboard', label: 'Customer List', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-slate-300 flex flex-col p-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-tight">InsureFlow</span>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
