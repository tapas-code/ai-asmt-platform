// src/components/AssessmentPortal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Timer, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, BarChart4, ChevronLeft } from 'lucide-react';
import { Assessment } from '@/src/types';

interface AssessmentPortalProps {
  assessment: Assessment;
  onReset: () => void;
}

export default function AssessmentPortal({ assessment, onReset }: AssessmentPortalProps) {
  const { questions, topic, grade } = assessment;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };

  const score = questions.reduce((acc, q, idx) => selectedAnswers[idx] === q.correct_answer ? acc + 1 : acc, 0);
  const attemptedCount = Object.keys(selectedAnswers).length;

  if (isSubmitted) {
  return (
    <div className="w-full max-h-screen max-w-2xl mx-auto py-12 px-4 relative z-10 animate-fade-in">
      <div className="bg-slate-950/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] space-y-8 border border-white/[0.06]">
        
        {/* Header Branding */}
        <div className="text-center space-y-1.5 border-b border-white/[0.04] pb-5">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Simulation Concluded</span>
          <h2 className="text-xl font-black text-white">Evaluation Matrix Complete</h2>
          <p className="text-slate-500 font-medium text-xs tracking-wide">{topic} • {grade}</p>
        </div>

        {/* Crisp Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 text-center">
            <span className="block text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">Final Score</span>
            <span className="text-xl font-black text-indigo-400">{score}<span className="text-xs font-normal text-slate-600">/10</span></span>
          </div>
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 text-center">
            <span className="block text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">Accuracy</span>
            <span className="text-xl font-black text-emerald-400">{attemptedCount > 0 ? Math.round((score / questions.length) * 100) : 0}%</span>
          </div>
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 text-center">
            <span className="block text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">Completed</span>
            <span className="text-xl font-black text-purple-400">{attemptedCount}<span className="text-xs font-normal text-slate-600">/10</span></span>
          </div>
        </div>

        {/* Audit Log (Questions) Section */}
        <div className="space-y-4 ">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
            <BarChart4 className="w-3 h-3 text-cyan-400" /> System Audit Logs
          </h3>
          
          <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white/[0.01] [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correct_answer;
              return (
                <div 
                  key={q.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    isCorrect 
                      ? 'bg-emerald-500/[0.02] border-emerald-500/10' 
                      : userAns 
                        ? 'bg-rose-500/[0.02] border-rose-500/10' 
                        : 'bg-white/[0.01] border-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2.5">
                    <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/5 px-1.5 py-0.5 rounded">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="font-bold text-xs md:text-sm text-slate-200 leading-relaxed pt-0.5">
                      {q.question_text}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] font-medium border-t border-white/[0.03] pt-2 mt-1 px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">User Selection:</span>
                      {userAns ? (
                        <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {userAns}
                        </span>
                      ) : (
                        <span className="text-amber-500 italic font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Skipped
                        </span>
                      )}
                    </div>
                    
                    {!isCorrect && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Correct Target:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {q.correct_answer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Action Trigger */}
        <div className="pt-2 text-center border-t border-white/[0.04]">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 bg-white text-black hover:bg-slate-200 active:scale-[0.98] font-bold px-5 py-2.5 rounded-xl transition text-xs shadow-lg shadow-white/5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> New Simulation Node
          </button>
        </div>

      </div>
    </div>
  );
}

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 relative z-10 animate-fade-in">
      
      {/* Tiny Header Segment */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button 
          onClick={onReset}
          className="p-2 rounded-xl bg-white/[0.01] border border-white/[0.05] text-slate-500 hover:text-white transition cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <div className="text-center">
          <span className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase">{grade}</span>
          <h2 className="text-xs font-bold text-slate-400">{topic}</h2>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[11px] border ${timeLeft < 60 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse' : 'bg-white/[0.01] border-white/[0.05] text-slate-400'}`}>
          <Timer className="w-3 h-3" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Core Workspace Panel */}
      <div className="bg-slate-950/40 backdrop-blur-xl rounded-2xl p-5 md:p-6 shadow-2xl space-y-5 border border-white/[0.06]">
        
        {/* Flat Minimal Progress bar */}
        <div className="w-full h-[2px] bg-white/[0.04]">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Text */}
        <div className="py-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Node module {currentIndex + 1} of 10</span>
          <h3 className="text-sm md:text-base font-bold text-slate-200 leading-relaxed">
            {currentQuestion.question_text}
          </h3>
        </div>

        {/* Flat Custom Choice Cards */}
        <div className="grid grid-cols-1 gap-2">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswers[currentIndex] === option;
            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold transition-all border flex items-center justify-between group cursor-pointer ${
                  isSelected 
                    ? 'bg-white text-black border-white shadow-md' 
                    : 'bg-white/[0.01] border-white/[0.04] text-slate-400 hover:text-slate-200 hover:border-white/[0.08]'
                }`}
              >
                <span>{option}</span>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-black bg-black' : 'border-slate-800'
                }`}>
                  {isSelected && <div className="w-1 h-1 bg-white rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Minimal Actions Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 text-xs">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 rounded-lg border border-white/[0.05] text-slate-500 hover:text-white transition disabled:opacity-5 disabled:pointer-events-none cursor-pointer"
          >
            Back
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => setIsSubmitted(true)}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => currentIndex < questions.length - 1 && setCurrentIndex(currentIndex + 1)}
              className="px-3 py-1.5 bg-white text-black rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
            >
              Next <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}