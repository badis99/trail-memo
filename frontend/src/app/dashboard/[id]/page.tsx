'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { decisionsService, Decision } from '@/services/decisions.service';
import { reviewsService } from '@/services/reviews.service';

export default function DecisionDetail() {
  const router = useRouter();
  const params = useParams();
  const decisionId = params.id as string;

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    actualOutcome: '',
    lessonsLearned: '',
    wouldDoDiff: '',
  });

  useEffect(() => {
    fetchDecision();
  }, [decisionId]);

  const fetchDecision = async () => {
    try {
      setLoading(true);
      const data = await decisionsService.getById(decisionId);
      setDecision(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load decision';
      setError(errorMsg);
      console.error('Fetch decision error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewForm.actualOutcome.trim() || !reviewForm.lessonsLearned.trim()) {
      setError('Actual outcome and lessons learned are required');
      return;
    }

    try {
      setReviewLoading(true);
      await reviewsService.create(decisionId, {
        actualOutcome: reviewForm.actualOutcome.trim(),
        lessonsLearned: reviewForm.lessonsLearned.trim(),
        wouldDoDiff: reviewForm.wouldDoDiff.trim() || undefined,
      });

      // Refresh decision to show review
      await fetchDecision();
      setShowReviewForm(false);
      setReviewForm({ actualOutcome: '', lessonsLearned: '', wouldDoDiff: '' });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit review';
      setError(errorMsg);
      console.error('Submit review error:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await decisionsService.delete(decisionId);
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete decision';
      setError(errorMsg);
      console.error('Delete decision error:', err);
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 relative overflow-hidden">
        <nav className="backdrop-blur-xl bg-black/40 border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-300 hover:text-white transition duration-200"
            >
              ← Back
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <p className="text-red-300 text-center">{error || 'Decision not found'}</p>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Decision Header */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{decision.title}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    decision.status === 'PENDING'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}
                >
                  {decision.status === 'PENDING' ? '⏳ Pending Review' : '✓ Reviewed'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:border-red-500/50 transition duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>

          {/* Tags */}
          {decision.tags && decision.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {decision.tags.map((decisionTag) => (
                <span
                  key={decisionTag.tagId}
                  className="px-3 py-1 text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full"
                >
                  #{decisionTag.tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="text-gray-400 text-sm space-y-1">
            <p>Created: {new Date(decision.createdAt).toLocaleDateString()} at {new Date(decision.createdAt).toLocaleTimeString()}</p>
            {decision.updatedAt !== decision.createdAt && (
              <p>Updated: {new Date(decision.updatedAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Decision Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Context */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Context & Background</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{decision.context}</p>
          </div>

          {/* Expected Outcome */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Expected Outcome</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{decision.expectedOutcome}</p>
          </div>
        </div>

        {/* Review Section */}
        {decision.review ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Decision Review
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Actual Outcome</h3>
                <p className="text-gray-300 whitespace-pre-wrap bg-white/5 p-4 rounded-lg">
                  {decision.review.actualOutcome}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Lessons Learned</h3>
                <p className="text-gray-300 whitespace-pre-wrap bg-white/5 p-4 rounded-lg">
                  {decision.review.lessonsLearned}
                </p>
              </div>

              {decision.review.wouldDoDiff && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What Would You Do Differently?</h3>
                  <p className="text-gray-300 whitespace-pre-wrap bg-white/5 p-4 rounded-lg">
                    {decision.review.wouldDoDiff}
                  </p>
                </div>
              )}

              <p className="text-gray-500 text-sm">
                Reviewed on {new Date(decision.review.reviewedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {!showReviewForm ? (
              <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center mb-8">
                <p className="text-yellow-300 mb-4">This decision is pending review</p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  Add Review
                </button>
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Add Review</h2>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Actual Outcome */}
                  <div>
                    <label htmlFor="actualOutcome" className="block text-sm font-semibold text-gray-200 mb-3">
                      What Actually Happened?
                    </label>
                    <textarea
                      id="actualOutcome"
                      name="actualOutcome"
                      value={reviewForm.actualOutcome}
                      onChange={handleReviewChange}
                      placeholder="Describe the actual outcome of this decision..."
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-none"
                      disabled={reviewLoading}
                    />
                  </div>

                  {/* Lessons Learned */}
                  <div>
                    <label htmlFor="lessonsLearned" className="block text-sm font-semibold text-gray-200 mb-3">
                      Lessons Learned
                    </label>
                    <textarea
                      id="lessonsLearned"
                      name="lessonsLearned"
                      value={reviewForm.lessonsLearned}
                      onChange={handleReviewChange}
                      placeholder="What did you learn from this decision?"
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-none"
                      disabled={reviewLoading}
                    />
                  </div>

                  {/* Would Do Differently */}
                  <div>
                    <label htmlFor="wouldDoDiff" className="block text-sm font-semibold text-gray-200 mb-3">
                      What Would You Do Differently? (Optional)
                    </label>
                    <textarea
                      id="wouldDoDiff"
                      name="wouldDoDiff"
                      value={reviewForm.wouldDoDiff}
                      onChange={handleReviewChange}
                      placeholder="If you could do it again, what would you change?"
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-none"
                      disabled={reviewLoading}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2"
                    >
                      {reviewLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      disabled={reviewLoading}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 border border-white/20 text-white font-semibold rounded-xl transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="backdrop-blur-xl bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md mx-4">
              <h2 className="text-2xl font-bold text-white mb-4">Delete Decision</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{decision?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
