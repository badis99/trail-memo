'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();

  const [name, setName] = useState('');  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await authService.signUp({ name, email, password });
      router.push('/dashboard');  // ← Redirect on success
    } catch (err: any) {
      // Handle different error types
        setError('Credentials Taken');
    console.log({ name,email, password });
  };
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-950 px-4 relative overflow-hidden">
      {/* Animated Background Blobs - Darker colors */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Glass Card - Dark theme */}
      <div className="max-w-md w-full backdrop-blur-xl bg-black/40 p-8 rounded-3xl shadow-2xl border border-white/10 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            TrailMemo
          </h1>
          <p className="text-gray-300">Your decision-making companion</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor='name'>
              UserName
            </label>
            <input
                id='name'
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor='email'>
              Email Address
            </label>
            <input
                id='email'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor='password'>
              Password
            </label>
            <input
                id='password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            Sign Up
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm animate-shake">
            <p className="text-red-300 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}