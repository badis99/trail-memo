'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        console.log('🔐 Attempting login...');
        const result = await authService.signIn({ email, password });
        console.log('✅ Login successful:', result);
    
        const token = localStorage.getItem('access_token');
        console.log('💾 Token saved?', !!token);
    
        console.log('🚀 Redirecting to dashboard...');
        router.push('/dashboard');  // ← Redirect on success
    } catch (err: any) {
        console.error('❌ Login failed:', err);
        setError('Invalid credentials. Please try again.');
    console.log({ email, password });
  };
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-950 px-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-700 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Glass Card */}
      <div className="max-w-md w-full backdrop-blur-2xl bg-gradient-to-b from-white/10 to-white/5 p-10 rounded-2xl shadow-2xl border border-white/15 relative z-10 fade-in-down group hover:border-white/25 transition-all duration-500">
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500 -z-10"></div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            TrailMemo
          </h1>
          <p className="text-gray-400 text-sm font-medium">Your decision-making companion</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="scale-in" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-semibold text-gray-200 mb-2.5" htmlFor='email'>
              Email Address
            </label>
            <input
              id='email'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 shadow-sm hover:border-white/30"
            />
          </div>

          <div className="scale-in" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-semibold text-gray-200 mb-2.5" htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 shadow-sm hover:border-white/30"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary mt-8 scale-in shadow-xl hover:shadow-2xl"
            style={{ animationDelay: '0.4s' }}
          >
            Sign In
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-white/10 to-white/5 text-gray-400">or</span>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm scale-in" style={{ animationDelay: '0.5s' }}>
          Don't have an account?{' '}
          <Link 
            href="/signup" 
            className="text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text font-semibold hover:from-purple-300 hover:to-indigo-200 transition-all duration-300"
          >
            Create one
          </Link>
        </p>

        {error && (
          <div className="mt-6 p-4 bg-red-500/15 border border-red-500/40 rounded-xl backdrop-blur-sm fade-in">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-300 text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}