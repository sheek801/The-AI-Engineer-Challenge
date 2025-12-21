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
        throw new Error('Failed to scan application');
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: Failed to scan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
            ATS Nexus
          </h1>
          <p className="text-xl text-gray-300">AI Resume Matcher</p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Job Description */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-cyan-400 mb-3">
              Target Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="flex-1 min-h-[400px] p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
            />
          </div>

          {/* Resume */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-pink-400 mb-3">
              Your Resume Content
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here..."
              className="flex-1 min-h-[400px] p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
            />
          </div>
        </div>

        {/* Scan Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleScan}
            disabled={loading}
            className="relative px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)',
            }}
          >
            <span className="relative z-10">
              {loading ? 'Scanning...' : 'Scan for Match'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
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
              className="bg-gray-800/30 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 20px rgba(168, 85, 247, 0.3)',
              }}
            >
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
                Analysis Report
              </h2>
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

