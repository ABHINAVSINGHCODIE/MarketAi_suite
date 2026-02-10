
import React, { useState } from 'react';
import { Target, Loader2, Sparkles, TrendingUp, CheckCircle2, Info, ChevronRight, Copy, Share2, Download, Check } from 'lucide-react';
import { scoreLead } from '../services/geminiService';
import type { LeadResult } from '../types.ts';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const LeadScorer: React.FC = () => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [need, setNeed] = useState('');
  const [urgency, setUrgency] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LeadResult | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !budget || !need) return;

    setIsLoading(true);
    try {
      const data = await scoreLead(name, budget, need, urgency);
      setResult(data);
    } catch (error: any) {
      console.error('Failed to score lead', error);
      const errorMsg = error?.message?.includes('high demand') || error?.status === 'UNAVAILABLE'
        ? 'The AI service is experiencing high demand. We tried multiple times but couldn\'t connect. Please wait a moment and try again.'
        : 'Scoring failed. Please check your API key and try again.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#f97316';
  };

  const getLeadText = (data: LeadResult) => {
    const actions = data.recommendedActions.map((action, idx) => `${idx + 1}. ${action}`).join('\n');
    return `Lead Score: ${data.score}\n\nConversion Reasoning:\n${data.reasoning}\n\nProbability of Conversion: ${data.probabilityOfConversion}%\n\nRecommended Actions:\n${actions}`;
  };

  const handleCopyAll = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(getLeadText(result));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleShareAll = async () => {
    if (!result) return;
    const text = getLeadText(result);
    if (navigator.share) {
      await navigator.share({
        title: 'Lead Qualification Output',
        text,
      });
      return;
    }
    await navigator.clipboard.writeText(text);
    alert('Share is not supported. The output was copied to your clipboard.');
  };

  const handleDownloadAll = () => {
    if (!result) return;
    const text = getLeadText(result);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lead-qualification-output.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const chartData = result ? [
    { name: 'Score', value: result.score },
    { name: 'Remaining', value: 100 - result.score },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">Lead Qualifier</h2>
          <p className="text-slate-300 mt-2 text-lg">Predict conversion probability with algorithmic lead scoring.</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-200 shadow-sm">
          Powered by Gemini 3.0 Inference
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters (Gradio Style) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Target size={14} /> Input Parameters
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Prospect Identity</label>
                <input
                  type="text"
                  placeholder="Company or Lead Name"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Budget Details</label>
                <input
                  type="text"
                  placeholder="Approved budget or financial standing"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Problem Statement</label>
                <textarea
                  placeholder="What is their primary business pain?"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all h-28 resize-none text-slate-900 placeholder:text-slate-400"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Urgency (Optional)</label>
                <textarea
                  placeholder="Timeline or competitor context"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all h-24 resize-none text-slate-900 placeholder:text-slate-400"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Qualifying...
                  </>
                ) : (
                  <>
                    Run Qualification
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Output (Gradio Style) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-400">
              <Sparkles size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Ready for input</p>
              <p className="text-sm">Configure parameters on the left to start qualification</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-10 text-center animate-pulse">
              <Loader2 size={48} className="mb-4 text-emerald-500 animate-spin" />
              <p className="text-lg font-bold text-slate-900">Calculating Scores...</p>
              <p className="text-sm text-slate-500">Processing business intent & urgency markers</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Generated Output</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                  >
                    {copiedAll ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copiedAll ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={handleShareAll}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                  >
                    <Share2 size={14} />
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:text-emerald-500 hover:border-emerald-200 transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Lead Health</h4>
                   <div className="relative w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} startAngle={90} endAngle={450} paddingAngle={0} dataKey="value" stroke="none">
                          <Cell fill={getScoreColor(result.score)} />
                          <Cell fill="#f1f5f9" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-slate-900">{result.score}</span>
                    </div>
                  </div>
                  <div className="mt-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: getScoreColor(result.score) + '20', color: getScoreColor(result.score) }}>
                    {result.score >= 80 ? 'Tier 1 Priority' : result.score >= 60 ? 'Tier 2 Nurture' : 'Tier 3 Passive'}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} /> Conversion Logic
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-sm italic">
                    "{result.reasoning}"
                  </p>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Probability: {result.probabilityOfConversion}%</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${result.probabilityOfConversion}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-400" />
                  <h4 className="text-xl font-bold">Recommended Sequence</h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {result.recommendedActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-xs font-bold text-emerald-400 mt-0.5">0{idx+1}</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadScorer;
