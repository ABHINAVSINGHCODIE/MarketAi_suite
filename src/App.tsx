
import React, { useState } from "react";
import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Mic2, 
  Target, 
  Menu,
  X,
  Sparkles,
  MessageCircle,
  LogOut,
  User
} from 'lucide-react';
import Dashboard from "./pages/Dashboard";
import CampaignGenerator from "./pages/CampaignGenerator";
import SalesPitchCreator from "./pages/SalesPitchCreator";
import LeadScorer from "./pages/LeadScorer";
import KnowledgeBot from "./pages/KnowledgeBot";
import Login from "./pages/Login";


const SidebarLink = ({ to, icon: Icon, label, onClick }: { to: string, icon: any, label: string, onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/40' 
          : 'text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-300'
      }`
    }
  >
    <Icon size={20} className="group-hover:scale-110 transition-transform" />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('market_ai_user'));

  const handleLogin = (name: string) => {
    localStorage.setItem('market_ai_user', name);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('market_ai_user');
    setUserName(null);
  };

  if (!userName) {
    return <Login onLogin={handleLogin} />;
  }

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/30 to-black">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/70 shadow-2xl shadow-black/40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-slate-800/70">
              <Link to="/" className="flex items-center gap-3" onClick={() => setIsSidebarOpen(false)}>
                <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl shadow-lg shadow-emerald-900/40">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">MarketAI</h1>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all">
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
              <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/chatbot" icon={MessageCircle} label="AI Assistant (RAG)" onClick={() => setIsSidebarOpen(false)} />
              
              <div className="pt-4 pb-2 px-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  Campaign Tools
                </p>
              </div>
              <SidebarLink to="/campaign" icon={Megaphone} label="Campaign Generator" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/pitch" icon={Mic2} label="Sales Pitch Creator" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/lead-scorer" icon={Target} label="Lead Qualifier" onClick={() => setIsSidebarOpen(false)} />
            </nav>

            <div className="p-6 space-y-4 border-t border-slate-800/70">
              <div className="p-4 bg-gradient-to-br from-emerald-950/60 to-slate-900 rounded-xl border border-emerald-900/60 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-300 mb-1">
                  <Sparkles size={16} className="animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-wider">Active Model</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">Gemini 3.0 Flash</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all font-medium border border-slate-800/80 hover:border-emerald-800/80"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/70 h-16 flex items-center px-6 lg:px-10 justify-between shadow-sm">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-300 hover:bg-white/10 rounded-md"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center gap-4 ml-auto">
              <div className="hidden sm:flex flex-col text-right">
                <p className="text-sm font-bold text-slate-100 capitalize">{userName}</p>
                <p className="text-[10px] font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent uppercase tracking-widest">Enterprise User</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 border-2 border-black/40 shadow-md flex items-center justify-center text-white">
                <User size={20} />
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chatbot" element={<KnowledgeBot />} />
              <Route path="/campaign" element={<CampaignGenerator />} />
              <Route path="/pitch" element={<SalesPitchCreator />} />
              <Route path="/lead-scorer" element={<LeadScorer />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    
  );
};

export default App;
