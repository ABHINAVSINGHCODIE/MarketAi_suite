
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Megaphone, 
  Mic2, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Campaigns', count: 12, color: '#10b981' },
  { name: 'Pitches', count: 45, color: '#14b8a6' },
  { name: 'Lead Scores', count: 128, color: '#0f766e' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-slate-300 mt-2 text-lg">Here's how your marketing and sales AI assistants are performing.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/campaign" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all duration-300 text-sm font-semibold shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:-translate-y-0.5">
            <Zap size={18} />
            Quick Action
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-900/40">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Efficiency Boost</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">+42%</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">vs. last month manual process</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-900/40">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Qualified Leads</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">1,245</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Total processed this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-900/40">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">AI Tokens Used</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">1.2M</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">85% of monthly quota</p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap size={22} className="text-emerald-400" />
            Core AI Toolset
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/campaign" className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Campaign Generator</h4>
                    <p className="text-sm text-slate-600 mt-1">Create multi-platform marketing strategies instantly.</p>
                  </div>
                </div>
                <ChevronRight size={22} className="text-slate-400 group-hover:text-emerald-500 translate-x-0 group-hover:translate-x-2 transition-all" />
              </div>
            </Link>

            <Link to="/pitch" className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Mic2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Sales Pitch Creator</h4>
                    <p className="text-sm text-slate-600 mt-1">Personalized pitches for specific client personas.</p>
                  </div>
                </div>
                {/* Fixed: ChevronRight was not imported */}
                <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 translate-x-0 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link to="/lead-scorer" className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Lead Qualifier</h4>
                    <p className="text-sm text-slate-600 mt-1">Data-driven scoring and conversion analysis.</p>
                  </div>
                </div>
                <ChevronRight size={22} className="text-slate-400 group-hover:text-emerald-500 translate-x-0 group-hover:translate-x-2 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-slate-900">Activity Analytics</h3>
            <span className="text-xs font-medium text-slate-400">Last 30 Days</span>
          </div>
          <div className="flex-1" style={{height: '300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
