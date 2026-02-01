'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { decisionsService, Decision } from '@/services/decisions.service';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function Dashboard() {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ pending: 0, reviewed: 0, total: 0 });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      setLoading(true);
      const response = await decisionsService.getAll();
      const decisionsList = Array.isArray(response) ? response : response.data || [];
      
      setDecisions(decisionsList as Decision[]);
      
      const pending = decisionsList.filter((d: Decision) => d.status === 'PENDING').length;
      const reviewed = decisionsList.filter((d: Decision) => d.status === 'REVIEWED').length;
      
      console.log('Decisions fetched:', decisionsList);
      console.log('Stats - Pending:', pending, 'Reviewed:', reviewed, 'Total:', decisionsList.length);
      
      setStats({
        pending,
        reviewed,
        total: decisionsList.length,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load decisions';
      setError(errorMsg);
      console.error('Fetch decisions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      authService.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleDeleteDecision = async (id: string) => {
    try {
      setDeleteLoading(id);
      await decisionsService.delete(id);
      setDecisions(decisions.filter(d => d.id !== id));
      setDeleteId(null);
      // Recalculate stats
      const remaining = decisions.filter(d => d.id !== id);
      const pending = remaining.filter((d: Decision) => d.status === 'PENDING').length;
      const reviewed = remaining.filter((d: Decision) => d.status === 'REVIEWED').length;
      setStats({
        pending,
        reviewed,
        total: remaining.length,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete decision';
      setError(errorMsg);
      console.error('Delete decision error:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const recentDecisions = decisions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Header Navigation */}
      <nav className="backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5 border-b border-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <span className="text-white font-bold text-lg">TM</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">TrailMemo</h1>
              <p className="text-xs text-gray-400">Decision Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/dashboard/new')}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12 fade-in-down">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent mb-3">Dashboard</h2>
          <p className="text-gray-400 text-lg">Welcome back! Here's your decision-making overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Decisions Card */}
          <div className="stagger-item group card-glass p-6 backdrop-blur-2xl bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-white/15 hover:border-white/30 cursor-default relative overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-15 blur transition duration-500 -z-10"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Total Decisions</p>
                <p className="text-5xl font-bold text-white mt-3">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="stagger-item group card-glass p-6 backdrop-blur-2xl bg-gradient-to-br from-yellow-600/10 to-orange-600/5 border border-white/15 hover:border-white/30 cursor-default relative overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-15 blur transition duration-500 -z-10"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Pending Review</p>
                <p className="text-5xl font-bold text-yellow-300 mt-3">{stats.pending}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Reviewed Card */}
          <div className="stagger-item group card-glass p-6 backdrop-blur-2xl bg-gradient-to-br from-green-600/10 to-emerald-600/5 border border-white/15 hover:border-white/30 cursor-default relative overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-15 blur transition duration-500 -z-10"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Reviewed</p>
                <p className="text-5xl font-bold text-green-300 mt-3">{stats.reviewed}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-14 fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-3xl font-bold text-white mb-7">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/dashboard/new')}
              className="stagger-item group relative backdrop-blur-xl bg-gradient-to-br from-purple-600/15 to-indigo-600/5 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/60 transition-all duration-300 text-left overflow-hidden hover:shadow-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-300 -z-10"></div>
              <div className="w-11 h-11 bg-purple-600/80 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm">Create Decision</p>
              <p className="text-gray-400 text-xs mt-1.5">Start a new decision</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/pending')}
              className="stagger-item group relative backdrop-blur-xl bg-gradient-to-br from-yellow-600/15 to-orange-600/5 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/60 transition-all duration-300 text-left overflow-hidden hover:shadow-lg"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-300 -z-10"></div>
              <div className="w-11 h-11 bg-yellow-600/80 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm">View Pending</p>
              <p className="text-gray-400 text-xs mt-1.5">Review pending items</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/completed')}
              className="stagger-item group relative backdrop-blur-xl bg-gradient-to-br from-green-600/15 to-emerald-600/5 border border-green-500/30 rounded-xl p-6 hover:border-green-400/60 transition-all duration-300 text-left overflow-hidden hover:shadow-lg"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-300 -z-10"></div>
              <div className="w-11 h-11 bg-green-600/80 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm">Completed</p>
              <p className="text-gray-400 text-xs mt-1.5">View completed decisions</p>
            </button>

            <button
              onClick={fetchDecisions}
              className="stagger-item group relative backdrop-blur-xl bg-gradient-to-br from-blue-600/15 to-cyan-600/5 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/60 transition-all duration-300 text-left overflow-hidden hover:shadow-lg"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-300 -z-10"></div>
              <div className="w-11 h-11 bg-blue-600/80 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm">Refresh</p>
              <p className="text-gray-400 text-xs mt-1.5">Update data</p>
            </button>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-3xl font-bold text-white mb-8">Recent Decisions</h3>
          
          {loading ? (
            <div className="card-glass backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 p-16 text-center">
              <div className="inline-block">
                <div className="w-14 h-14 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin shadow-xl"></div>
              </div>
              <p className="text-gray-400 mt-6 font-medium">Loading your decisions...</p>
            </div>
          ) : error ? (
            <div className="card-glass bg-red-500/10 border border-red-500/40 p-8 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-300 font-medium">{error}</p>
                  <button
                    onClick={fetchDecisions}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : recentDecisions.length === 0 ? (
            <div className="card-glass backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 p-16 text-center border border-white/15">
              <svg className="w-20 h-20 text-gray-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-200 text-xl font-bold mb-2">No decisions yet</p>
              <p className="text-gray-400 text-sm mb-8">Create your first decision to get started</p>
              <button
                onClick={() => router.push('/dashboard/new')}
                className="btn-primary inline-block"
              >
                Create Decision
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDecisions.map((decision, index) => (
                <div
                  key={decision.id}
                  className="stagger-item group card-glass backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 p-6 border border-white/15 hover:border-white/30 hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1 cursor-pointer group/content"
                      onClick={() => router.push(`/dashboard/${decision.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-white group-hover/content:text-purple-300 transition">
                          {decision.title}
                        </h4>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            decision.status === 'PENDING'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}
                        >
                          {decision.status === 'PENDING' ? '⏳ Pending' : '✓ Reviewed'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{decision.context}</p>
                      
                      {/* Tags Display */}
                      {decision.tags && decision.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {decision.tags.map((decisionTag) => (
                            <span
                              key={decisionTag.tagId}
                              className="px-2.5 py-1 text-xs font-semibold bg-purple-500/30 text-purple-200 border border-purple-500/40 rounded-full hover:bg-purple-500/40 transition-all duration-200"
                            >
                              #{decisionTag.tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-gray-500 text-xs mt-4 font-medium">
                        Created {new Date(decision.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => router.push(`/dashboard/${decision.id}`)}
                        className="p-2.5 text-gray-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-all duration-200"
                        title="View details"
                      >
                        <svg className="w-5 h-5 transform group-hover/content:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(decision.id);
                        }}
                        className="p-2.5 text-gray-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                        title="Delete decision"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {decisions.length > 5 && (
                <button
                  onClick={() => router.push('/dashboard/all')}
                  className="w-full mt-8 px-6 py-4 card-glass backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 hover:border-white/30 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  View All Decisions ({decisions.length})
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-backdrop">
          <div className="modal-content fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-6 bg-red-500/20 border border-red-500/40 rounded-full">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m0-16H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-3m0 0H9m0 0H7m0 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Delete Decision?</h2>
              <p className="text-gray-400 mb-8 text-center text-sm leading-relaxed">
                Are you sure you want to delete <span className="text-white font-semibold">"{decisions.find(d => d.id === deleteId)?.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={deleteLoading === deleteId}
                  className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 disabled:bg-gray-700/30 text-white font-semibold rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteDecision(deleteId)}
                  disabled={deleteLoading === deleteId}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-800 disabled:to-red-900 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {deleteLoading === deleteId ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}