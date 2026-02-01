'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { decisionsService } from '@/services/decisions.service';
import { tagsService, Tag } from '@/services/tags.service';

export default function NewDecision() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    context: '',
    expectedOutcome: '',
    tagIds: [] as string[],
  });

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const fetchAvailableTags = async () => {
    try {
      setLoadingTags(true);
      const tags = await tagsService.getAll();
      setAvailableTags(tags);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleAddTag = (tagId: string) => {
    if (formData.tagIds.includes(tagId)) {
      setError('Tag already added');
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      tagIds: [...prev.tagIds, tagId],
    }));
    setError('');
  };

  const handleRemoveTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.filter((id) => id !== tagId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.context.trim()) {
      setError('Context is required');
      return;
    }
    if (!formData.expectedOutcome.trim()) {
      setError('Expected outcome is required');
      return;
    }

    try {
      setLoading(true);
      await decisionsService.create({
        title: formData.title.trim(),
        context: formData.context.trim(),
        expectedOutcome: formData.expectedOutcome.trim(),
        tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined,
      });

      setSuccess('Decision created successfully! Redirecting...');
      setFormData({ title: '', context: '', expectedOutcome: '', tagIds: [] });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create decision';
      setError(errorMsg);
      console.error('Create decision error:', err);
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Page Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Create New Decision</h2>
          <p className="text-gray-300">
            Document your decision-making process with context and expected outcomes
          </p>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-200 mb-3">
                Decision Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Choose project management tool"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-2">Give your decision a clear, concise title</p>
            </div>

            {/* Context Field */}
            <div>
              <label htmlFor="context" className="block text-sm font-semibold text-gray-200 mb-3">
                Context & Background
              </label>
              <textarea
                id="context"
                name="context"
                value={formData.context}
                onChange={handleChange}
                placeholder="Describe the situation, constraints, and factors influencing this decision..."
                rows={5}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-none"
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-2">
                Include relevant information about why this decision needs to be made
              </p>
            </div>

            {/* Expected Outcome Field */}
            <div>
              <label htmlFor="expectedOutcome" className="block text-sm font-semibold text-gray-200 mb-3">
                Expected Outcome
              </label>
              <textarea
                id="expectedOutcome"
                name="expectedOutcome"
                value={formData.expectedOutcome}
                onChange={handleChange}
                placeholder="What do you expect to achieve with this decision? What would success look like?"
                rows={5}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-none"
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-2">
                Describe the desired results and how you'll measure success
              </p>
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Tags (Optional)
              </label>
              
              {loadingTags ? (
                <div className="text-gray-400 text-sm">Loading available tags...</div>
              ) : availableTags.length === 0 ? (
                <div className="text-gray-400 text-sm">No tags available</div>
              ) : (
                <>
                  {/* Available Tags */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {availableTags.map((tag) => {
                      const isSelected = formData.tagIds.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleAddTag(tag.id)}
                          disabled={loading}
                          className={`px-3 py-2 rounded-lg font-medium text-sm transition duration-200 ${
                            isSelected
                              ? 'bg-purple-600 text-white border border-purple-500'
                              : 'bg-white/10 text-gray-300 border border-white/20 hover:border-purple-500/50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          #{tag.name}
                          {isSelected && <span className="ml-1">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Selected Tags */}
                  {formData.tagIds.length > 0 && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <p className="text-gray-300 text-xs font-medium mb-2">Selected Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tagIds.map((tagId) => {
                          const tag = availableTags.find((t) => t.id === tagId);
                          return (
                            <span
                              key={tagId}
                              className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium flex items-center gap-2"
                            >
                              #{tag?.name}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tagId)}
                                className="hover:text-purple-100 transition font-bold"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm animate-shake">
                <p className="text-red-300 text-sm font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl backdrop-blur-sm animate-pulse">
                <p className="text-green-300 text-sm font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Decision
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 border border-white/20 text-white font-semibold rounded-xl transition duration-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
              Tips for Better Decisions
            </h3>
            <ul className="text-gray-300 text-sm space-y-1 ml-7">
              <li>• Be specific and clear about what decision needs to be made</li>
              <li>• Include all relevant context and background information</li>
              <li>• Define measurable success criteria</li>
              <li>• Consider constraints and dependencies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
