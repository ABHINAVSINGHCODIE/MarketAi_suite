
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin(email.split('@')[0] || 'Marketing Lead');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 -left-10 w-72 h-72 bg-emerald-600/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-10 w-96 h-96 bg-teal-600/20 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-900/30 mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">MarketAI Suite</h1>
          <p className="text-slate-400 mt-2 text-center">Intelligence that fuels your pipeline.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                required 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Sign In to Platform
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account? <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">Contact Sales</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
