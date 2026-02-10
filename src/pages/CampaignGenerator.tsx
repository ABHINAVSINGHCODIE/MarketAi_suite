
import React, { useState } from 'react';
import { Megaphone, Loader2, Sparkles, Copy, Download, Check, Target, ChevronRight, Layout, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateCampaign } from '../services/geminiService';
import type { CampaignResult } from '../types.ts';

const CampaignGenerator: React.FC = () => {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('LinkedIn');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !audience) return;

    setIsLoading(true);
    try {
      const data = await generateCampaign(product, audience, platform);
      setResult(data);
    } catch (error: any) {
      console.error('Failed to generate campaign', error);
      const errorMsg = error?.message?.includes('high demand') || error?.status === 'UNAVAILABLE'
        ? 'The AI service is experiencing high demand. We tried multiple times but couldn\'t connect. Please wait a moment and try again.'
        : 'Generation failed. Please check your API key and try again.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getCampaignText = (data: CampaignResult) => {
    const contentIdeas = data.contentIdeas.map((idea) => `- ${idea}`).join('\n');
    const ctas = data.ctas.map((cta) => `- ${cta}`).join('\n');
    const adCopies = data.adCopies
      .map((ad, idx) => `${idx + 1}. ${ad.variation}: ${ad.text}`)
      .join('\n');

    return `Strategic Objectives:\n${data.objectives}\n\nContent Hooks:\n${contentIdeas}\n\nSuggested CTAs:\n${ctas}\n\nAd Copy Variants:\n${adCopies}`;
  };

  const getChannelMix = () => {
    const channels = ['LinkedIn', 'Twitter/X', 'Instagram', 'TikTok', 'Email'];
    const secondaryShare = Math.round(45 / (channels.length - 1));
    return channels.map((name) => ({
      name,
      value: name === platform ? 55 : secondaryShare,
    }));
  };

  const handleCopyAll = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(getCampaignText(result));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleShareAll = async () => {
    if (!result) return;
    const text = getCampaignText(result);
    if (navigator.share) {
      await navigator.share({
        title: 'Campaign Output',
        text,
      });
      return;
    }
    await navigator.clipboard.writeText(text);
    alert('Share is not supported. The output was copied to your clipboard.');
  };

  const handleDownloadAll = () => {
    if (!result) return;
    const text = getCampaignText(result);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campaign-output.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">Campaign Strategist</h2>
          <p className="text-slate-300 mt-2 text-lg">Generate multi-channel marketing campaigns with structured AI logic.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Parameters (Gradio Style) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layout size={14} /> Campaign Parameters
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Product or Service</label>
                <input
                  type="text"
                  placeholder="What are you promoting?"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Target Audience</label>
                <textarea
                  placeholder="Describe your ideal customer persona..."
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all h-28 resize-none text-slate-900 placeholder:text-slate-400"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Primary Channel</label>
                <select
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all appearance-none cursor-pointer text-slate-900"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="LinkedIn">LinkedIn (Professional)</option>
                  <option value="Twitter/X">Twitter/X (Viral/Real-time)</option>
                  <option value="Instagram">Instagram (Visual)</option>
                  <option value="TikTok">TikTok (Short-form Video)</option>
                  <option value="Email">Email (Nurturing)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    Generate Campaign
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
              <Megaphone size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Output Preview</p>
              <p className="text-sm">Campaign details will appear here after generation</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-10 text-center animate-pulse">
              <Loader2 size={48} className="mb-4 text-emerald-500 animate-spin" />
              <p className="text-lg font-bold text-slate-900">Brainstorming Content...</p>
              <p className="text-sm text-slate-500">Aligning objectives with audience needs</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Campaign Snapshot</h4>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{platform}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                      <p className="text-xs text-emerald-700 font-bold">Hooks</p>
                      <p className="text-xl font-black text-emerald-700">{result.contentIdeas.length}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-xs text-slate-600 font-bold">CTAs</p>
                      <p className="text-xl font-black text-slate-800">{result.ctas.length}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 text-center">
                      <p className="text-xs text-teal-700 font-bold">Ads</p>
                      <p className="text-xl font-black text-teal-700">{result.adCopies.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Objective</p>
                      <p className="text-sm text-slate-700 line-clamp-2">{result.objectives}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Strategy</span>
                    <span>Hooks</span>
                    <span>Ads</span>
                    <span>CTAs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-emerald-200" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="h-2 flex-1 rounded-full bg-teal-200" />
                    <div className="w-3 h-3 rounded-full bg-teal-500" />
                    <div className="h-2 flex-1 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Channel Mix</h4>
                    <span className="text-[10px] font-bold text-slate-500">Emphasis</span>
                  </div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChannelMix()} barSize={24}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#14b8a6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} /> Strategic Objectives
                  </h4>
                  <button className="text-slate-400 hover:text-emerald-500 transition-colors">
                    <Download size={16} />
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {result.objectives}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Content Hooks</h4>
                  <ul className="space-y-3">
                    {result.contentIdeas.map((idea, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <p className="text-sm text-emerald-900 leading-snug">{idea}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested CTA</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.ctas.map((cta, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                        {cta}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                  <Sparkles size={14} className="text-emerald-400" /> Ad Copy Variants
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.adCopies.map((ad, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all group relative">
                      <button 
                        onClick={() => copyToClipboard(ad.text, idx)}
                        className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-300 group-hover:text-emerald-500 rounded-lg"
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{ad.variation}</span>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed italic">"{ad.text}"</p>
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

export default CampaignGenerator;
