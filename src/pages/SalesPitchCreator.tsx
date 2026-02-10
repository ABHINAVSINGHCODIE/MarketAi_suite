
import React, { useState } from 'react';
import { Mic2, Loader2, Sparkles, Copy, User, Building2, Briefcase, Check, ChevronRight, Share2, Download } from 'lucide-react';
import { generatePitch } from '../services/geminiService';
import type { PitchResult } from '../types.ts';

const SalesPitchCreator: React.FC = () => {
  const [product, setProduct] = useState('');
  const [persona, setPersona] = useState('');
  const [industry, setIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PitchResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !persona || !industry) return;

    setIsLoading(true);
    try {
      const data = await generatePitch(product, persona, industry);
      setResult(data);
    } catch (error: any) {
      console.error('Failed to generate pitch', error);
      const errorMsg = error?.message?.includes('high demand') || error?.status === 'UNAVAILABLE'
        ? 'The AI service is experiencing high demand. We tried multiple times but couldn\'t connect. Please wait a moment and try again.'
        : 'Generation failed. Please check your API key and try again.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const copySection = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getPitchText = (data: PitchResult) => {
    const differentiators = data.differentiators.map((diff) => `- ${diff}`).join('\n');
    return `30-Second Script:\n${data.elevatorPitch}\n\nCore Value Proposition:\n${data.valueProposition}\n\nCompetitive Edge:\n${differentiators}\n\nClosing Statement:\n${data.callToAction}`;
  };

  const handleCopyAll = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(getPitchText(result));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleShareAll = async () => {
    if (!result) return;
    const text = getPitchText(result);
    if (navigator.share) {
      await navigator.share({
        title: 'Sales Pitch Output',
        text,
      });
      return;
    }
    await navigator.clipboard.writeText(text);
    alert('Share is not supported. The output was copied to your clipboard.');
  };

  const handleDownloadAll = () => {
    if (!result) return;
    const text = getPitchText(result);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sales-pitch-output.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">Pitch Architect</h2>
          <p className="text-slate-300 mt-2 text-lg">Design high-conversion sales pitches tailored to specific buyer personas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Parameters (Gradio Style) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mic2 size={14} /> Pitch Constraints
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Solution Name</label>
                <input
                  type="text"
                  placeholder="e.g., Enterprise Data Security Suite"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Target Industry</label>
                <input
                  type="text"
                  placeholder="e.g., Fintech, Logistics"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Buyer Persona</label>
                <textarea
                  placeholder="Who are you talking to? What keeps them up at night?"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all h-32 resize-none text-slate-900 placeholder:text-slate-400"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  required
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
                    Architecting...
                  </>
                ) : (
                  <>
                    Build Sales Pitch
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Outputs (Gradio Style) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-400">
              <Mic2 size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Composition Area</p>
              <p className="text-sm">Generated scripts will appear in this block</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-10 text-center animate-pulse">
              <Loader2 size={48} className="mb-4 text-emerald-500 animate-spin" />
              <p className="text-lg font-bold text-slate-900">Fine-tuning Voice...</p>
              <p className="text-sm text-slate-500">Injecting persuasive triggers and social proof</p>
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
              {/* Elevator Pitch Block */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group">
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                  <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">30-Second Script</h4>
                  <button 
                    onClick={() => copySection(result.elevatorPitch, 'elevator')}
                    className="text-slate-300 hover:text-emerald-500 transition-colors"
                  >
                    {copiedSection === 'elevator' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="p-8">
                  <p className="text-xl font-medium text-slate-800 leading-relaxed italic">
                    "{result.elevatorPitch}"
                  </p>
                </div>
              </div>

              {/* Value & Diff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-4">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Core Value Prop</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{result.valueProposition}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Competitive Edge</h4>
                  <div className="space-y-2">
                    {result.differentiators.map((diff, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <Sparkles size={12} className="text-amber-500" />
                        <p className="text-xs text-slate-600 font-semibold">{diff}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Block */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Closing Statement</h4>
                  <p className="text-lg font-bold">{result.callToAction}</p>
                </div>
                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  Save to Outreach.io
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPitchCreator;
