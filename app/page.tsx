// src/app/page.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Assessment } from '@/src/types';
import AssessmentPortal from '@/src/components/AssessmentPortal';

export default function Home() {
  const [prompt, setPrompt] = useState('Generate a Grade-10 Mathematics assessment consisting of 10mcqs of topic Probability');
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ai-asmt-platform-api.tapas-dev.workers.dev/api/assessments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate assessment');

      const data: Assessment = await response.json();
      setAssessment(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Is your FastAPI backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (assessment) {
    return <AssessmentPortal assessment={assessment} onReset={() => setAssessment(null)} />;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 max-w-4xl mx-auto relative z-10">
      {/* Subtle deep background luminescence */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/[0.02] border border-white/[0.06] text-indigo-300/80 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Quantum Engine Active
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          Architect an Assessment
        </h1>
      </div>

      {/* Futuristic Clean Input Box */}
      <form onSubmit={handleGenerate} className="w-full max-w-xl bg-slate-950/40 backdrop-blur-xl border border-white/[0.06] p-2 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] focus-within:border-indigo-500/30 transition-all duration-300">
        <div className="p-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            rows={2}
            className="w-full bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none text-sm md:text-base leading-relaxed"
            placeholder="Type configuration command instructions..."
          />
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 px-2 pb-1">
          <div className="text-[10px] font-mono text-slate-600 px-2">
            Press Enter ↵ to launch
          </div>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-white text-black hover:bg-slate-200 active:scale-[0.98] transition-all font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 disabled:opacity-20 disabled:pointer-events-none shadow-lg shadow-white/5 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                Generate
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}
    </main>
  );
}