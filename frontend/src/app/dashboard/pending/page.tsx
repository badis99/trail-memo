'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { decisionsService, Decision } from '@/services/decisions.service';

export default function PendingDecisions() {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingDecisions();
  }, []);

  const fetchPendingDecisions = async () => {
    try {
      setLoading(true);
      const allDecisions = await decisionsService.getAll();
      const pendingDecisions = allDecisions.filter(decision => decision.status === 'PENDING');
      setDecisions(pendingDecisions);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load pending decisions';
      setError(errorMsg);
      console.error('Fetch pending decisions error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Header Navigation */}
      <nav className="backdrop-blur-xl bg-black/40 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TM</span>
            </div>
            <h1 className="text-2xl font-bold text-white">TrailMemo</h1>
          </div>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-300 hover:text-white transition duration-200"
          >
            ← Back
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Page Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Pending Decisions</h2>
          <p className="text-gray-300">Decisions awaiting review ({decisions.length})</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="inline-block">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-300 mt-4">Loading pending decisions...</p>
          </div>
        ) : error ? (
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <p className="text-red-300 text-center">{error}</p>
            <button
              onClick={fetchPendingDecisions}
              className="mt-4 mx-auto block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        ) : decisions.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-300 text-lg mb-2">No pending decisions</p>
            <p className="text-gray-400 text-sm">All decisions have been reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {decisions.map((decision) => (
              <div
                key={decision.id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition duration-300 cursor-pointer group"
                onClick={() => router.push(`/dashboard/${decision.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition">
                        {decision.title}
                      </h4>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                        ⏳ Pending
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{decision.context}</p>

                    {/* Tags Display */}
                    {decision.tags && decision.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {decision.tags.map((decisionTag) => (
                          <span
                            key={decisionTag.tagId}
                            className="px-2.5 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full"
                          >
                            #{decisionTag.tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-500 text-xs mt-3">
                      Created {new Date(decision.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
