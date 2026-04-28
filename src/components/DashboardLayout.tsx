import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ResponseList from './ResponseList';
import ChatSimulator from './ChatSimulator';
import DialogCustomization from './DialogCustomization';
import MeowDialogueManager from './MeowDialogueManager';
import PriceSettings from './PriceSettings';
import GlobalCatMascot from './GlobalCatMascot';
import { CatProvider, useCat } from '../store/catStore';
import { Menu, X } from 'lucide-react';
import { VirtualPetContainer } from '../../VirtualPet/VirtualPetContainer';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'responses' | 'simulator' | 'dialog' | 'meow' | 'pricing'>('responses');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPetOpen, setIsPetOpen] = useState(false);
  const { setOnCatClick } = useCat();

  // Set default cat click behavior to open the pet
  useEffect(() => {
    setOnCatClick(() => () => setIsPetOpen(true));
  }, [setOnCatClick]);

  return (
    <div className="flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans overflow-hidden h-screen w-full relative">
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm bg-primary">
            <div className="w-4 h-4 rounded-[4px] border-[2.5px] border-white"></div>
          </div>
          <span className="font-bold text-lg tracking-tight">NEURACORE</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 md:z-0`}>
        <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} />
      </div>
      
      <main className="flex-1 flex p-2 sm:p-4 md:p-5 flex-col h-full overflow-hidden w-full relative">
        <div className="flex flex-col overflow-y-auto overflow-x-hidden h-full w-full relative">
          {activeTab === 'responses' ? <ResponseList /> : 
           activeTab === 'simulator' ? <ChatSimulator /> : 
           activeTab === 'dialog' ? <DialogCustomization /> : 
           activeTab === 'pricing' ? <PriceSettings /> : 
           <MeowDialogueManager />}
        </div>
      </main>

      {/* Global cat mascot — rendered once, synced across all tabs */}
      <GlobalCatMascot />

      {/* Virtual Pet Ecosystem Overlay */}
      <VirtualPetContainer isOpen={isPetOpen} onClose={() => setIsPetOpen(false)} />
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <CatProvider>
      <DashboardContent />
    </CatProvider>
  );
}
