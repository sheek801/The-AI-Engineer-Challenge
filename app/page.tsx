'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!jobDescription.trim() || !resume.trim()) {
      alert('Please fill in both Job Description and Resume fields');
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          resume,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(`API Error (${res.status}): ${errorData.detail || res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (error: any) {
      console.error('Error:', error);
      // Try to get more detailed error info
      const errorMessage = error.message || 'Failed to scan application. Please try again.';
      setResponse(`Error: ${errorMessage}\n\nPlease check:\n1. Your OPENAI_API_KEY is set in Vercel\n2. The API endpoint is accessible\n3. Browser console for more details`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header Section */}
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 mb-4">
            ATS Nexus: Precision Resume Optimizer
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between your experience and the recruiter's desk. Our AI analyzes your resume against specific job descriptions to help you bypass automated filters.
          </p>
          
          {/* 3-Step Instructions */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-8 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">1</span>
              <span className="text-slate-400">Paste Job Description</span>
            </div>
            <div className="hidden md:block text-slate-600">→</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">2</span>
              <span className="text-slate-400">Paste Resume</span>
            </div>
            <div className="hidden md:block text-slate-600">→</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">3</span>
              <span className="text-slate-400">Get Gap Analysis</span>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Job Description */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-emerald-400 mb-3">
              Target Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="flex-1 min-h-[350px] md:min-h-[400px] p-4 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all duration-200"
            />
          </div>

          {/* Resume */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-blue-400 mb-3">
              Your Resume Content
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here..."
              className="flex-1 min-h-[350px] md:min-h-[400px] p-4 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Scan Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleScan}
            disabled={loading}
            className="relative px-8 md:px-12 py-3 md:py-4 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(37, 99, 235, 0.2)',
            }}
          >
            <span className="relative z-10">
              {loading ? 'Analyzing...' : 'Analyze Match'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-blue-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Analysis Report */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl"
              style={{
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 40px rgba(16, 185, 129, 0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                  Gap Analysis Report
                </h2>
              </div>
              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed font-light text-base md:text-lg">
                {response}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

